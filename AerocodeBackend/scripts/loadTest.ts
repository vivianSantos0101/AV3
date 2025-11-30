import fetch from 'node-fetch';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import QuickChart from 'quickchart-js';
import path from 'path';

dotenv.config();

// CONFIGURAÇÃO GLOBAL BÁSICA

const JWT_SECRET: string = process.env.JWT_SECRET || 'INDEFINIDO';
const TEST_PAYLOAD = { id: 9999, usuario: 'loadtest_user', nivelAcesso: 'ADMIN' };
const ITERATIONS_PER_SCENARIO: number = 5;
const CENARIOS_USUARIOS: number[] = [1, 5, 10];
const ENDPOINTS_TESTE: string[] = [
    'http://localhost:3000/api/v1/aeronaves',
    'http://localhost:3000/api/v1/colaboradores',
    'http://localhost:3000/api/v1/componentes',
];
const OUTPUT_DIR = 'scripts'

// DEFINIÇÕES DE TIPOS

interface Metricas {
    processamento: number;
    latencia: number;
    resposta: number;
}
interface ResultadoMedio {
    processamento: string;
    latencia: string;
    resposta: string;
}
interface ResultadosFinais {
    [endpoint: string]: {
        [scenario: string]: ResultadoMedio | null;
    };
}


// FUNÇÕES DE AUTENTICAÇÃO E TESTE

function generateTestToken(secret: string, payload: any): string {
    return jwt.sign(payload, secret, { expiresIn: '100y' });
}

async function runSingleTest(apiUrl: string, token: string): Promise<Metricas | null> {
    const startTime: number = Date.now();
    const cacheBuster = `${Date.now()}_${Math.random()}`;
    const separator = apiUrl.includes('?') ? '&' : '?';
    const uniqueUrl = `${apiUrl}${separator}cachebuster=${cacheBuster}`;

    try {
        const response = await fetch(uniqueUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
            console.error(`❌ Erro 401: Falha na autenticação.`);
            return null;
        }
        if (!response.ok) {
            console.error(`Erro HTTP! Status: ${response.status} na URL: ${uniqueUrl}`);
            return null;
        }

        const endTime: number = Date.now();
        const procTimeStr: string | null = response.headers.get('x-processing-time');
        const processingTime: number = parseFloat(procTimeStr || '0');
        const responseTime: number = endTime - startTime;
        const latency: number = responseTime - processingTime;

        return { processamento: processingTime, latencia: latency, resposta: responseTime };
    } catch (error) {
        console.error(`Erro ao testar ${apiUrl}:`, error);
        return null;
    }
}

async function runConcurrentBatch(concurrentUsers: number, apiUrl: string, token: string): Promise<Metricas | null> {
    const promises: Promise<Metricas | null>[] = Array(concurrentUsers)
        .fill(0)
        .map(() => runSingleTest(apiUrl, token));

    const results: Metricas[] = (await Promise.all(promises)).filter((r): r is Metricas => r !== null);

    if (results.length === 0) return null;

    const totalMetrics = results.reduce((acc, current) => ({
        processamento: acc.processamento + current.processamento,
        latencia: acc.latencia + current.latencia,
        resposta: acc.resposta + current.resposta,
    }), { processamento: 0, latencia: 0, resposta: 0 });

    const numResults = results.length;
    return {
        processamento: totalMetrics.processamento / numResults,
        latencia: totalMetrics.latencia / numResults,
        resposta: totalMetrics.resposta / numResults,
    };
}

async function runScenario(concurrentUsers: number, apiUrl: string, token: string, iterations: number): Promise<ResultadoMedio | null> {
    const allAverages: Metricas[] = [];
    console.log(`\n---> Rodando cenário (${concurrentUsers} usuários) ${iterations} vezes...`);

    for (let i = 1; i <= iterations; i++) {
        const avgBatch = await runConcurrentBatch(concurrentUsers, apiUrl, token);
        if (avgBatch) {
            allAverages.push(avgBatch);
            console.log(`Rodada ${i}: processamento=${avgBatch.processamento.toFixed(3)}ms, latencia=${avgBatch.latencia.toFixed(3)}ms, resposta=${avgBatch.resposta.toFixed(3)}ms`);
        } else {
            console.log(`Rodada ${i}: Nenhum resultado válido.`);
        }
    }

    if (allAverages.length === 0) {
        console.log("Nenhum resultado válido obtido após as iterações.");
        return null;
    }

    const finalTotalMetrics = allAverages.reduce((acc, current) => ({
        processamento: acc.processamento + current.processamento,
        latencia: acc.latencia + current.latencia,
        resposta: acc.resposta + current.resposta,
    }), { processamento: 0, latencia: 0, resposta: 0 });

    const numFinalResults = allAverages.length;

    const avgMetrics: ResultadoMedio = {
        processamento: (finalTotalMetrics.processamento / numFinalResults).toFixed(3),
        latencia: (finalTotalMetrics.latencia / numFinalResults).toFixed(3),
        resposta: (finalTotalMetrics.resposta / numFinalResults).toFixed(3),
    };

    console.log(` MÉDIA FINAL de ${numFinalResults} rodadas:`, avgMetrics);
    return avgMetrics;
}


// GERAÇÃO DE GRÁFICOS

function prepareChartData(results: { [scenario: string]: ResultadoMedio | null }): { labels: string[], datasets: { metric: string, data: number[] }[] } {
    const labels: string[] = [];
    const processingData: number[] = [];
    const latencyData: number[] = [];
    const responseData: number[] = [];

    const orderedScenarios = Object.keys(results).sort((a, b) => parseInt(a) - parseInt(b)); 

    for (const scenario of orderedScenarios) {
        const data = results[scenario];
        if (data) {
            labels.push(scenario);
            processingData.push(parseFloat(data.processamento));
            latencyData.push(parseFloat(data.latencia));
            responseData.push(parseFloat(data.resposta));
        }
    }

    return {
        labels,
        datasets: [
            { metric: "Processamento", data: processingData },
            { metric: "Latência", data: latencyData },
            { metric: "Resposta", data: responseData }
        ]
    };
}

async function generateAndSaveCharts(data: any, endpointLabel: string): Promise<void> {
    const { labels, datasets } = data;

    const finalDatasets = [
        { 
            label: 'Processamento (ms)', 
            data: datasets.find((d: any) => d.metric === 'Processamento').data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            fill: false,
            tension: 0.1
        },
        { 
            label: 'Latência (ms)', 
            data: datasets.find((d: any) => d.metric === 'Latência').data,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            fill: false,
            tension: 0.1
        },
        { 
            label: 'Resposta Total (ms)', 
            data: datasets.find((d: any) => d.metric === 'Resposta').data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            fill: false,
            tension: 0.1,
            borderWidth: 3
        }
    ];

    const chart = new QuickChart();
    chart.setConfig({
        type: 'line',
        data: { labels, datasets: finalDatasets },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: `Performance do Sistema: ${endpointLabel} (Média ${ITERATIONS_PER_SCENARIO} Rodadas)` } },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Tempo (ms)' } },
                x: { title: { display: true, text: 'Cenários de Usuários Concorrentes' } }
            }
        }
    });

    chart.setWidth(1000).setHeight(500);
    const fileName = path.join(OUTPUT_DIR, `grafico_${endpointLabel.replace(/[^a-z0-9]/gi,'_')}_${new Date().toISOString().slice(0,10)}.png`);
    try {
        await chart.toFile(fileName);
        console.log(`🎉 Gráfico salvo: ${fileName}`);
    } catch (error) {
        console.error(`❌ Erro ao salvar gráfico:`, error);
    }
}


// EXPORTAÇÃO CSV

function exportToCSV(finalResults: ResultadosFinais): void {
    const csvData: string[] = [];
    csvData.push("Cenario,Endpoint,Processamento(ms),Latencia(ms),Resposta(ms)");

    for (const endpoint in finalResults) {
        const endpointResults = finalResults[endpoint];
        for (const scenario in endpointResults) {
            const data = endpointResults[scenario];
            if (data) {
                const line = `"${scenario}","${endpoint}",${data.processamento},${data.latencia},${data.resposta}`;
                csvData.push(line);
            }
        }
    }

    const csvContent = csvData.join('\n');
    const fileName = path.join(OUTPUT_DIR, `metricas_loadtest_${new Date().toISOString().slice(0,10)}.csv`);

    try {
        fs.writeFileSync(fileName, csvContent, 'utf-8');
        console.log(`✅ CSV salvo: ${fileName}`);
    } catch (error) {
        console.error("❌ Erro ao salvar CSV:", error);
    }
}


// FUNÇÃO PRINCIPAL

async function main(): Promise<void> {
    try {
        if (JWT_SECRET === 'INDEFINIDO' || ENDPOINTS_TESTE[0].includes('SUA_URL_REAL')) {
            console.error("\n[ERRO FATAL] 🚨 JWT_SECRET ou ENDPOINT_TESTE não configurados.");
            return;
        }

        const tokenDeTeste = generateTestToken(JWT_SECRET, TEST_PAYLOAD);
        console.log(`🔑 Token de teste gerado com sucesso.`);

        console.log(`\n🔥 WARM-UP (1 requisição)...`);
        await runSingleTest(ENDPOINTS_TESTE[0], tokenDeTeste);

        const finalResults: ResultadosFinais = {};

        for (const endpoint of ENDPOINTS_TESTE) {
            const endpointResults: { [key: string]: ResultadoMedio | null } = {};
            console.log(`\n######################################################`);
            console.log(`TESTES PARA ENDPOINT: ${endpoint}`);
            console.log(`######################################################`);

            for (const users of CENARIOS_USUARIOS) {
                endpointResults[`${users} Usuário(s)`] = await runScenario(users, endpoint, tokenDeTeste, ITERATIONS_PER_SCENARIO);
            }
            finalResults[endpoint] = endpointResults;

            // Gerar gráfico por endpoint
            const dataForCharts = prepareChartData(endpointResults);
            await generateAndSaveCharts(dataForCharts, endpoint);
        }

        exportToCSV(finalResults);

        console.log('\n======================================================');
        console.log('FIM DA EXECUÇÃO. Verifique os arquivos CSV e PNG gerados.');
        console.log('======================================================');

    } catch (error) {
        console.error('Erro na execução do load test:', error);
    }
}

main();

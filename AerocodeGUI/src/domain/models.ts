// --- ENUMS ---

export const TipoAeronave = {
    COMERCIAL: "COMERCIAL",
    MILITAR: "MILITAR",
} as const;
export type TipoAeronave = typeof TipoAeronave[keyof typeof TipoAeronave];

export const TipoComponente = {
    NACIONAL: "NACIONAL",
    IMPORTADA: "IMPORTADA",
} as const;
export type TipoComponente = typeof TipoComponente[keyof typeof TipoComponente];

export const StatusComponente = {
    EM_PRODUCAO: "EM_PRODUCAO",
    EM_TRANSPORTE: "EM_TRANSPORTE",
    PRONTA: "PRONTA",
} as const;
export type StatusComponente = typeof StatusComponente[keyof typeof StatusComponente];

export const StatusFase = {
    PENDENTE: "PENDENTE",
    ANDAMENTO: "ANDAMENTO",
    CONCLUIDA: "CONCLUIDA",
} as const;
export type StatusFase = typeof StatusFase[keyof typeof StatusFase];

export const NivelAcesso = {
    ADMINISTRADOR: "ADMINISTRADOR",
    ENGENHEIRO: "ENGENHEIRO",
    OPERADOR: "OPERADOR",
} as const;
export type NivelAcesso = typeof NivelAcesso[keyof typeof NivelAcesso];

export const TipoTeste = {
    ELETRICO: "ELETRICO",
    HIDRAULICO: "HIDRAULICO",
    AERODINAMICO: "AERODINAMICO",
} as const;
export type TipoTeste = typeof TipoTeste[keyof typeof TipoTeste];

export const ResultadoTeste = {
    APROVADO: "APROVADO",
    REPROVADO: "REPROVADO",
} as const;
export type ResultadoTeste = typeof ResultadoTeste[keyof typeof ResultadoTeste];


// --- LABELS ---

export const TipoAeronaveLabel: Record<TipoAeronave, string> = {
    [TipoAeronave.COMERCIAL]: "Comercial",
    [TipoAeronave.MILITAR]: "Militar",
};

export const TipoComponenteLabel: Record<TipoComponente, string> = {
    [TipoComponente.NACIONAL]: "Nacional",
    [TipoComponente.IMPORTADA]: "Importada",
};

export const StatusComponenteLabel: Record<StatusComponente, string> = {
    [StatusComponente.EM_PRODUCAO]: "Em produção",
    [StatusComponente.EM_TRANSPORTE]: "Em transporte",
    [StatusComponente.PRONTA]: "Pronta",
};

export const StatusFaseLabel: Record<StatusFase, string> = {
    [StatusFase.PENDENTE]: "Pendente",
    [StatusFase.ANDAMENTO]: "Em andamento",
    [StatusFase.CONCLUIDA]: "Concluída",
};

export const NivelAcessoLabel: Record<NivelAcesso, string> = {
    [NivelAcesso.ADMINISTRADOR]: "Administrador",
    [NivelAcesso.ENGENHEIRO]: "Engenheiro",
    [NivelAcesso.OPERADOR]: "Operador",
};

export const TipoTesteLabel: Record<TipoTeste, string> = {
    [TipoTeste.ELETRICO]: "Elétrico",
    [TipoTeste.HIDRAULICO]: "Hidráulico",
    [TipoTeste.AERODINAMICO]: "Aerodinâmico",
};

export const ResultadoTesteLabel: Record<ResultadoTeste, string> = {
    [ResultadoTeste.APROVADO]: "Aprovado",
    [ResultadoTeste.REPROVADO]: "Reprovado",
};



// --- CLASSES DE MODELO  ---

export interface IColaborador {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    usuario?: string;
    nivelAcesso: NivelAcesso;
}

export interface IComponente {
    id: number;
    nome: string;
    tipo: TipoComponente; 
    fornecedor: string;
    status: StatusComponente; 
}

export interface IFaseProducao {
    id: number;
    nome: string;
    prazo: string;
    status: StatusFase;
    colaboradores: IColaborador[]
}

export interface ITeste {
    tipo: TipoTeste;
    resultado: ResultadoTeste;
}

export interface IProjetoAeronave {
    id: number;
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    componentes?: IComponente[]; 
    fases?: IFaseProducao[]; 
    testes?: ITeste[];
    _completo?: boolean; 
}

export class Relatorio { // (Mantido)
    
    public gerarRelatorio(projeto: IProjetoAeronave): string { 
        console.log(`Gerando relatório para o projeto ${projeto.codigo}...`);
        
        let conteudo = "******************************************************\n";
        conteudo += "      * RELATÓRIO FINAL DE PRODUÇÃO DE AERONAVE *\n";
        conteudo += "******************************************************\n\n";

        // Seção 1: Detalhes da Aeronave
        conteudo += "--- 1. DADOS DA AERONAVE ---\n";
        conteudo += `Código: ${projeto.codigo}\n`;
        conteudo += `Modelo: ${projeto.modelo}\n`;
        conteudo += `Tipo: ${projeto.tipo}\n`;
        conteudo += `Capacidade: ${projeto.capacidade} passageiros\n`;
        conteudo += `Alcance: ${projeto.alcance} km\n\n`;

        // Seção 2: Peças Utilizadas
        conteudo += "--- 2. COMPONENTES UTILIZADOS ---\n"; 
        if (projeto.componentes?.length === 0) {
            conteudo += "Nenhum componente registrado.\n";
        } else {
            projeto.componentes?.forEach(componente => {
                conteudo += `- Componente: ${componente.nome} (Fornecedor: ${componente.fornecedor})\n`;
                conteudo += `  Tipo: ${TipoComponenteLabel[componente.tipo]}\n`;
                conteudo += `  Status Final: ${StatusComponenteLabel[componente.status]}\n`;
            });
        }
        conteudo += "\n";

        // Seção 3: Etapas de Produção
        conteudo += "--- 3. FASES DE PRODUÇÃO ---\n"; 
        if (projeto.fases?.length === 0) {
            conteudo += "Nenhuma fase de produção registrada.\n";
        } else {
            projeto.fases?.forEach((fase, index) => {
                conteudo += `${index + 1}. Fase: ${fase.nome}\n`;
                conteudo += `   Prazo: ${fase.prazo}\n`;
                conteudo += `   Status: ${StatusFaseLabel[fase.status]}\n`;
                const nomesColaboradores = fase.colaboradores.map(f => f.nome).join(', '); 
                conteudo += `   Responsáveis: ${nomesColaboradores || 'Nenhum'}\n`;
            });
        }
        conteudo += "\n";

        // Seção 4: Testes Realizados
        conteudo += "--- 4. TESTES DE QUALIDADE ---\n";
        if (projeto.testes?.length === 0) {
            conteudo += "Nenhum teste registrado.\n";
        } else {
            projeto.testes?.forEach(teste => {
                conteudo += `- Teste de ${TipoTesteLabel[teste.tipo]}: ${ResultadoTesteLabel[teste.resultado]}\n`;
            });
        }
        conteudo += "\n";

        conteudo += "******************************************************\n";
        conteudo += "           * AERONAVE PRONTA PARA ENTREGA *\n";
        conteudo += "******************************************************\n";

        return conteudo;
    }

    public salvarEmArquivoWeb(relatorioConteudo: string, codigoProjeto: string): void { 
        const nomeArquivo = `Relatorio-Projeto-${codigoProjeto}.txt`; 
        const blob = new Blob([relatorioConteudo], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(`Relatório ${nomeArquivo} enviado para download.`);
    }
}
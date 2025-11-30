import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";
import { TabSystem } from "../components/ui/TabSystem";
import { ComponentesManager } from "../components/ComponentesManager";
import { FasesManager } from "../components/FasesManager";
import { TestesManager } from "../components/TestesManager";
import './DashboardPage.css'; 
import { useEffect } from "react";
import { Relatorio } from "../domain/models";

export function ProjetoDetailPage() {
    const { codigo } = useParams<{ codigo: string }>();
    const navigate = useNavigate();
    const { projetos } = useStore();
    const { fetchProjetos, fetchColaboradores } = useStore();

    
    const projeto = projetos.find(p => p.codigo === codigo);

    useEffect(() => {
        console.log(projeto)

        if (!projeto?._completo) {
            fetchProjetos({ includeComponentes: true, includeFasesEColaboradores: true, includeTestes: true });
        }

        fetchColaboradores();
    }, [projeto]);


    if (!projeto) {
        return (
            <div className="page-container">
                <h2 className="page-header">Projeto não encontrado</h2>
                <button onClick={() => navigate("/dashboard")} className="btn-secondary">
                    Voltar para o Painel
                </button>
            </div>
        );
    }

    
    const handleGerarRelatorio = async () => {
        const relatorio = await fetch(`http://localhost:3000/api/v1/relatorios/aeronaves/${projeto.id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })

        const response = await relatorio.json();

        if (relatorio.ok) {
            console.log("Relatorio criado", response);
        } else {
            console.log("Erro no ENDPOINT relatorios/aeronaves/:id", response)
            return;
        }

        const relatorioTXT = new Relatorio();
        const conteudo = relatorioTXT.gerarRelatorio(response);
        relatorioTXT.salvarEmArquivoWeb(conteudo, projeto.codigo);
        console.log("Relatório gerado e enviado para download.");
    };

    
    const projectTabs = [
        {
            id: 'componentes',
            label: 'Componentes (Peças)',
            content: <ComponentesManager projeto={projeto} /> 
        },
        {
            id: 'fases',
            label: 'Fases (Etapas)',
            content: <FasesManager projeto={projeto} /> 
        },
        {
            id: 'testes',
            label: 'Testes de Qualidade',
            content: <TestesManager projeto={projeto} /> 
        },
    ];

    return (
        <div className="page-container">
            <div className="page-header">
               
                <h2 style={{ fontSize: '1.8rem' }}>
                    <button onClick={() => navigate("/dashboard")} className="btn-link" style={{ marginRight: '10px', color: '#64748b', fontSize: '1.2rem', textDecoration: 'none' }}>&larr; </button>
                    Gerenciando Projeto: {projeto.modelo} ({projeto.codigo})
                </h2>

       
                <button className="btn-primary" onClick={handleGerarRelatorio} style={{ backgroundColor: '#3226dcff', border: 'none' }}>
                    Gerar Relatório Final
                </button>
            </div>

            <TabSystem tabs={projectTabs} />
        </div>
    );
}
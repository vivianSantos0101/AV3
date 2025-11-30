import { useEffect, useState } from "react";
import { useStore } from "../contexts/StoreContext";
import { FormModal } from "../components/ui/FormModal";
import { AddProjetoForm } from "../components/forms/AddProjetoForm";
import { ProjectCard } from "../components/ui/ProjectCard";
import './DashboardPage.css'; 

export function DashboardPage() {
    
    const { projetos, fetchProjetos, fetchColaboradores, loadingProjetos } = useStore();
    const [isModalAberto, setIsModalAberto] = useState(false);

    useEffect(() => {
        fetchProjetos({includeFases: true});
        fetchColaboradores();
    }, [])

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Painel de Projetos</h2>
               
                <button onClick={() => setIsModalAberto(true)} className="btn-primary">
                    + Cadastrar Novo Projeto
                </button>
            </div>

           
            <div className="projects-grid">
                {loadingProjetos ? (
                    
                    <div className="loading-message">Carregando projetos...</div>
                ) : projetos.length === 0 ? (
                    <div className="no-projects-message">
                        Nenhum projeto cadastrado.
                    </div>
                ) : (
                    projetos.map(projeto => (
                        <ProjectCard key={projeto.codigo} projeto={projeto} />
                    ))
                )}
            </div>

         
            <FormModal isOpen={isModalAberto} onClose={() => setIsModalAberto(false)}>
                <AddProjetoForm onClose={() => setIsModalAberto(false)} />
            </FormModal>
        </div>
    );
}
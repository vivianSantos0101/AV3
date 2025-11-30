import { useNavigate } from 'react-router-dom';
import { type IProjetoAeronave, StatusFase } from '../../domain/models';
import './ProjectCard.css'; 

interface Props {
    projeto: IProjetoAeronave;
}


function getStatusProducao(projeto: IProjetoAeronave): string {
    const fases = projeto.fases ?? []; 
    const faseEmAndamento = fases.find(e => e.status === StatusFase.ANDAMENTO);
    if (faseEmAndamento) {
        return `Em Andamento: ${faseEmAndamento.nome}`;
    }
    const proximaFase = fases.find(e => e.status === StatusFase.PENDENTE);
    if (proximaFase) {
        return `Pendente: ${proximaFase.nome}`;
    }
    if (fases.length > 0 && fases.every(e => e.status === StatusFase.CONCLUIDA)) {
        return "Produção Concluída";
    }
    return "Aguardando Planejamento";
}

export function ProjectCard({ projeto }: Props) {
    const navigate = useNavigate();

    const handleGerenciar = () => {
       
        navigate(`/projeto/${projeto.codigo}`);
    };

    const statusTexto = getStatusProducao(projeto);

    return (
        <div className="project-card">
            <div className="card-header">
                <span className="card-codigo">{projeto.codigo}</span>
            </div>
            <div className="card-body">
                <h3 className="card-modelo">{projeto.modelo}</h3>
                <p className="card-tipo">{projeto.tipo}</p>
            </div>
            <div className="card-status">
                <strong>Status Atual:</strong>
                <p>{statusTexto}</p>
            </div>
            <div className="card-footer">
                <button onClick={handleGerenciar} className="card-button">
                    Gerenciar Projeto
                </button>
            </div>
        </div>
    );
}
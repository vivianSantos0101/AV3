import { useState } from 'react';
import { type IProjetoAeronave, type IColaborador, type IFaseProducao, StatusFase } from '../domain/models';
import { useStore } from '../contexts/StoreContext';
import { FormModal } from './ui/FormModal';
import { AddFaseForm } from './forms/AddFaseForm';
import { AssociarColaboradorForm } from './forms/AssociarColaboradorForm';
import '../components/ManagerStyles.css'; 

interface Props {
 
    projeto: IProjetoAeronave;
}


export function FasesManager({ projeto }: Props) {
    const { fetchProjetoById } = useStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [faseParaAssociar, setFaseParaAssociar] = useState<IFaseProducao | null>(null);
    const handleIniciarProxima = async () => {
        const iniciarProximaFase = await fetch(`http://localhost:3000/api/v1/etapas/iniciar`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projetoId: projeto.id }),
            credentials: "include"
        })

        const response = await iniciarProximaFase.json()


        if (iniciarProximaFase.ok) {
            await fetchProjetoById(projeto.id);
            console.log('Fase inciada', response)
            alert(`Fase ${(response as IFaseProducao).nome} iniciada`);
        } else {
            console.log("Erro no ENDPOINT", response)
            alert(`Fase ${response.error}`);
        }
    }

    const handleFinalizarAtual = async () => {
        const iniciarProximaFase = await fetch(`http://localhost:3000/api/v1/etapas/concluir`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projetoId: projeto.id }),
            credentials: "include"
        })

        const response = await iniciarProximaFase.json()

        if (iniciarProximaFase.ok) {
            await fetchProjetoById(projeto.id);
            console.log('Fase concluida', response)
            alert(`Fase ${(response as IFaseProducao).nome} concluida`);
        } else {
            console.log("Erro no ENDPOINT", response)
            alert(`Fase ${response.error}`);
        }
    }


    const handleAssociarColaborador = (fase: IFaseProducao) => {
        setFaseParaAssociar(fase);
    }

   
    const getStatusClass = (status: StatusFase) => {
        switch (status) {
            case StatusFase.CONCLUIDA: return 'status-concluída';
            case StatusFase.ANDAMENTO: return 'status-em-andamento';
            case StatusFase.PENDENTE: return 'status-pendente';
            default: return '';
        }
    }


    return (
        <div className="manager-tab-content">
            <div className="manager-actions">
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ marginRight: '10px' }}>
                    + Adicionar Fase
                </button>
                <button onClick={handleIniciarProxima} className="btn-secondary btn-small" style={{ marginRight: '10px' }}>
                    Iniciar Próxima Fase
                </button>
                <button onClick={handleFinalizarAtual} className="btn-secondary btn-small">
                    Finalizar Fase Atual
                </button>
            </div>

            <div className="manager-list">
                {projeto.fases?.length === 0 ? (
                    <p className="empty-state-message">Nenhuma fase de produção cadastrada para este projeto.</p>
                ) : (
               
                    <table className="manager-data-table">
                        <thead>
                            <tr>
                                <th>Ordem</th>
                                <th>Nome da Fase</th>
                                <th>Prazo</th>
                                <th>Status</th>
                                <th>Colaboradores</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                          
                            {projeto.fases?.map((fase, index) => {
                          
                                const nomesColaboradores = fase.colaboradores.map((f: IColaborador) => f.nome).join(', ');

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{fase.nome}</td>
                                        <td>{fase.prazo}</td>
                                       
                                        <td className={getStatusClass(fase.status)}>{fase.status}</td>
                                        <td>{nomesColaboradores || 'Nenhum'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleAssociarColaborador(fase)}
                                                className="btn-secondary btn-small"
                                            >
                                                Associar Colaborador
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <FormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddFaseForm
                    projeto={projeto}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </FormModal>

           
            <FormModal isOpen={!!faseParaAssociar} onClose={() => setFaseParaAssociar(null)}>
                {faseParaAssociar && (
                    <AssociarColaboradorForm
                        projeto={projeto}
                        fase={faseParaAssociar}
                        onClose={() => setFaseParaAssociar(null)}
                    />
                )}
            </FormModal>
        </div>
    );
}
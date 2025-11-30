import { useState } from 'react';
import { type IProjetoAeronave, type IComponente, StatusComponente } from '../domain/models';
import { FormModal } from './ui/FormModal';
import { AddComponenteForm } from './forms/AddComponenteForm';
import { UpdateComponenteStatusForm } from './forms/UpdateComponenteStatusForm'; 
import '../components/ManagerStyles.css'; 

interface Props {
    projeto: IProjetoAeronave;
}


const getStatusClass = (status: StatusComponente) => {
    switch(status) {
        case StatusComponente.PRONTA: return 'status-pronta';
        case StatusComponente.EM_PRODUCAO: return 'status-em-produção';
        case StatusComponente.EM_TRANSPORTE: return 'status-em-transporte';
        default: return '';
    }
}

export function ComponentesManager({ projeto }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    

    const [componenteParaEditar, setComponenteParaEditar] = useState<IComponente | null>(null);

    const handleUpdateStatus = (componente: IComponente) => {
        setComponenteParaEditar(componente);
    }

    return (
        <div className="manager-tab-content">
            <h2>Gerenciar Componentes: {projeto.codigo}</h2>
            
            <div className="manager-actions">
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                    + Adicionar Componente
                </button>
            </div>

            <div className="manager-list">
                {projeto.componentes?.length === 0 ? (
                    <p className="empty-state-message">Nenhum componente cadastrado para este projeto.</p>
                ) : (
                   
                    <table className="manager-data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Fornecedor</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projeto.componentes?.map((componente, index) => (
                                <tr key={index}>
                                    <td>{componente.nome}</td>
                                    <td>{componente.fornecedor}</td>
                                    <td>{componente.tipo}</td>
                                   
                                    <td className={getStatusClass(componente.status)}>{componente.status}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleUpdateStatus(componente)} 
                                            className="btn-secondary btn-small"
                                        >
                                            Atualizar Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        
            <FormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <AddComponenteForm 
                    projeto={projeto} 
                    onClose={() => setIsAddModalOpen(false)} 
                />
            </FormModal>

            
            <FormModal isOpen={!!componenteParaEditar} onClose={() => setComponenteParaEditar(null)}>
                {componenteParaEditar && ( 
                    <UpdateComponenteStatusForm
                        projeto={projeto}
                        componente={componenteParaEditar}
                        onClose={() => setComponenteParaEditar(null)}
                    />
                )}
            </FormModal>
        </div>
    );
}
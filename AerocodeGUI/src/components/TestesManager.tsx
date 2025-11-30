import { useState } from 'react';
import { type IProjetoAeronave, ResultadoTeste } from '../domain/models';
import { FormModal } from './ui/FormModal';
import { RegistrarTesteForm } from './forms/RegistrarTesteForm'; 
import '../components/ManagerStyles.css'; 

interface Props {
    projeto: IProjetoAeronave;
}

const getStatusClass = (resultado: ResultadoTeste) => {
    switch(resultado) {
        case ResultadoTeste.APROVADO: return 'status-aprovado';
        case ResultadoTeste.REPROVADO: return 'status-reprovado';
        default: return '';
    }
}

export function TestesManager({ projeto }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="manager-tab-content">
            
            <div className="manager-actions">
             
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    + Registrar Teste
                </button>
            </div>

            <div className="manager-list">
                {projeto.testes?.length === 0 ? (
                    <p className="empty-state-message">Nenhum teste de qualidade registrado para este projeto.</p>
                ) : (
                   
                    <table className="manager-data-table">
                        <thead>
                            <tr>
                                <th>Tipo de Teste</th>
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projeto.testes?.map((teste, index) => (
                                <tr key={index}>
                                    <td>{teste.tipo}</td>
                                  
                                    <td className={getStatusClass(teste.resultado)}>{teste.resultado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

      
            <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <RegistrarTesteForm 
                    projeto={projeto} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </FormModal>
        </div>
    );
}
import { useState, useEffect } from "react";
import { useStore } from "../contexts/StoreContext";
import { useSession } from "../contexts/SessionContext";
import { NivelAcesso } from "../domain/models";
import { FormModal } from "../components/ui/FormModal";
import { AddColaboradorForm } from "../components/forms/AddColaboradorForm";
import './DashboardPage.css'; 
import './ColaboradoresPage.css'; 

export function ColaboradoresPage() {

    const { usuarioAtual } = useSession();
    
    const [isModalAberto, setIsModalAberto] = useState(false);

    const { colaboradores, fetchColaboradores } = useStore();

    useEffect(() => {
        fetchColaboradores()
    }, [])


    if (usuarioAtual?.nivelAcesso !== NivelAcesso.ADMINISTRADOR) {
        return (
            <div className="page-container" style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#dc2626' }}>[ ACESSO NEGADO ]</h2>
                <p>Você não tem permissão para aceder a esta página.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Gestão de Colaboradores</h2>
                <button onClick={() => setIsModalAberto(true)} className="btn-primary">
                    + Cadastrar Novo Colaborador
                </button>
            </div>


            <table className="admin-data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Usuário</th>
                        <th>Nível de Acesso</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>
                    {colaboradores.length === 0 ? (
                        <tr>
                            <td colSpan={4}>Nenhum colaborador cadastrado.</td>
                        </tr>
                    ) : (
                        colaboradores.map(func => (
                            <tr key={func.id}>
                                <td>{func.nome}</td>
                                <td>{func.usuario}</td>
                                <td>{func.nivelAcesso}</td>
                                <td>{func.telefone}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

      
            <FormModal isOpen={isModalAberto} onClose={() => setIsModalAberto(false)}>
                <AddColaboradorForm onClose={() => setIsModalAberto(false)} />
            </FormModal>
        </div>
    );
}
import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { type IProjetoAeronave, type IComponente, StatusComponente, StatusComponenteLabel } from '../../domain/models';
import './FormStyles.css';

interface Props {
    projeto: IProjetoAeronave;
    componente: IComponente; 
    onClose: () => void;
}

export function UpdateComponenteStatusForm({ projeto, componente, onClose }: Props) {

    const [novoStatus, setNovoStatus] = useState(StatusComponenteLabel[componente.status]);
    const { fetchProjetoById } = useStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const componenteAtualizado = await fetch(`http://localhost:3000/api/v1/componentes/${componente.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus}),
            credentials: "include"
        })

        const response = await componenteAtualizado.json();

        if (componenteAtualizado.ok) {
            console.log("Componente Adicionado!", response);
            onClose(); // Fecha o modal
        } else {
            console.log("Erro no ENDPOINT /componentes/:id", response)
            return;
        }

   
        await fetchProjetoById(projeto.id);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Atualizar Status: {componente.nome}</h2>

            <div className="form-group">
                <label htmlFor="status">Novo Status</label>
                <select
                    id="status"
                    value={novoStatus}
                    onChange={e => setNovoStatus(e.target.value as StatusComponente)}
                >
                 
                    {Object.values(StatusComponente).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Status</button>
            </div>
        </form>
    );
}
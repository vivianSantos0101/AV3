import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { type IProjetoAeronave, type IFaseProducao } from '../../domain/models';
import './FormStyles.css';

interface Props {
    projeto: IProjetoAeronave; 
    fase: IFaseProducao; 
    onClose: () => void;
}

export function AssociarColaboradorForm({ projeto, fase, onClose }: Props) {

    const { colaboradores, fetchProjetoById } = useStore();

    const [selectedColaboradorId, setSelectedColaboradorId] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const colaboradorSelecionado = colaboradores.find(f => f.id === Number.parseInt(selectedColaboradorId));

        if (colaboradorSelecionado) {
            const associarColaborador = await fetch(`http://localhost:3000/api/v1/etapas/${fase.id}/colaboradores`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ colaboradorId: colaboradorSelecionado.id }),
                credentials: "include"
            })

            const response = await associarColaborador.json();

            if (associarColaborador.ok) {
                console.log("Colaborador Associado", response);
                onClose(); // Fecha o modal
            } else {
                setErro('Erro no fetch da API. ENDPOINT: /etapas/:id/colaboradores')
                console.log("Erro no ENDPOINT", response)
                return;
            }

            await fetchProjetoById(projeto.id);
            onClose();
        } else {
            setErro("Por favor, selecione um colaborador.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Associar Colaborador à Fase</h2>
            <p style={{ textAlign: 'center', marginTop: '-10px', marginBottom: '20px' }}>
                <strong>Fase:</strong> {fase.nome}
            </p>

            <div className="form-group">
                <label htmlFor="colaborador">Colaborador</label>
                <select
                    id="colaborador"
                    value={selectedColaboradorId}
                    onChange={e => setSelectedColaboradorId(e.target.value)}
                >
                    <option value="">-- Selecione um colaborador --</option>
                   
                    {colaboradores.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.nome} ({c.nivelAcesso})
                        </option>
                    ))}
                </select>
            </div>

            {erro && <p className="form-error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Associar</button>
            </div>
        </form>
    );
}
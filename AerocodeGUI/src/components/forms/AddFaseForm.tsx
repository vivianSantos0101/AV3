// src/components/forms/AddFaseForm.tsx
// (Equivalente ao AddEtapaForm.tsx)

import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { type IProjetoAeronave } from '../../domain/models';
import './FormStyles.css';

interface Props {
    projeto: IProjetoAeronave;
    onClose: () => void;
}

export function AddFaseForm({ projeto, onClose }: Props) {
    const [nome, setNome] = useState('');
    const [prazo, setPrazo] = useState('');
    const [erro, setErro] = useState('');
    const { fetchProjetoById } = useStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !prazo) {
            setErro('Nome e Prazo são obrigatórios.');
            return;
        }

        const novaFase = await fetch("http://localhost:3000/api/v1/etapas/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, prazo, projetoId: projeto.id }),
            credentials: "include"
        })

        const response = await novaFase.json();

        if (novaFase.ok) {
            console.log("Fase Adicionada!", response);
            onClose(); // Fecha o modal
        } else {
            setErro('Erro no fetch da API. ENDPOINT: /etapas')
            console.log("Erro no ENDPOINT", response)
            return;
        }

        await fetchProjetoById(projeto.id);

        console.log("Fase Adicionada!", novaFase);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Adicionar Nova Fase</h2>

            <div className="form-group">
                <label htmlFor="nome">Nome da Fase</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="prazo">Prazo Estimado (ex: 5 dias)</label>
                <input type="text" id="prazo" value={prazo} onChange={e => setPrazo(e.target.value)} />
            </div>

            {erro && <p className="form-error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Fase</button>
            </div>
        </form>
    );
}
import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { TipoAeronave } from '../../domain/models';
import './FormStyles.css'; 

interface Props {
    onClose: () => void;
}

export function AddProjetoForm({ onClose }: Props) {

    const { projetos, fetchProjetos } = useStore();

    const [codigo, setCodigo] = useState('');
    const [modelo, setModelo] = useState('');
    const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL); 
    const [capacidade, setCapacidade] = useState(0);
    const [alcance, setAlcance] = useState(0);
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (projetos.find(a => a.codigo === codigo)) {
            setErro('Erro: Já existe um projeto com este código.');
            return;
        }

        if (!codigo || !modelo) {
            setErro('Código e Modelo são obrigatórios.');
            return;
        }

 
        const novoProjeto = await fetch("http://localhost:3000/api/v1/aeronaves/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, modelo, tipo, capacidade, alcance }),
            credentials: "include"
        })

        const response = await novoProjeto.json();
        
        if (novoProjeto.ok) {
            await fetchProjetos()
            console.log("Projeto Adicionado!", response);
            onClose(); 
        } else {
            setErro('Erro no fetch da API. ENDPOINT: /aeronaves')
            console.log("Erro no ENDPOINT", response)
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Cadastrar Novo Projeto</h2>
            
            <div className="form-group">
                <label htmlFor="codigo">Código Único</label>
                <input type="text" id="codigo" value={codigo} onChange={e => setCodigo(e.target.value)} />
            </div>
            
            <div className="form-group">
                <label htmlFor="modelo">Modelo</label>
                <input type="text" id="modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="tipo">Tipo de Aeronave</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)}>
                    <option value={TipoAeronave.COMERCIAL}>Comercial</option>
                    <option value={TipoAeronave.MILITAR}>Militar</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="capacidade">Capacidade (Passageiros)</label>
                <input type="number" id="capacidade" value={capacidade} onChange={e => setCapacidade(Number(e.target.value))} />
            </div>
            
            <div className="form-group">
                <label htmlFor="alcance">Alcance (km)</label>
                <input type="number" id="alcance" value={alcance} onChange={e => setAlcance(Number(e.target.value))} />
            </div>

            {erro && <p className="form-error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Projeto</button>
            </div>
        </form>
    );
}
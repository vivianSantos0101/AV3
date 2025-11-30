import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext'; 
import { type IProjetoAeronave, TipoTeste, ResultadoTeste, TipoTesteLabel, ResultadoTesteLabel } from '../../domain/models'; 
import './FormStyles.css'; 

interface Props {
    projeto: IProjetoAeronave; 
    onClose: () => void;
}

export function RegistrarTesteForm({ projeto, onClose }: Props) {
    const { fetchProjetoById } = useStore();

    const [tipo, setTipo] = useState<TipoTeste>(TipoTeste.ELETRICO);
    const [resultado, setResultado] = useState<ResultadoTeste>(ResultadoTeste.APROVADO);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const novoTeste = await fetch(`http://localhost:3000/api/v1/testes/aeronave/${projeto.id}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo, resultado }),
            credentials: "include"
        })

        const response = await novoTeste.json();
        
        if (novoTeste.ok) {
            fetchProjetoById(projeto.id);
            console.log("Teste Registrado!", novoTeste);
            onClose();
        } else {
            console.log("Erro no ENDPOINT /testes/aeronave/:1", response)
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container" style={{ width: '350px' }}>
            <h2>Registrar Novo Teste</h2>
            
            <div className="form-group">
                <label htmlFor="tipo">Tipo de Teste</label>
                <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoTeste)}>
                    {Object.values(TipoTeste).map(t => (
                        <option key={t} value={t}>{TipoTesteLabel[t]}</option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="resultado">Resultado do Teste</label>
                <select id="resultado" value={resultado} onChange={e => setResultado(e.target.value as ResultadoTeste)}>
                    {Object.values(ResultadoTeste).map(r => (
                        <option key={r} value={r}>{ResultadoTesteLabel[r]}</option>
                    ))}
                </select>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Teste</button>
            </div>
        </form>
    );
}
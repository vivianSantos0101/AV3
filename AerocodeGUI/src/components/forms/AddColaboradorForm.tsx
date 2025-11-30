import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { NivelAcesso, NivelAcessoLabel } from '../../domain/models';
import './FormStyles.css'; 

interface Props {
    onClose: () => void;
}

export function AddColaboradorForm({ onClose }: Props) {

    const { fetchColaboradores } = useStore();

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [nivelAcesso, setNivelAcesso] = useState<NivelAcesso>(NivelAcesso.OPERADOR); 
    const [erro, setErro] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !usuario || !senha) {
            setErro('Nome, Usuário e Senha são obrigatórios.');
            return;
        }

        if (usuario.length < 3 && senha.length < 6) {
            setErro('Usuário tem que ter mais de 3 characteres e a Senha mais de 6 characteres');
            return;
        }

        if (usuario.length < 3) {
            setErro('Usuário tem que ser mais de 3 characteres');
            return;
        }

        if (senha.length < 6) {
            setErro('Senha tem que ser mais de 6 characteres');
            return;
        }

        const novoColaborador = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, endereco, usuario, senha, nivelAcesso }),
            credentials: "include"
        })

        const response = await novoColaborador.json();

        if (novoColaborador.ok) {
            await fetchColaboradores()
            console.log("Usuario criado", response);
            onClose();
        } else {
            setErro('Erro no fetch da API. ENDPOINT: /auth/register')
            console.log("Erro no ENDPOINT /auth/register", response)
            return;
        }
    };

    return (

        <form onSubmit={handleSubmit} className="form-container" style={{ width: '400px' }}>
            <h2>Cadastrar Novo Colaborador</h2>

            <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="text" id="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input type="text" id="endereco" value={endereco} onChange={e => setEndereco(e.target.value)} />
            </div>

            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

            <div className="form-group">
                <label htmlFor="usuario">Usuário (para login)</label>
                <input type="text" id="usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>

            <div className="form-group">
                <label htmlFor="nivel">Nível de Acesso</label>
                <select id="nivel" value={nivelAcesso} onChange={e => setNivelAcesso(e.target.value as NivelAcesso)}>
                    {Object.values(NivelAcesso).map(nivel => (
                        <option key={nivel} value={nivel}>{NivelAcessoLabel[nivel]}</option>
                    ))}
                </select>
            </div>

            {erro && <p className="form-error-message">{erro}</p>}

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Colaborador</button>
            </div>
        </form>
    );
}
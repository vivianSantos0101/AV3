import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import './LoginPage.css'; 
import AeroCodeLogo from '../assets/images/logo-aerocode.png'; 

export function LoginPage() {
    const { login, usuarioAtual, carregando } = useSession();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

     useEffect(() => {
        if (!carregando && usuarioAtual) {
            navigate("/dashboard", { replace: true });
        }
    }, [usuarioAtual, carregando, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        
        const sucesso = await login(usuario, senha);
        if (sucesso) {
            navigate("/dashboard"); 
        } else {
            setErro("Usuário ou senha inválidos.");
        }
    };

    return (
        <div className="login-page-container"> 
            <div className="login-form-container">

                <h2 className="login-logo"> 
                    <img 
                        src={AeroCodeLogo}  
                        alt="AeroCode Logo" 
                        className="login-logo-image" 
                    />
                    AeroCode
                </h2>
                
           
                <form onSubmit={handleSubmit} className="login-form-body">
                    
                
                    <div className="login-inputs-wrapper">
                        <div className="login-form-group">
                            <label htmlFor="usuario">Usuário</label>
                            <input
                                type="text"
                                id="usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                    </div>

          
                    <div className="login-button-wrapper">
                        <button type="submit" className="login-submit-button">Entrar</button>
                    </div>

                </form>

                {erro && <p className="login-error-message">{erro}</p>}

            </div>
        </div>
    );
}
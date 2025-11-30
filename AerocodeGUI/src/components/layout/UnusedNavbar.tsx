import { Link, NavLink } from "react-router-dom";
import { useSession } from "../../contexts/SessionContext";
import { NivelAcesso } from "../../domain/models";
import './Navbar.css'; 

export function Navbar() {
    const { usuarioAtual, logout } = useSession();

    if (!usuarioAtual) {
        return null; 
    }

    return (
        <header className="app-navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">AeroCode</Link>
            </div>
            
            <nav className="navbar-nav">
                
                <NavLink to="/dashboard">Painel</NavLink>
                
            
                {usuarioAtual.nivelAcesso === NivelAcesso.ADMINISTRADOR && (
                    <NavLink to="/colaboradores">Colaboradores</NavLink>
                )}
            </nav>

            <div className="navbar-user">
                <span>Olá, {usuarioAtual.nome}</span>
                <button onClick={logout} className="logout-button">
                    Sair
                </button>
            </div>
        </header>
    );
}
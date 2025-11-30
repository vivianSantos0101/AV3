import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { type IColaborador } from "../domain/models";

interface ISessionContext {
    usuarioAtual: IColaborador | null;
    carregando: boolean;
    login: (usuario: string, senha: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const SessionContext = createContext<ISessionContext>(null!);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [usuarioAtual, setUsuarioAtual] = useState<IColaborador | null>(null);
    const [carregando, setCarregando] = useState(true);

    const loginLock = useRef(false);
    const fetchLock = useRef(false);

 

   
    const fetchUsuario = async () => {
        if (fetchLock.current) return;
        fetchLock.current = true;

        try {
            const res = await fetch("http://localhost:3000/auth/me", {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const usuario: IColaborador = await res.json()
                setUsuarioAtual(usuario);
            } else {
                setUsuarioAtual(null);
            }
        } catch {
            setUsuarioAtual(null);
        } finally {
            setCarregando(false);
            fetchLock.current = false;
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, []);


    //  LOGIN

    const login = async (usuario: string, senha: string): Promise<boolean> => {
        if (loginLock.current) return false;
        loginLock.current = true;

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, senha }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setUsuarioAtual(data.user);
                console.log("Login OK", data);
                return true;
            } else {
                console.error("Login FALHOU", data);
                setUsuarioAtual(null);
                return false;
            }
        } catch (err) {
            console.error("Erro inesperado durante login:", err);
            setUsuarioAtual(null);
            return false;
        } finally {
            loginLock.current = false; 
        }
    };


    // LOGOUT

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch(error) {
            console.log(error)
        }

        setUsuarioAtual(null);
        console.log("Usuário deslogado.");
    };

    return (
        <SessionContext.Provider value={{ usuarioAtual, carregando, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}

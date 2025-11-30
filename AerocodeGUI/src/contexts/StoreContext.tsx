import React, { createContext, useContext, useState, useRef } from "react";
import { type IColaborador, type IProjetoAeronave } from "../domain/models";

interface IStoreContext {
    projetos: IProjetoAeronave[];
    colaboradores: IColaborador[];
    loadingProjetos: boolean;
    loadingColaboradores: boolean;

    fetchProjetos: (params?: {
        includeFases?: boolean;
        includeComponentes?: boolean;
        includeTestes?: boolean;
        includeFasesEColaboradores?: boolean;
    }) => Promise<void>;
    fetchProjetoById: (id: number) => Promise<void>;
    fetchColaboradores: () => Promise<void>;
}

const StoreContext = createContext<IStoreContext>(null!);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [projetos, setProjetos] = useState<IProjetoAeronave[]>([]);
    const [colaboradores, setColaboradores] = useState<IColaborador[]>([]);
    const [loadingProjetos, setLoadingProjetos] = useState(false);
    const [loadingColaboradores, setLoadingColaboradores] = useState(false);
    const isFetchingProjetos = useRef(false);
    const isFetchingColabs = useRef(false);

    // FETCH PROJETOS 
  
    const fetchProjetos = async (params?: {
        includeFases?: boolean;
        includeComponentes?: boolean;
        includeTestes?: boolean;
        includeFasesEColaboradores?: boolean;
    }) => {
 
        if (isFetchingProjetos.current) return;

      
        const wantsFull =
            params?.includeComponentes === true &&
            params?.includeFasesEColaboradores === true &&
            params?.includeTestes === true;

        isFetchingProjetos.current = true;
        setLoadingProjetos(true);

        try {
            const query = new URLSearchParams();
            if (params?.includeFases) query.append("includeFases", "true");
            if (params?.includeComponentes) query.append("includeComponentes", "true");
            if (params?.includeTestes) query.append("includeTestes", "true");
            if (params?.includeFasesEColaboradores) query.append("includeFasesEColaboradores", "true");

            const res = await fetch(
                `http://localhost:3000/api/v1/aeronaves?${query.toString()}`,
                { credentials: "include" }
            );

            if (!res.ok) throw new Error("Falha ao carregar projetos");

            const data: IProjetoAeronave[] = await res.json();

         
            setProjetos(prev =>
                data.map(novo => {
                    const antigo = prev.find(p => p.codigo === novo.codigo);

              
                    if (!antigo) {
                        return { ...novo, _completo: wantsFull };
                    }

                  
                    if (wantsFull) {
                        return { ...antigo, ...novo, _completo: true };
                    }

         
                    return {
                        ...antigo,
                        ...novo,
                        _completo: false
                    };
                })
            );
        } catch (err) {
            console.error(err);
        } finally {
            isFetchingProjetos.current = false;
            setLoadingProjetos(false);
        }
    };

    const fetchProjetoById = async (id: number) => {
        const res = await fetch(`http://localhost:3000/api/v1/aeronaves/${id}`, {
            credentials: "include"
        });

        if (!res.ok) throw new Error("Erro ao carregar projeto atualizado");

        const projetoAtualizado = await res.json();

        setProjetos(prev =>
            prev.map(p => p.id === id ? projetoAtualizado : p)
        );
    };


   
    const fetchColaboradores = async () => {
        if (isFetchingColabs.current) return;

        isFetchingColabs.current = true;
        setLoadingColaboradores(true);

        try {
            const res = await fetch("http://localhost:3000/api/v1/colaboradores", {
                credentials: "include"
            });

            if (!res.ok) throw new Error("Falha ao carregar colaboradores");

            const data = await res.json();

            setColaboradores(data);
        } catch (err) {
            console.error(err);
        } finally {
            isFetchingColabs.current = false;
            setLoadingColaboradores(false);
        }
    };

    return (
        <StoreContext.Provider value={{
            projetos,
            colaboradores,
            loadingProjetos,
            loadingColaboradores,
            fetchProjetos,
            fetchProjetoById,
            fetchColaboradores,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    return useContext(StoreContext);
}

import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./contexts/SessionContext";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjetoDetailPage } from "./pages/ProjetoDetailPage";
import { ColaboradoresPage } from "./pages/ColaboradoresPage";


function ProtectedRoutes() {
   
    const { usuarioAtual, carregando } = useSession();

    if (carregando) {
      
        return <div>Carregando...</div>;
    }

    if (!usuarioAtual) {
        
        return <Navigate to="/login" replace />;
    }
    
    return <MainLayout />;
}

function App() {
    return (
        <Routes>
       
            <Route path="/login" element={<LoginPage />} />

    
            <Route element={<ProtectedRoutes />}>

             
                <Route index element={<Navigate to="/dashboard" replace />} />

          
                <Route path="dashboard" element={<DashboardPage />} />

                <Route path="projeto/:codigo" element={<ProjetoDetailPage />} />

     
                <Route path="colaboradores" element={<ColaboradoresPage />} />

            </Route>
        </Routes>
    )
}

export default App

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar"; 
import './MainLayout.css'; 

export function MainLayout() {
    return (
        <div className="main-layout-container">
           
            <Sidebar />
       
            <main className="content-area-full">
                <Outlet />
            </main>
        </div>
    );
}
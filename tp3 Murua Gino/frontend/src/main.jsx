// frontend/src/main.jsx (Actualizado)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { AuthPage, AuthProvider, AuthRol } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importa TODAS tus páginas
import { PaginaPacientes } from "./PaginaPacientes.jsx";
import { PaginaMedicos } from "./PaginaMedicos.jsx";
import { PaginaTurnos } from "./PaginaTurnos.jsx";
import { PaginaLogin } from "./PaginaLogin.jsx";       // <-- Nuevo
import { PaginaRegistro } from "./PaginaRegistro.jsx"; // <-- Nuevo

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Rutas públicas de Autenticación */}
            <Route path="login" element={<PaginaLogin />} />
            <Route path="register" element={<PaginaRegistro />} />

            {/* Rutas Protegidas */}
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <PaginaPacientes />
                </AuthPage>
              }
            />
            <Route
              path="medicos"
              element={
                <AuthPage>
                  <PaginaMedicos />
                </AuthPage>
              }
            />
            <Route
              path="turnos"
              element={
                <AuthPage>
                  <PaginaTurnos />
                </AuthPage>
              }
            />
            
            {/* (Aquí irían tus rutas de 'crear' y 'modificar' protegidas) */}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
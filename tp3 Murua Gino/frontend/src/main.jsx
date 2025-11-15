import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@picocss/pico";
import "./index.css";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";
import { AuthPage, AuthProvider, AuthRol } from "./Auth.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importa las páginas
import { PaginaPacientes } from "./PaginaPacientes.jsx";
import { PaginaMedicos } from "./PaginaMedicos.jsx";
import { PaginaTurnos } from "./PaginaTurnos.jsx"; 
import { PaginaLogin } from "./PaginaLogin.jsx";
import { PaginaRegistro } from "./PaginaRegistro.jsx";

// Manejo del CRUD pacientes 
import { CrearPaciente } from "./CrearPaciente.jsx";
import { DetallesPaciente } from "./DetallePaciente.jsx";
import { ModificarPaciente } from "./ModificarPaciente.jsx";

// Manejo del CRUD medicos 
import { CrearMedico } from "./CrearMedico.jsx";
import { DetalleMedico } from "./DetalleMedico.jsx";
import { ModificarMedico } from "./ModificarMedico.jsx";

// Manejo del CRUD Turnos
import { CrearTurno } from "./CrearTurno.jsx";
import { DetalleTurno } from "./DetalleTurno.jsx";
import { ModificarTurno } from "./ModificarTurno.jsx";

// Renderiza la aplicación
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<PaginaLogin />} />
            <Route path="register" element={<PaginaRegistro />} />
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <PaginaPacientes />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/crear"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <CrearPaciente />
                  </AuthRol>
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id"
              element={
                <AuthPage>
                  <DetallesPaciente />
                </AuthPage>
              }
            />
            <Route
              path="pacientes/:id/modificar"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <ModificarPaciente />
                  </AuthRol>
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
              path="medicos/crear"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <CrearMedico />
                  </AuthRol>
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id"
              element={
                <AuthPage>
                  <DetalleMedico />
                </AuthPage>
              }
            />
            <Route
              path="medicos/:id/modificar"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <ModificarMedico />
                  </AuthRol>
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
            <Route
              path="turnos/crear"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <CrearTurno />
                  </AuthRol>
                </AuthPage>
              }
            />
            <Route
              path="turnos/:id"
              element={
                <AuthPage>
                  <DetalleTurno />
                </AuthPage>
              }
            />
            <Route
              path="turnos/:id/modificar"
              element={
                <AuthPage>
                  <AuthRol rol="admin">
                    <ModificarTurno />
                  </AuthRol>
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
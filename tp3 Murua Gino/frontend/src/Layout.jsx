import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth";

export const Layout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/pacientes">Pacientes</Link>
          </li>
          <li>
            <Link to="/medicos">Medicos</Link>
          </li>
          <li>
            <Link to="/turnos">Turnos</Link>
          </li>
        </ul>
        <ul>
          {isAuthenticated ? (
            <li>
              <button onClick={() => logout()}>Salir</button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" role="button" className="secondary">Ingresar</Link>
              </li>
              <li>
                <Link to="/register" role="button">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </main>
  );
};
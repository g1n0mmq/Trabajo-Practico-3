// frontend/src/PaginaTurnos.jsx

import { useEffect, useState, useCallback } from "react";
import { AuthRol, useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function PaginaTurnos() {
  const { fetchAuth } = useAuth();

  const [turnos, setTurnos] = useState([]); // <-- Cambiado

  const fetchTurnos = useCallback(async () => { // <-- Cambiado
    const response = await fetchAuth(
      "http://localhost:3000/api/turnos" // <-- URL Cambiada
    );
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.message);
      return;
    }

    setTurnos(data); // <-- Cambiado
  }, [fetchAuth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTurnos(); // <-- Cambiado
  }, [fetchTurnos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el turno?")) { // <-- Cambiado
      const response = await fetchAuth(`http://localhost:3000/api/turnos/${id}`, { // <-- URL Cambiada
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al quitar turno: " + data.message); // <-- Cambiado
      }

      await fetchTurnos(); // <-- Cambiado
    }
  };

  return (
    <article>
      <h2>Turnos</h2> {/* <-- Cambiado */}
      <AuthRol rol="admin">
        <Link role="button" to="/turnos/crear"> {/* <-- Cambiado */}
          Nuevo Turno {/* <-- Cambiado */}
        </Link>
      </AuthRol>
      
      <table>
        <thead>
          <tr>
            {/* Cabeceras de tabla cambiadas */}
            <th>ID</th>
            <th>Paciente ID</th>
            <th>Médico ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((t) => ( // <-- Cambiado
            <tr key={t.id}>
              {/* Datos de tabla cambiados */}
              <td>{t.id}</td>
              <td>{t.paciente_id}</td>
              <td>{t.medico_id}</td>
              <td>{new Date(t.fecha).toLocaleDateString()}</td> {/* Formateamos la fecha */}
              <td>{t.hora}</td>
              <td>{t.estado}</td>
              <td>
                <div>
                  <Link role="button" to={`/turnos/${t.id}`}> {/* <-- Cambiado */}
                    Ver
                  </Link>
                  <AuthRol rol="admin">
                    <Link role="button" to={`/turnos/${t.id}/modificar`}> {/* <-- Cambiado */}
                      Modificar
                    </Link>
                    <button onClick={() => handleQuitar(t.id)}>Quitar</button>
                  </AuthRol>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
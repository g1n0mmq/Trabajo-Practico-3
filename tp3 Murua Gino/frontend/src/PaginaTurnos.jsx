import { useEffect, useState, useCallback } from "react";
import { AuthRol, useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function PaginaTurnos() {
  const { fetchAuth } = useAuth();

  const [turnos, setTurnos] = useState([]);

  const fetchTurnos = useCallback(async () => {
    const response = await fetchAuth(
      "http://localhost:3000/api/turnos"
    );
    const data = await response.json();
        
    console.log("DATOS RECIBIDOS DE LA API:", data);


    if (!response.ok) {
      console.log("Error:", data.message);
      return;
    }

    setTurnos(data);
  }, [fetchAuth]);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTurnos();
  }, [fetchTurnos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el turno?")) { 
      const response = await fetchAuth(`http://localhost:3000/api/turnos/${id}`, { 
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al quitar turno: " + data.message); 
      }

      await fetchTurnos(); 
    }
  };

  return (
    <article>
      <h2>Turnos</h2>
      <AuthRol rol="admin">
        <Link role="button" to="/turnos/crear">
          Nuevo Turno 
        </Link>
      </AuthRol>

      <table>
        <thead>
          <tr>
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
          {turnos.map((t) => (
            <tr key={t.ID}>
              <td>{t.ID}</td>
              <td>{t.Paciente_id}</td>
              <td>{t.Medico_id}</td>
              <td>{new Date(t.Fecha).toLocaleDateString()}</td> 
              <td>{t.Hora}</td>
              <td>{t.Estado}</td>
              <td>
                <div>
                  <Link role="button" to={`/turnos/${t.id}`}>
                    Ver
                  </Link>
                  <AuthRol rol="admin">
                    <Link role="button" to={`/turnos/${t.id}/modificar`}> 
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
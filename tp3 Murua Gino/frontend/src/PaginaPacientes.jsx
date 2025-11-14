import { useEffect, useState } from "react";
import { AuthRol, useAuth } from "./Auth";
import { useCallback } from "react";
import { Link } from "react-router-dom";

export function PaginaPacientes() {
  const { fetchAuth } = useAuth();

  const [pacientes, setPacientes] = useState([]);

  const fetchPacientes = useCallback(async () => {
    const response = await fetchAuth(
      "http://localhost:3000/api/pacientes" 
    );
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.message);
      return;
    }

    setPacientes(data); 
  }, [fetchAuth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPacientes();
  }, [fetchPacientes]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el paciente?")) {
      const response = await fetchAuth(`http://localhost:3000/api/pacientes/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al quitar paciente: " + data.message);
      }

      await fetchPacientes();
    }
  };
  return (
    <article>
      <h2>Pacientes</h2>
      <AuthRol rol="admin">
        <Link role="button" to="/pacientes/crear">
          Nuevo Paciente
        </Link>
      </AuthRol>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Obra Social</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.Nombre}</td>
              <td>{p.Apellido}</td>
              <td>{p.DNI}</td>
              <td>{p.obra_social}</td>
              <td>
                <div>
                  <Link role="button" to={`/pacientes/${p.id}`}>
                    Ver
                  </Link>
                  <AuthRol rol="admin">
                    <Link role="button" to={`/pacientes/${p.id}/modificar`}>
                      Modificar
                    </Link>
                    <button onClick={() => handleQuitar(p.id)}>Quitar</button>
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
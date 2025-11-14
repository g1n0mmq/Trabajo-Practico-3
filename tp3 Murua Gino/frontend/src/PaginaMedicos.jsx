import { useEffect, useState, useCallback } from "react";
import { AuthRol, useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function PaginaMedicos() {
  const { fetchAuth } = useAuth();

  const [medicos, setMedicos] = useState([]); 

  const fetchMedicos = useCallback(async () => { 
    const response = await fetchAuth(
      "http://localhost:3000/api/medicos" 
    );
    const data = await response.json();
    console.log("DATOS RECIBIDOS DE LA API:", data);

    if (!response.ok) {
      console.log("Error:", data.message);
      return;
    }

    setMedicos(data); 
  }, [fetchAuth]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMedicos(); 
  }, [fetchMedicos]);

  const handleQuitar = async (id) => {
    if (window.confirm("¿Desea quitar el médico?")) { 
      const response = await fetchAuth(`http://localhost:3000/api/medicos/${id}`, {method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        return window.alert("Error al quitar médico: " + data.message); 
      }

      await fetchMedicos();
    }
  };

  return (
    <article>
      <h2>Médicos</h2> 
      <AuthRol rol="admin">
        <Link role="button" to="/medicos/crear"> 
          Nuevo Médico 
        </Link>
      </AuthRol>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Matrícula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.map((m) => ( 
            <tr key={m.ID}>
              <td>{m.ID}</td> 
              <td>{m.Nombre}</td> 
              <td>{m.Apellido}</td> 
              <td>{m.Especialidad}</td>
              <td>{m.Matricula_profesional}</td> 
              <td>
                <div>
                  <Link role="button" to={`/medicos/${m.ID}`}> 
                    Ver
                  </Link>
                  <AuthRol rol="admin">
                    <Link role="button" to={`/medicos/${m.ID}/modificar`}> 
                      Modificar
                    </Link>
                    <button onClick={() => handleQuitar(m.ID)}>Quitar</button> 
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
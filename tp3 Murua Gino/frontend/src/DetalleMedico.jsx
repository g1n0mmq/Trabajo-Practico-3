// frontend/src/DetalleMedico.jsx

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router-dom";

export const DetalleMedico = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams(); // Obtiene el ID de la URL
  const [medico, setMedico] = useState(null);
  const [turnos, setTurnos] = useState([]); // Estado para los turnos del médico
  const [error, setError] = useState(null);

  const fetchMedico = useCallback(async () => {
    try {
      const [medicoRes, turnosRes] = await Promise.all([
        fetchAuth(`http://localhost:3000/api/medicos/${id}`),
        fetchAuth(`http://localhost:3000/api/turnos`)
      ]);

      if (!medicoRes.ok || !turnosRes.ok) {
        throw new Error("Error al cargar los datos del médico o los turnos.");
      }

      const medicoData = await medicoRes.json();
      const todosLosTurnos = await turnosRes.json();

      const turnosDelMedico = todosLosTurnos.filter(
        (turno) => turno.Medico_id === parseInt(id)
      );

      setMedico(medicoData);
      setTurnos(turnosDelMedico);
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchMedico();
  }, [fetchMedico]);

  if (error) {
    return (
      <article>
        <p style={{ color: "red" }}>{error}</p>
      </article>
    );
  }

  if (!medico) {
    return <article aria-busy="true">Cargando detalles del médico...</article>;
  }

  return (
    <article>
      <h2>Detalles del Médico</h2>
      <p>
        <strong>ID:</strong> {medico.ID}
      </p>
      <p>
        <strong>Nombre:</strong> {medico.Nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {medico.Apellido}
      </p>
      <p>
        <strong>Especialidad:</strong> {medico.Especialidad}
      </p>
      <p>
        <strong>Matrícula Profesional:</strong> {medico.Matricula_profesional}
      </p>
      <footer className="grid">
        <Link role="button" className="secondary" to="/medicos">
          Volver a la lista
        </Link>
        <Link role="button" to={`/medicos/${medico.ID}/modificar`}>
          Modificar
        </Link>
      </footer>

      <hr />

      <h3>Turnos Asignados</h3>
      {turnos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID Turno</th>
              <th>Paciente ID</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.ID}>
                <td>{turno.ID}</td>
                <td>{turno.Paciente_id}</td>
                <td>{new Date(turno.Fecha).toLocaleDateString()}</td>
                <td>{turno.Hora.slice(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Este médico no tiene turnos asignados.</p>
      )}
    </article>
  );
};
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router-dom";

export const DetalleTurno = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams();
  const [turno, setTurno] = useState(null);
  const [error, setError] = useState(null);

  // Opcional: Cargar nombres de paciente y médico
  const [pacienteNombre, setPacienteNombre] = useState("");
  const [medicoNombre, setMedicoNombre] = useState("");

  const fetchTurno = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/api/turnos/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar el turno");
      }
      
      // Cargar nombres en paralelo para mayor eficiencia
      const [pacRes, medRes] = await Promise.all([
        fetchAuth(`http://localhost:3000/api/pacientes/${data.Paciente_id}`),
        fetchAuth(`http://localhost:3000/api/medicos/${data.Medico_id}`)
      ]);

      if (!pacRes.ok || !medRes.ok) {
        console.error("Error cargando nombres de paciente o médico");
        setPacienteNombre("No encontrado");
        setMedicoNombre("No encontrado");
      } else {
        const pacData = await pacRes.json();
        const medData = await medRes.json();
        setPacienteNombre(pacData.Nombre ? `${pacData.Nombre} ${pacData.Apellido}` : "No encontrado");
        setMedicoNombre(medData.Nombre ? `${medData.Nombre} ${medData.Apellido}` : "No encontrado");
      }

      setTurno(data); // Actualizar el turno al final

    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchTurno();
  }, [fetchTurno]);

  if (error) {
    return <article><p style={{ color: "red" }}>{error}</p></article>;
  }

  if (!turno) {
    return <article aria-busy="true">Cargando detalles del turno...</article>;
  }

  return (
    <article>
      <h2>Detalles del Turno</h2>
      <p>
        <strong>ID:</strong> {turno.ID}
      </p>
      <p>
        <strong>Paciente:</strong> {pacienteNombre} (ID: {turno.Paciente_id})
      </p>
      <p>
        <strong>Médico:</strong> {medicoNombre} (ID: {turno.Medico_id})
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(turno.Fecha).toLocaleDateString()}
      </p>
      <p>
        <strong>Hora:</strong> {turno.Hora.slice(0, 5)}
      </p>
      <p>
        <strong>Estado:</strong> {turno.Estado}
      </p>
       <p>
        <strong>Observaciones:</strong> {turno.Observaciones || "N/A"}
      </p>
      <footer className="grid">
        <Link role="button" className="secondary" to="/turnos">
          Volver a la lista
        </Link>
        <Link role="button" to={`/turnos/${turno.ID}/modificar`}>
          Modificar
        </Link>
      </footer>
    </article>
  );
};
// frontend/src/DetallesPaciente.jsx

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { useParams, Link } from "react-router-dom";

export const DetallesPaciente = () => {
  const { fetchAuth } = useAuth();
  const { id } = useParams(); // Obtiene el ID de la URL
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState(null);

  const fetchPaciente = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/api/pacientes/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar el paciente");
      }
      setPaciente(data);
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchPaciente();
  }, [fetchPaciente]);

  if (error) {
    return <article><p style={{ color: "red" }}>{error}</p></article>;
  }

  if (!paciente) {
    return <article aria-busy="true">Cargando detalles del paciente...</article>;
  }

  // Usamos las MAYÚSCULAS que nos manda la API
  return (
    <article>
      <h2>Detalles del Paciente</h2>
      <p>
        <strong>ID:</strong> {paciente.ID}
      </p>
      <p>
        <strong>Nombre:</strong> {paciente.Nombre}
      </p>
      <p>
        <strong>Apellido:</strong> {paciente.Apellido}
      </p>
      <p>
        <strong>DNI:</strong> {paciente.DNI}
      </p>
      <p>
        <strong>Fecha de Nacimiento:</strong> {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
      </p>
      <p>
        <strong>Obra Social:</strong> {paciente.obra_social || "N/A"}
      </p>
      <footer className="grid">
        <Link role="button" className="secondary" to="/pacientes">
          Volver a la lista
        </Link>
        <Link role="button" to={`/pacientes/${paciente.ID}/modificar`}>
          Modificar
        </Link>
      </footer>
    </article>
  );
};
// frontend/src/ModificarMedico.jsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarMedico = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    ID: id,
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula_profesional: "",
  });

  const fetchMedico = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/api/medicos/${id}`);
      const data = await response.json();
      if (response.ok) {
        setValues({
          ID: data.ID || data.id,
          nombre: data.Nombre,
          apellido: data.Apellido,
          especialidad: data.Especialidad,
          matricula_profesional: data.Matricula_profesional,
        });
      } else {
        throw new Error(data.message || "Error al cargar datos");
      }
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchMedico();
  }, [fetchMedico]);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre: values.nombre,
      apellido: values.apellido,
      especialidad: values.especialidad,
      matricula_profesional: values.matricula_profesional,
    };

    try {
      const response = await fetchAuth(
        `http://localhost:3000/api/medicos/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajesError = data.errors.map((err) => err.msg).join(". ");
          throw new Error(mensajesError);
        }
        throw new Error(data.message || "Error al modificar el médico");
      }

      navigate("/medicos");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Modificar Médico (ID: {values.ID})</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="apellido">Apellido</label>
          <input
            id="apellido"
            name="apellido"
            value={values.apellido}
            onChange={handleChange}
            required
          />

          <label htmlFor="especialidad">Especialidad</label>
          <input
            id="especialidad"
            name="especialidad"
            value={values.especialidad}
            onChange={handleChange}
            required
          />

          <label htmlFor="matricula_profesional">Matrícula Profesional</label>
          <input
            id="matricula_profesional"
            name="matricula_profesional"
            value={values.matricula_profesional}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};
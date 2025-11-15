// frontend/src/CrearMedico.jsx

import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearMedico = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    especialidad: "",
    matricula_profesional: "",
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchAuth("http://localhost:3000/api/medicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajesError = data.errors.map((err) => err.msg).join(". ");
          throw new Error(mensajesError);
        }
        throw new Error(data.message || "Error al crear el médico");
      }

      navigate("/medicos");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Médico</h2>
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
        <input type="submit" value="Crear Médico" />
      </form>
    </article>
  );
};
import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearPaciente = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    DNI: "",
    fecha_nacimiento: "",
    obra_social: "",
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
      const response = await fetchAuth("http://localhost:3000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), 
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajesError = data.errors.map(err => err.msg).join('. ');
          throw new Error(mensajesError);
        }
        throw new Error(data.message || "Error al crear el paciente");
      }

      navigate("/pacientes");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Paciente</h2>
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
          
          <label htmlFor="DNI">DNI</label>
          <input
            id="DNI"
            name="DNI"
            value={values.DNI}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={values.fecha_nacimiento}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="obra_social">Obra Social</label>
          <input
            id="obra_social"
            name="obra_social" 
            value={values.obra_social}
            onChange={handleChange}
          />
          
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <input type="submit" value="Crear Paciente" />
      </form>
    </article>
  );
};
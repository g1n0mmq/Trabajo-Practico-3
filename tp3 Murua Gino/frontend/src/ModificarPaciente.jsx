import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarPaciente = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [error, setError] = useState(null);

  // El estado se inicializa vacío
  const [values, setValues] = useState({
    ID: id,
    Nombre: "",
    Apellido: "",
    DNI: "",
    fecha_nacimiento: "",
    obra_social: "",
  });


  const fetchPaciente = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/api/pacientes/${id}`);
      const data = await response.json();
      if (response.ok) {
  
        if (data.fecha_nacimiento) {
          data.fecha_nacimiento = data.fecha_nacimiento.split('T')[0];
        }
        setValues(data); 
      } else {
        throw new Error(data.message || "Error al cargar datos");
      }
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchPaciente();
  }, [fetchPaciente]);

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
      nombre: values.Nombre,
      apellido: values.Apellido,
      DNI: values.DNI,
      fecha_nacimiento: values.fecha_nacimiento,
      obra_social: values.obra_social,
    };

    try {
      const response = await fetchAuth(`http://localhost:3000/api/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajesError = data.errors.map(err => err.msg).join('. ');
          throw new Error(mensajesError);
        }
        throw new Error(data.message || "Error al modificar el paciente");
      }

      navigate("/pacientes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Modificar Paciente (ID: {values.ID})</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          
          <label htmlFor="Nombre">Nombre</label>
          <input
            id="Nombre"
            name="Nombre" 
            value={values.Nombre}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="Apellido">Apellido</label>
          <input
            id="Apellido"
            name="Apellido"
            value={values.Apellido}
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
            value={values.obra_social || ''} 
            onChange={handleChange}
          />
          
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};
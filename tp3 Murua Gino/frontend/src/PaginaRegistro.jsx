import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PaginaRegistro = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contrasena: "",
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
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar");
      }
      navigate("/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Registro de nuevo usuario</h2>
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={values.contrasena}
            onChange={handleChange}
            required
          />
          
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <input type="submit" value="Registrarse" />
      </form>
    </article>
  );
};
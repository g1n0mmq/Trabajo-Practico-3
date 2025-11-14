import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const PaginaLogin = () => {
  const { error, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password); // credenciales del login
    if (result.success) {
      navigate("/"); 
    }
  };

  return (
    <article>
      <h2>Ingrese usuario y contraseña</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="email">Usuario (Email):</label>
          <input
            id="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password" 
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <footer>
          <div className="grid">
            <input
              type="button"
              className="secondary"
              value="Cancelar"
              onClick={() => navigate("/")} 
            />
            <input type="submit" value="Ingresar" />
          </div>
        </footer>
      </form>
    </article>
  );
};
// frontend/src/ModificarTurno.jsx

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom";

export const ModificarTurno = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [values, setValues] = useState({
    ID: id,
    paciente_id: "",
    medico_id: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
    observaciones: "",
  });

  const fetchDatos = useCallback(async () => {
    try {
      const [pacientesRes, medicosRes, turnoRes] = await Promise.all([
        fetchAuth("http://localhost:3000/api/pacientes"),
        fetchAuth("http://localhost:3000/api/medicos"),
        fetchAuth(`http://localhost:3000/api/turnos/${id}`),
      ]);

      if (!pacientesRes.ok || !medicosRes.ok || !turnoRes.ok) {
        throw new Error("Error al cargar datos iniciales");
      }

      const pacientesData = await pacientesRes.json();
      const medicosData = await medicosRes.json();
      const turnoData = await turnoRes.json();

      setPacientes(pacientesData); 
      setMedicos(medicosData);

      if (turnoData.fecha) {
        turnoData.fecha = turnoData.fecha.split("T")[0];
      }

      setValues({
        ID: turnoData.ID,
        paciente_id: turnoData.Paciente_id,
        medico_id: turnoData.Medico_id,
        fecha: turnoData.Fecha.split("T")[0],
        hora: turnoData.Hora.slice(0, 5),
        estado: turnoData.Estado,
        observaciones: turnoData.Observaciones,
      });
    } catch (err) {
      setError(err.message);
    }
  }, [fetchAuth, id]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: name === "paciente_id" || name === "medico_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      paciente_id: values.paciente_id,
      medico_id: values.medico_id,
      fecha: values.fecha,
      hora: values.hora.length === 5 ? `${values.hora}:00` : values.hora,
      estado: values.estado,
      observaciones: values.observaciones,
    };

    try {
      const response = await fetchAuth(
        `http://localhost:3000/api/turnos/${id}`,
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
        throw new Error(data.message || "Error al modificar el turno");
      }

      navigate("/turnos");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article>
      <h2>Modificar Turno (ID: {values.ID})</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="paciente_id">Paciente</label>
          <select
            id="paciente_id"
            name="paciente_id"
            value={values.paciente_id || ""}
            onChange={handleChange}
            required
          >
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.Nombre} {p.Apellido} (DNI: {p.DNI})
              </option>
            ))}
          </select>

          <label htmlFor="medico_id">Médico</label>
          <select
            id="medico_id"
            name="medico_id"
            value={values.medico_id || ""}
            onChange={handleChange}
            required
          >
            {medicos.map((m) => ( 
              <option key={m.ID} value={m.ID}>
                {m.Nombre} {m.Apellido} ({m.Especialidad})
              </option>
            ))}
          </select>

          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={values.fecha}
            onChange={handleChange}
            required
          />

          <label htmlFor="hora">Hora</label>
          <input
            id="hora"
            name="hora"
            type="time"
            value={values.hora}
            onChange={handleChange}
            required
          />

          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={values.estado}
            onChange={handleChange}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={values.observaciones || ''}
            onChange={handleChange}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </fieldset>
        <input type="submit" value="Guardar Cambios" />
      </form>
    </article>
  );
};
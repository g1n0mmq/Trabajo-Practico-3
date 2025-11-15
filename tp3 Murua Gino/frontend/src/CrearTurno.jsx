import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export const CrearTurno = () => {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true); 
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [values, setValues] = useState({
    paciente_id: null,
    medico_id: null,
    fecha: "",
    hora: "",
    estado: "pendiente",
    observaciones: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [pacientesRes, medicosRes] = await Promise.all([
        fetchAuth("http://localhost:3000/api/pacientes"),
        fetchAuth("http://localhost:3000/api/medicos"),
      ]);
      
      if (!pacientesRes.ok || !medicosRes.ok) {
         throw new Error("Error al cargar pacientes o médicos");
      }

      const pacientesData = await pacientesRes.json();
      const medicosData = await medicosRes.json();
      
      setPacientes(pacientesData);
      setMedicos(medicosData);

      setValues(currentValues => ({
        ...currentValues,
        paciente_id: pacientesData.length > 0 ? pacientesData[0].id : null,
        medico_id: medicosData.length > 0 ? medicosData[0].ID : null,
      }));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(currentValues => ({
      ...currentValues,
      [name]: name === "paciente_id" || name === "medico_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      paciente_id: Number(values.paciente_id),
      medico_id: Number(values.medico_id),
      fecha: values.fecha,
      hora: values.hora.length === 5 ? `${values.hora}:00` : values.hora, // Asegurar formato HH:MM:SS
      estado: values.estado,
      observaciones: values.observaciones,
    };

    try {
      const response = await fetchAuth("http://localhost:3000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajesError = data.errors.map((err) => err.msg).join(". ");
          throw new Error(mensajesError);
        }
        throw new Error(data.message || "Error al crear el turno");
      }

      navigate("/turnos");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article>
      <h2>Crear Nuevo Turno</h2>
      <form onSubmit={handleSubmit}>
        <fieldset aria-busy={loading}>
          <label htmlFor="paciente_id">Paciente</label>
          <select
            id="paciente_id"
            name="paciente_id"
            value={String(values.paciente_id || "")}
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
            value={String(values.medico_id || "")}
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
        <input type="submit" value="Crear Turno" />
      </form>
    </article>
  );
};
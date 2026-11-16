import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./Auth";
import { validarConductor } from "./validaciones";

export function ConductorDetalles() {
  const [conductor, setConductor] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const obtenerConductor = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/conductores/${id}`);

      if (!response.ok) {
        console.error("Fallo al pedir detalles de conductor");
        setConductor(null);
        return;
      }

      const c = await response.json();
      setConductor({
        ...c,
        fecha_alta_licencia: String(c.fecha_alta_licencia).slice(0, 10),
        fecha_vencimiento_licencia: String(c.fecha_vencimiento_licencia).slice(0, 10),
      });
    } catch (err) {
      console.error(err.message);
    }
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerConductor();
  }, [obtenerConductor]);

  const empezarEdicion = () => {
    setForm({ ...conductor });
    setErrores({});
    setErrorServidor("");
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarConductor(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre,
        apellido: form.apellido,
        documento: form.documento,
        licencia: form.licencia,
        fecha_alta_licencia: form.fecha_alta_licencia,
        fecha_vencimiento_licencia: form.fecha_vencimiento_licencia,
      }),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    setEditando(false);
    obtenerConductor();
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar este conductor?")) return;

    const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/conductores");
  };

  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  if (!conductor) {
    return null;
  }

  if (editando) {
    return (
      <>
        <h2>Modificar conductor</h2>
        <form onSubmit={guardar}>
          <label htmlFor="nombre">Nombre:</label>
          <input id="nombre" value={form.nombre} onChange={cambiar("nombre")} />
          {errores.nombre && <p style={{ color: "red" }}>{errores.nombre}</p>}

          <label htmlFor="apellido">Apellido:</label>
          <input id="apellido" value={form.apellido} onChange={cambiar("apellido")} />
          {errores.apellido && <p style={{ color: "red" }}>{errores.apellido}</p>}

          <label htmlFor="documento">Documento:</label>
          <input id="documento" value={form.documento} onChange={cambiar("documento")} />
          {errores.documento && <p style={{ color: "red" }}>{errores.documento}</p>}

          <label htmlFor="licencia">Número de licencia:</label>
          <input id="licencia" value={form.licencia} onChange={cambiar("licencia")} />
          {errores.licencia && <p style={{ color: "red" }}>{errores.licencia}</p>}

          <label htmlFor="alta">Fecha de alta de licencia:</label>
          <input
            id="alta"
            type="date"
            value={form.fecha_alta_licencia}
            onChange={cambiar("fecha_alta_licencia")}
          />
          {errores.fecha_alta_licencia && (
            <p style={{ color: "red" }}>{errores.fecha_alta_licencia}</p>
          )}

          <label htmlFor="vencimiento">Fecha de vencimiento de licencia:</label>
          <input
            id="vencimiento"
            type="date"
            value={form.fecha_vencimiento_licencia}
            onChange={cambiar("fecha_vencimiento_licencia")}
          />
          {errores.fecha_vencimiento_licencia && (
            <p style={{ color: "red" }}>{errores.fecha_vencimiento_licencia}</p>
          )}

          {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

          <div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <h2>Detalle de conductor</h2>
      <p>Apellido: <b>{conductor.apellido}</b></p>
      <p>Nombre: <b>{conductor.nombre}</b></p>
      <p>Documento: <b>{conductor.documento}</b></p>
      <p>Licencia: <b>{conductor.licencia}</b></p>
      <p>Alta de licencia: <b>{conductor.fecha_alta_licencia}</b></p>
      <p>Vencimiento de licencia: <b>{conductor.fecha_vencimiento_licencia}</b></p>

      {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

      <div>
        <button onClick={empezarEdicion}>Modificar</button>
        <button onClick={eliminar}>Eliminar</button>
        <Link to="/conductores">
          <button>Volver</button>
        </Link>
      </div>
    </>
  );
}
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./Auth";
import { VehiculosSelect } from "./VehiculosSelect";
import { ConductoresSelect } from "./ConductoresSelect";
import { validarViaje } from "./validaciones";

export function ViajeDetalles() {
  const [viaje, setViaje] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const obtenerViaje = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/viajes/${id}`);

      if (!response.ok) {
        console.error("Fallo al pedir detalles de viaje");
        setViaje(null);
        return;
      }

      const v = await response.json();
      setViaje({
        ...v,
        fecha_salida: String(v.fecha_salida).slice(0, 16),
        fecha_llegada: String(v.fecha_llegada).slice(0, 16),
        observaciones: v.observaciones ?? "",
      });
    } catch (err) {
      console.error(err.message);
    }
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerViaje();
  }, [obtenerViaje]);

  const empezarEdicion = () => {
    setForm({ ...viaje });
    setErrores({});
    setErrorServidor("");
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarViaje(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehiculo_id: form.vehiculo_id,
        conductor_id: form.conductor_id,
        fecha_salida: form.fecha_salida,
        fecha_llegada: form.fecha_llegada,
        origen: form.origen,
        destino: form.destino,
        kilometros: Number(form.kilometros),
        observaciones: form.observaciones || undefined,
      }),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    setEditando(false);
    obtenerViaje();
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar este viaje?")) return;

    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/viajes");
  };

  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  if (!viaje) {
    return null;
  }

  if (editando) {
    return (
      <>
        <h2>Modificar viaje</h2>
        <form onSubmit={guardar}>
          <VehiculosSelect
            vehiculoId={form.vehiculo_id}
            onChange={(vehiculo_id) => setForm((f) => ({ ...f, vehiculo_id }))}
          />
          {errores.vehiculo_id && <p style={{ color: "red" }}>{errores.vehiculo_id}</p>}

          <ConductoresSelect
            conductorId={form.conductor_id}
            onChange={(conductor_id) => setForm((f) => ({ ...f, conductor_id }))}
          />
          {errores.conductor_id && <p style={{ color: "red" }}>{errores.conductor_id}</p>}

          <label htmlFor="salida">Fecha de salida:</label>
          <input
            id="salida"
            type="datetime-local"
            value={form.fecha_salida}
            onChange={cambiar("fecha_salida")}
          />
          {errores.fecha_salida && <p style={{ color: "red" }}>{errores.fecha_salida}</p>}

          <label htmlFor="llegada">Fecha de llegada:</label>
          <input
            id="llegada"
            type="datetime-local"
            value={form.fecha_llegada}
            onChange={cambiar("fecha_llegada")}
          />
          {errores.fecha_llegada && <p style={{ color: "red" }}>{errores.fecha_llegada}</p>}

          <label htmlFor="origen">Origen:</label>
          <input id="origen" value={form.origen} onChange={cambiar("origen")} />
          {errores.origen && <p style={{ color: "red" }}>{errores.origen}</p>}

          <label htmlFor="destino">Destino:</label>
          <input id="destino" value={form.destino} onChange={cambiar("destino")} />
          {errores.destino && <p style={{ color: "red" }}>{errores.destino}</p>}

          <label htmlFor="kilometros">Kilómetros:</label>
          <input
            id="kilometros"
            type="number"
            min={0}
            step="0.1"
            value={form.kilometros}
            onChange={cambiar("kilometros")}
          />
          {errores.kilometros && <p style={{ color: "red" }}>{errores.kilometros}</p>}

          <label htmlFor="observaciones">Observaciones:</label>
          <input
            id="observaciones"
            value={form.observaciones}
            onChange={cambiar("observaciones")}
          />
          {errores.observaciones && <p style={{ color: "red" }}>{errores.observaciones}</p>}

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
      <h2>Detalle de viaje</h2>
      <p>Vehículo: <b>{viaje.marca} {viaje.modelo} ({viaje.patente})</b></p>
      <p>Conductor: <b>{viaje.conductor_apellido}, {viaje.conductor_nombre}</b></p>
      <p>Salida: <b>{viaje.fecha_salida.replace("T", " ")}</b></p>
      <p>Llegada: <b>{viaje.fecha_llegada.replace("T", " ")}</b></p>
      <p>Origen: <b>{viaje.origen}</b></p>
      <p>Destino: <b>{viaje.destino}</b></p>
      <p>Kilómetros: <b>{viaje.kilometros}</b></p>
      <p>Observaciones: <b>{viaje.observaciones || "-"}</b></p>

      {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

      <div>
        <button onClick={empezarEdicion}>Modificar</button>
        <button onClick={eliminar}>Eliminar</button>
        <Link to="/viajes">
          <button>Volver</button>
        </Link>
      </div>
    </>
  );
}
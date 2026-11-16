import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import { VehiculosSelect } from "./VehiculosSelect";
import { ConductoresSelect } from "./ConductoresSelect";
import { validarViaje } from "./validaciones";

export function ViajeCrear() {
  const [viaje, setViaje] = useState({
    vehiculo_id: 0,
    conductor_id: 0,
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: "",
    observaciones: "",
  });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarViaje(viaje);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth("http://localhost:3000/viajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...viaje,
        kilometros: Number(viaje.kilometros),
        observaciones: viaje.observaciones || undefined,
      }),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/viajes");
  };

  const cambiar = (campo) => (e) =>
    setViaje((v) => ({ ...v, [campo]: e.target.value }));

  return (
    <>
      <h2>Nuevo viaje</h2>
      <form onSubmit={handleSubmit}>
        <VehiculosSelect
          vehiculoId={viaje.vehiculo_id}
          onChange={(vehiculo_id) => setViaje((v) => ({ ...v, vehiculo_id }))}
        />
        {errores.vehiculo_id && <p style={{ color: "red" }}>{errores.vehiculo_id}</p>}

        <ConductoresSelect
          conductorId={viaje.conductor_id}
          onChange={(conductor_id) => setViaje((v) => ({ ...v, conductor_id }))}
        />
        {errores.conductor_id && <p style={{ color: "red" }}>{errores.conductor_id}</p>}

        <label htmlFor="salida">Fecha de salida:</label>
        <input
          id="salida"
          type="datetime-local"
          value={viaje.fecha_salida}
          onChange={cambiar("fecha_salida")}
        />
        {errores.fecha_salida && <p style={{ color: "red" }}>{errores.fecha_salida}</p>}

        <label htmlFor="llegada">Fecha de llegada:</label>
        <input
          id="llegada"
          type="datetime-local"
          value={viaje.fecha_llegada}
          onChange={cambiar("fecha_llegada")}
        />
        {errores.fecha_llegada && <p style={{ color: "red" }}>{errores.fecha_llegada}</p>}

        <label htmlFor="origen">Origen:</label>
        <input id="origen" value={viaje.origen} onChange={cambiar("origen")} />
        {errores.origen && <p style={{ color: "red" }}>{errores.origen}</p>}

        <label htmlFor="destino">Destino:</label>
        <input id="destino" value={viaje.destino} onChange={cambiar("destino")} />
        {errores.destino && <p style={{ color: "red" }}>{errores.destino}</p>}

        <label htmlFor="kilometros">Kilómetros:</label>
        <input
          id="kilometros"
          type="number"
          min={0}
          step="0.1"
          value={viaje.kilometros}
          onChange={cambiar("kilometros")}
        />
        {errores.kilometros && <p style={{ color: "red" }}>{errores.kilometros}</p>}

        <label htmlFor="observaciones">Observaciones:</label>
        <input
          id="observaciones"
          value={viaje.observaciones}
          onChange={cambiar("observaciones")}
        />
        {errores.observaciones && <p style={{ color: "red" }}>{errores.observaciones}</p>}

        {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

        <div>
          <button type="submit">Crear</button>
          <Link to="/viajes">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
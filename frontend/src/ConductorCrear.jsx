import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import { validarConductor } from "./validaciones";

export function ConductorCrear() {
  const [conductor, setConductor] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    licencia: "",
    fecha_alta_licencia: "",
    fecha_vencimiento_licencia: "",
  });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarConductor(conductor);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth("http://localhost:3000/conductores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conductor),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/conductores");
  };

  const cambiar = (campo) => (e) =>
    setConductor((c) => ({ ...c, [campo]: e.target.value }));

  return (
    <>
      <h2>Nuevo conductor</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input id="nombre" value={conductor.nombre} onChange={cambiar("nombre")} />
        {errores.nombre && <p style={{ color: "red" }}>{errores.nombre}</p>}

        <label htmlFor="apellido">Apellido:</label>
        <input id="apellido" value={conductor.apellido} onChange={cambiar("apellido")} />
        {errores.apellido && <p style={{ color: "red" }}>{errores.apellido}</p>}

        <label htmlFor="documento">Documento:</label>
        <input id="documento" value={conductor.documento} onChange={cambiar("documento")} />
        {errores.documento && <p style={{ color: "red" }}>{errores.documento}</p>}

        <label htmlFor="licencia">Número de licencia:</label>
        <input id="licencia" value={conductor.licencia} onChange={cambiar("licencia")} />
        {errores.licencia && <p style={{ color: "red" }}>{errores.licencia}</p>}

        <label htmlFor="alta">Fecha de alta de licencia:</label>
        <input
          id="alta"
          type="date"
          value={conductor.fecha_alta_licencia}
          onChange={cambiar("fecha_alta_licencia")}
        />
        {errores.fecha_alta_licencia && (
          <p style={{ color: "red" }}>{errores.fecha_alta_licencia}</p>
        )}

        <label htmlFor="vencimiento">Fecha de vencimiento de licencia:</label>
        <input
          id="vencimiento"
          type="date"
          value={conductor.fecha_vencimiento_licencia}
          onChange={cambiar("fecha_vencimiento_licencia")}
        />
        {errores.fecha_vencimiento_licencia && (
          <p style={{ color: "red" }}>{errores.fecha_vencimiento_licencia}</p>
        )}

        {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

        <div>
          <button type="submit">Crear</button>
          <Link to="/conductores">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
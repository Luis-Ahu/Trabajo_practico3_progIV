import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import { validarVehiculo } from "./validaciones";

export function VehiculoCrear() {
  const [vehiculo, setVehiculo] = useState({
    marca: "",
    modelo: "",
    patente: "",
    año: "",
    capacidad_carga_kg: "",
  });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarVehiculo(vehiculo);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth("http://localhost:3000/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...vehiculo,
        año: Number(vehiculo.año),
        capacidad_carga_kg: Number(vehiculo.capacidad_carga_kg),
      }),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/vehiculos");
  };

  const cambiar = (campo) => (e) =>
    setVehiculo((v) => ({ ...v, [campo]: e.target.value }));

  return (
    <>
      <h2>Nuevo vehículo</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="marca">Marca:</label>
        <input id="marca" value={vehiculo.marca} onChange={cambiar("marca")} />
        {errores.marca && <p style={{ color: "red" }}>{errores.marca}</p>}

        <label htmlFor="modelo">Modelo:</label>
        <input id="modelo" value={vehiculo.modelo} onChange={cambiar("modelo")} />
        {errores.modelo && <p style={{ color: "red" }}>{errores.modelo}</p>}

        <label htmlFor="patente">Patente:</label>
        <input id="patente" value={vehiculo.patente} onChange={cambiar("patente")} />
        {errores.patente && <p style={{ color: "red" }}>{errores.patente}</p>}

        <label htmlFor="año">Año:</label>
        <input id="año" type="number" value={vehiculo.año} onChange={cambiar("año")} />
        {errores.año && <p style={{ color: "red" }}>{errores.año}</p>}

        <label htmlFor="capacidad">Capacidad de carga (kg):</label>
        <input
          id="capacidad"
          type="number"
          min={0}
          value={vehiculo.capacidad_carga_kg}
          onChange={cambiar("capacidad_carga_kg")}
        />
        {errores.capacidad_carga_kg && (
          <p style={{ color: "red" }}>{errores.capacidad_carga_kg}</p>
        )}

        {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

        <div>
          <button type="submit">Crear</button>
          <Link to="/vehiculos">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
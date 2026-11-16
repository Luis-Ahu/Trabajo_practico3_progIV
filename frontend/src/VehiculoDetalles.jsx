import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./Auth";
import { validarVehiculo } from "./validaciones";

export function VehiculoDetalles() {
  const [vehiculo, setVehiculo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const { id } = useParams();
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();

  const obtenerVehiculo = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);

      if (!response.ok) {
        console.error("Fallo al pedir detalles de vehiculo");
        setVehiculo(null);
        return;
      }

      setVehiculo(await response.json());
    } catch (err) {
      console.error(err.message);
    }
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerVehiculo();
  }, [obtenerVehiculo]);

  const empezarEdicion = () => {
    setForm({ ...vehiculo });
    setErrores({});
    setErrorServidor("");
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validarVehiculo(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marca: form.marca,
        modelo: form.modelo,
        patente: form.patente,
        año: Number(form.año),
        capacidad_carga_kg: Number(form.capacidad_carga_kg),
      }),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    setEditando(false);
    obtenerVehiculo();
  };

  const eliminar = async () => {
    if (!confirm("¿Eliminar este vehículo?")) return;

    const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/vehiculos");
  };

  const cambiar = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  if (!vehiculo) {
    return null;
  }

  if (editando) {
    return (
      <>
        <h2>Modificar vehículo</h2>
        <form onSubmit={guardar}>
          <label htmlFor="marca">Marca:</label>
          <input id="marca" value={form.marca} onChange={cambiar("marca")} />
          {errores.marca && <p style={{ color: "red" }}>{errores.marca}</p>}

          <label htmlFor="modelo">Modelo:</label>
          <input id="modelo" value={form.modelo} onChange={cambiar("modelo")} />
          {errores.modelo && <p style={{ color: "red" }}>{errores.modelo}</p>}

          <label htmlFor="patente">Patente:</label>
          <input id="patente" value={form.patente} onChange={cambiar("patente")} />
          {errores.patente && <p style={{ color: "red" }}>{errores.patente}</p>}

          <label htmlFor="año">Año:</label>
          <input id="año" type="number" value={form.año} onChange={cambiar("año")} />
          {errores.año && <p style={{ color: "red" }}>{errores.año}</p>}

          <label htmlFor="capacidad">Capacidad de carga (kg):</label>
          <input
            id="capacidad"
            type="number"
            min={0}
            value={form.capacidad_carga_kg}
            onChange={cambiar("capacidad_carga_kg")}
          />
          {errores.capacidad_carga_kg && (
            <p style={{ color: "red" }}>{errores.capacidad_carga_kg}</p>
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
      <h2>Detalle de vehículo</h2>
      <p>Marca: <b>{vehiculo.marca}</b></p>
      <p>Modelo: <b>{vehiculo.modelo}</b></p>
      <p>Patente: <b>{vehiculo.patente}</b></p>
      <p>Año: <b>{vehiculo.año}</b></p>
      <p>Capacidad de carga: <b>{vehiculo.capacidad_carga_kg} kg</b></p>

      {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

      <div>
        <button onClick={empezarEdicion}>Modificar</button>
        <button onClick={eliminar}>Eliminar</button>
        <Link to="/vehiculos">
          <button>Volver</button>
        </Link>
      </div>
    </>
  );
}
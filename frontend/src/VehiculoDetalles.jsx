import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "./Auth";

export function VehiculoDetalles() {
  const [vehiculo, setVehiculo] = useState(null);
  const { id } = useParams();
  const { fetchAuth } = useAuth();

  const obtenerVehiculo = useCallback(async () => {
    const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);

    if (!response.ok) {
      console.error("Fallo al pedir detalles de vehiculo");
      setVehiculo(null);
      return;
    }

    setVehiculo(await response.json());
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerVehiculo();
  }, [obtenerVehiculo]);

  if (!vehiculo) {
    return null;
  }

  return (
    <>
      <h2>Detalle de vehículo</h2>
      <p>Marca: <b>{vehiculo.marca}</b></p>
      <p>Modelo: <b>{vehiculo.modelo}</b></p>
      <p>Patente: <b>{vehiculo.patente}</b></p>
      <p>Año: <b>{vehiculo.año}</b></p>
      <p>Capacidad de carga: <b>{vehiculo.capacidad_carga_kg} kg</b></p>
      <Link to="/vehiculos">
        <button>Volver</button>
      </Link>
    </>
  );
}
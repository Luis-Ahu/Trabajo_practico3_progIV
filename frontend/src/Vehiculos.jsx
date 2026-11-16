import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const { fetchAuth } = useAuth();

  const obtenerVehiculos = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/vehiculos");

    if (!response.ok) {
      console.error("Fallo al pedir vehiculos");
      setVehiculos([]);
      return;
    }

    setVehiculos(await response.json());
  }, [fetchAuth]);

  useEffect(() => {
    obtenerVehiculos();
  }, [obtenerVehiculos]);

  return (
    <>
      <h1>Vehículos</h1>

      <Link to="/vehiculos/crear">
        <button>Nuevo vehículo</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad (kg)</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>
                <Link to={`/vehiculos/${v.id}`}>{v.id}</Link>
              </td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.patente}</td>
              <td>{v.año}</td>
              <td>{v.capacidad_carga_kg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
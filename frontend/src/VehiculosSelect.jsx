import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";

export function VehiculosSelect({ vehiculoId, onChange, textoVacio = "Seleccione un vehículo" }) {
  const [vehiculos, setVehiculos] = useState([]);
  const { fetchAuth } = useAuth();

  const obtenerVehiculos = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos");

      if (!response.ok) {
        console.error("Fallo al pedir vehiculos");
        return;
      }

      setVehiculos(await response.json());
    } catch (err) {
      console.error(err.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerVehiculos();
  }, [obtenerVehiculos]);

  return (
    <>
      <label htmlFor="vehiculo">Vehículo:</label>
      <select
        id="vehiculo"
        value={vehiculoId}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>{textoVacio}</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.marca} {v.modelo} - {v.patente}
          </option>
        ))}
      </select>
    </>
  );
}
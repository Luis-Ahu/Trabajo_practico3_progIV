import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./Auth";

export function ConductoresSelect({ conductorId, onChange, textoVacio = "Seleccione un conductor" }) {
  const [conductores, setConductores] = useState([]);
  const { fetchAuth } = useAuth();

  const obtenerConductores = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/conductores");

      if (!response.ok) {
        console.error("Fallo al pedir conductores");
        return;
      }

      setConductores(await response.json());
    } catch (err) {
      console.error(err.message);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerConductores();
  }, [obtenerConductores]);

  return (
    <>
      <label htmlFor="conductor">Conductor:</label>
      <select
        id="conductor"
        value={conductorId}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={0}>{textoVacio}</option>
        {conductores.map((c) => (
          <option key={c.id} value={c.id}>
            {c.apellido}, {c.nombre}
          </option>
        ))}
      </select>
    </>
  );
}
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";
import { ViajesFiltros } from "./ViajesFiltros";

export function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [totalKm, setTotalKm] = useState(0);
  const [filtros, setFiltros] = useState({ vehiculoId: 0, conductorId: 0 });
  const { fetchAuth } = useAuth();

  const armarQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filtros.vehiculoId > 0) params.append("vehiculo_id", filtros.vehiculoId);
    if (filtros.conductorId > 0) params.append("conductor_id", filtros.conductorId);
    return params.toString();
  }, [filtros]);

  const obtenerViajes = useCallback(async () => {
    try {
      const query = armarQuery();

      const response = await fetchAuth(`http://localhost:3000/viajes?${query}`);
      if (!response.ok) {
        console.error("Fallo al pedir viajes");
        setViajes([]);
        return;
      }
      setViajes(await response.json());

      const respKm = await fetchAuth(`http://localhost:3000/viajes/kilometros?${query}`);
      if (respKm.ok) {
        const { total_km } = await respKm.json();
        setTotalKm(Number(total_km));
      }
    } catch (err) {
      console.error(err.message);
      setViajes([]);
    }
  }, [armarQuery, fetchAuth]);

  useEffect(() => {
    obtenerViajes();
  }, [obtenerViajes]);

  const formatear = (fecha) => String(fecha).slice(0, 16).replace("T", " ");

  return (
    <>
      <h1>Viajes</h1>

      <ViajesFiltros filtros={filtros} onChange={setFiltros} />

      <h2>Listado</h2>

      <Link to="/viajes/crear">
        <button>Nuevo viaje</button>
      </Link>

      <p>
        Total de kilómetros: <b>{totalKm}</b>
      </p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Conductor</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Km</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>
                <Link to={`/viajes/${v.id}`}>{v.id}</Link>
              </td>
              <td>{v.marca} {v.modelo} ({v.patente})</td>
              <td>{v.conductor_apellido}, {v.conductor_nombre}</td>
              <td>{formatear(v.fecha_salida)}</td>
              <td>{formatear(v.fecha_llegada)}</td>
              <td>{v.origen}</td>
              <td>{v.destino}</td>
              <td>{v.kilometros}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
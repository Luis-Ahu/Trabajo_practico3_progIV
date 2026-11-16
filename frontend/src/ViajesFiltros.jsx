import { VehiculosSelect } from "./VehiculosSelect";
import { ConductoresSelect } from "./ConductoresSelect";

export function ViajesFiltros({ filtros, onChange }) {
  return (
    <>
      <h2>Filtros</h2>
      <VehiculosSelect
        vehiculoId={filtros.vehiculoId}
        textoVacio="Todos los vehículos"
        onChange={(vehiculoId) => onChange((f) => ({ ...f, vehiculoId }))}
      />
      <ConductoresSelect
        conductorId={filtros.conductorId}
        textoVacio="Todos los conductores"
        onChange={(conductorId) => onChange((f) => ({ ...f, conductorId }))}
      />
    </>
  );
}
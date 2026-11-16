import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Conductores() {
  const [conductores, setConductores] = useState([]);
  const { fetchAuth } = useAuth();

  const obtenerConductores = useCallback(async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/conductores");

      if (!response.ok) {
        console.error("Fallo al pedir conductores");
        setConductores([]);
        return;
      }

      setConductores(await response.json());
    } catch (err) {
      console.error(err.message);
      setConductores([]);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerConductores();
  }, [obtenerConductores]);

  return (
    <>
      <h1>Conductores</h1>

      <Link to="/conductores/crear">
        <button>Nuevo conductor</button>
      </Link>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Licencia</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((c) => (
            <tr key={c.id}>
              <td>
                <Link to={`/conductores/${c.id}`}>{c.id}</Link>
              </td>
              <td>{c.apellido}</td>
              <td>{c.nombre}</td>
              <td>{c.documento}</td>
              <td>{c.licencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
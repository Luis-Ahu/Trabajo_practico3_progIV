import { Link } from "react-router";

export function Home() {
  return (
    <>
      <h1>Gestión de transporte</h1>
      <p>
        Registrá los vehículos de la empresa, sus conductores y los viajes
        realizados, y consultá el historial y los kilómetros recorridos.
      </p>
      <p>
        <Link to="/login">Ingresá</Link> o{" "}
        <Link to="/registro">creá una cuenta</Link> para comenzar.
      </p>
    </>
  );
}
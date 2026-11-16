import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function Login() {
  const { error, login } = useAuth();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!email.trim()) e.email = "El email es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Formato de email inválido";
    if (!contraseña) e.contraseña = "La contraseña es obligatoria";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresForm = validar();
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const res = await login(email, contraseña);
    if (res.success) {
      navigate("/vehiculos");
    }
  };

  return (
    <>
      <h2>Ingresar</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errores.email && <p style={{ color: "red" }}>{errores.email}</p>}

        <label htmlFor="contraseña">Contraseña:</label>
        <input
          id="contraseña"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        {errores.contraseña && <p style={{ color: "red" }}>{errores.contraseña}</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Ingresar</button>
          <Link to="/">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
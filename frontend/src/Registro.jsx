import { useState } from "react";
import { Link, useNavigate } from "react-router";

export function Registro() {
  const [usuario, setUsuario] = useState({ nombre: "", email: "", contraseña: "" });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const navigate = useNavigate();

  const validar = () => {
    const e = {};
    if (!usuario.nombre.trim()) e.nombre = "El nombre es obligatorio";
    else if (usuario.nombre.length > 100) e.nombre = "Máximo 100 caracteres";
    if (!usuario.email.trim()) e.email = "El email es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(usuario.email)) e.email = "Formato de email inválido";
    if (usuario.contraseña.length < 8) e.contraseña = "Mínimo 8 caracteres";
    else if (!/[a-z]/.test(usuario.contraseña) || !/\d/.test(usuario.contraseña))
      e.contraseña = "Debe tener al menos una minúscula y un número";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");

    const erroresForm = validar();
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      setErrorServidor(await response.text());
      return;
    }

    navigate("/login");
  };

  return (
    <>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          value={usuario.nombre}
          onChange={(e) => setUsuario((u) => ({ ...u, nombre: e.target.value }))}
        />
        {errores.nombre && <p style={{ color: "red" }}>{errores.nombre}</p>}

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={usuario.email}
          onChange={(e) => setUsuario((u) => ({ ...u, email: e.target.value }))}
        />
        {errores.email && <p style={{ color: "red" }}>{errores.email}</p>}

        <label htmlFor="contraseña">Contraseña:</label>
        <input
          id="contraseña"
          type="password"
          value={usuario.contraseña}
          onChange={(e) => setUsuario((u) => ({ ...u, contraseña: e.target.value }))}
        />
        {errores.contraseña && <p style={{ color: "red" }}>{errores.contraseña}</p>}

        {errorServidor && <p style={{ color: "red" }}>{errorServidor}</p>}

        <div>
          <button type="submit">Registrarme</button>
          <Link to="/">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}
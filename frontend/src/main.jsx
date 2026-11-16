import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Login } from "./Login";
import { Registro } from "./Registro";
import { Vehiculos } from "./vehiculos";
import { VehiculoCrear } from "./VehiculoCrear";
import { AuthLayout } from "./AuthLayout";
import { AuthProvider } from "./Auth";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            <Route path="vehiculos" element={<AuthLayout />}>
            <Route index element={<Vehiculos />} />
            <Route path="crear" element={<VehiculoCrear />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
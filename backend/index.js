import express from "express";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import vehiculosRouter from "./vehiculos.js";
import conductoresRouter from "./conductores.js";
import viajesRouter from "./viajes.js";
import authRouter, { authConfig, authMiddleware } from "./auth.js";


conectarDB();

const app = express();
const port = 3000;

app.use(express.json());

authConfig();


app.get("/", (req, res) => {
    res.send("hola mundo");
});

app.use("/auth", authRouter);
app.use("/usuarios", authMiddleware, usuariosRouter);
app.use("/vehiculos", authMiddleware, vehiculosRouter);
app.use("/conductores", authMiddleware, conductoresRouter);
app.use("/viajes", authMiddleware, viajesRouter);


app.use((req, res) => {
    res.status(404).send("Ruta no encontrada");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Error interno del servidor");
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
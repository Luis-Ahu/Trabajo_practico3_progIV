import express from "express";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import vehiculosRouter from "./vehiculos.js"
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


app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
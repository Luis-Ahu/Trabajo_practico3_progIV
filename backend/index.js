import express from "express";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";

conectarDB();

const app = express();
const port = 3000;

app.use(express.json());


app.get("/", (req, res) => {
    res.send("hola mundo");
});


app.use("/usuarios", usuariosRouter);


app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
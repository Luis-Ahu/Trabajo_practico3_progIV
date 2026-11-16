import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones, validarVehiculos } from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const [vehiculos] = await db.execute("SELECT * FROM vehiculos");
    res.send(vehiculos);
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [vehiculos] = await db.execute("SELECT * FROM vehiculos WHERE id=?", [id]);

    if (vehiculos.length === 0) {
        return res.status(404).send("Vehículo no encontrado");
    }

    res.send(vehiculos[0]);
});


router.post("/", validarVehiculos, verificarValidaciones, async (req, res) => {
    const { marca, modelo, patente, año, capacidad_carga_kg } = req.body;

    try {
        const [result] = await db.execute(
            "INSERT INTO vehiculos (marca, modelo, patente, `año`, capacidad_carga_kg) VALUES (?, ?, ?, ?, ?)",
            [marca, modelo, patente, año, capacidad_carga_kg]
        );

        res.status(201).send({ id: result.insertId, marca, modelo, patente, año, capacidad_carga_kg });
    } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Ya existe un vehículo con esa patente");
        }
        throw e;
    }
});


router.put("/:id", validarId, validarVehiculos, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { marca, modelo, patente, año, capacidad_carga_kg } = req.body;

    try {
        const [result] = await db.execute(
            "UPDATE vehiculos SET marca=?, modelo=?, patente=?, `año`=?, capacidad_carga_kg=? WHERE id=?",
            [marca, modelo, patente, año, capacidad_carga_kg, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Vehículo no encontrado");
        }

        res.send({ id, marca, modelo, patente, año, capacidad_carga_kg });
    } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Ya existe un vehículo con esa patente");
        }
        throw e;
    }
});


router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [result] = await db.execute("DELETE FROM vehiculos WHERE id=?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Vehículo no encontrado");
        }

        res.send("Vehículo eliminado correctamente");
    } catch (e) {
        if (e.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).send("No se puede eliminar: el vehículo tiene viajes registrados");
        }
        throw e;
    }
});

export default router;
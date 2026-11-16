import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones, validarConductores } from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const [conductores] = await db.execute("SELECT * FROM conductores");
    res.send(conductores);
});

router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [conductores] = await db.execute("SELECT * FROM conductores WHERE id=?", [id]);

    if (conductores.length === 0) {
        return res.status(404).send("Conductor no encontrado");
    }

    res.send(conductores[0]);
});

router.post("/", validarConductores, verificarValidaciones, async (req, res) => {
    const { nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;

    try {
        const [result] = await db.execute(
            `INSERT INTO conductores
             (nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia]
        );

        res.status(201).send({
            id: result.insertId,
            nombre, apellido, documento, licencia,
            fecha_alta_licencia, fecha_vencimiento_licencia,
        });
    } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Ya existe un conductor con ese documento o licencia");
        }
        throw e;
    }
});

router.put("/:id", validarId, validarConductores, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE conductores SET nombre=?, apellido=?, documento=?, licencia=?,
             fecha_alta_licencia=?, fecha_vencimiento_licencia=? WHERE id=?`,
            [nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Conductor no encontrado");
        }

        res.send({ id, nombre, apellido, documento, licencia, fecha_alta_licencia, fecha_vencimiento_licencia });
    } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
            return res.status(400).send("Otro conductor ya tiene ese documento o licencia");
        }
        throw e;
    }
});

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [result] = await db.execute("DELETE FROM conductores WHERE id=?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send("Conductor no encontrado");
        }

        res.send("Conductor eliminado correctamente");
    } catch (e) {
        if (e.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).send("No se puede eliminar: el conductor tiene viajes registrados");
        }
        throw e;
    }
});


// Historial de viajes del conductor
router.get("/:id/viajes", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [viajes] = await db.execute(
        `SELECT v.*, ve.marca, ve.modelo, ve.patente
         FROM viajes v
         JOIN vehiculos ve ON v.vehiculo_id = ve.id
         WHERE v.conductor_id = ?
         ORDER BY v.fecha_salida DESC`,
        [id]
    );

    res.send(viajes);
});

// Total de kilómetros del conductor
router.get("/:id/kilometros", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [resultado] = await db.execute(
        "SELECT COALESCE(SUM(kilometros), 0) AS total_km FROM viajes WHERE conductor_id = ?",
        [id]
    );

    res.send(resultado[0]);
});

export default router;
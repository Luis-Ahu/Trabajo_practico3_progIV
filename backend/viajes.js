import express from "express";
import { db } from "./db.js";
import {
    validarId,
    validarFiltrosViajes,
    verificarValidaciones,
    validarViajes
} from "./validaciones.js";

const router = express.Router();

const SELECT_VIAJES =
    `SELECT v.id, v.vehiculo_id, v.conductor_id, v.fecha_salida, v.fecha_llegada,
            v.origen, v.destino, v.kilometros, v.observaciones,
            ve.marca, ve.modelo, ve.patente,
            c.nombre AS conductor_nombre, c.apellido AS conductor_apellido
     FROM viajes v
     JOIN vehiculos ve ON v.vehiculo_id = ve.id
     JOIN conductores c ON v.conductor_id = c.id`;

function armarFiltros(query) {
    const filtros = [];
    const parametros = [];

    if (query.vehiculo_id) {
        filtros.push("v.vehiculo_id = ?");
        parametros.push(Number(query.vehiculo_id));
    }
    if (query.conductor_id) {
        filtros.push("v.conductor_id = ?");
        parametros.push(Number(query.conductor_id));
    }

    const where = filtros.length > 0 ? " WHERE " + filtros.join(" AND ") : "";
    return { where, parametros };
}


router.get("/", validarFiltrosViajes, verificarValidaciones, async (req, res) => {
    const { where, parametros } = armarFiltros(req.query);

    const [viajes] = await db.execute(
        SELECT_VIAJES + where + " ORDER BY v.fecha_salida DESC",
        parametros
    );

    res.send(viajes);
});


router.get("/kilometros", validarFiltrosViajes, verificarValidaciones, async (req, res) => {
    const { where, parametros } = armarFiltros(req.query);

    const [resultado] = await db.execute(
        "SELECT COALESCE(SUM(v.kilometros), 0) AS total_km FROM viajes v" + where,
        parametros
    );

    res.send(resultado[0]);
});


router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [viajes] = await db.execute(SELECT_VIAJES + " WHERE v.id = ?", [id]);

    if (viajes.length === 0) {
        return res.status(404).send("Viaje no encontrado");
    }

    res.send(viajes[0]);
});


router.post("/", validarViajes, verificarValidaciones, async (req, res) => {
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;

    try {
        const [result] = await db.execute(
            `INSERT INTO viajes
             (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones ?? null]
        );

        res.status(201).send({
            id: result.insertId,
            vehiculo_id, conductor_id, fecha_salida, fecha_llegada,
            origen, destino, kilometros, observaciones: observaciones ?? null,
        });
    } catch (e) {
        if (e.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).send("El vehículo o el conductor no existe");
        }
        throw e;
    }
});


router.put("/:id", validarId, validarViajes, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE viajes SET vehiculo_id=?, conductor_id=?, fecha_salida=?, fecha_llegada=?,
             origen=?, destino=?, kilometros=?, observaciones=? WHERE id=?`,
            [vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones ?? null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Viaje no encontrado");
        }

        res.send({
            id, vehiculo_id, conductor_id, fecha_salida, fecha_llegada,
            origen, destino, kilometros, observaciones: observaciones ?? null,
        });
    } catch (e) {
        if (e.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).send("El vehículo o el conductor no existe");
        }
        throw e;
    }
});


router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute("DELETE FROM viajes WHERE id=?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).send("Viaje no encontrado");
    }

    res.send("Viaje eliminado correctamente");
});

export default router;
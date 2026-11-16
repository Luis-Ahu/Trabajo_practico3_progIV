import express from "express";
import bcrypt from "bcrypt";
import { db } from "./db.js";
import {
    validarId,
    validarUsuarioEdicion,
    verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();


router.get("/", async (req, res) => {
    const [usuarios] = await db.execute("SELECT id, nombre, email FROM usuarios");
    res.json(usuarios);
});


router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [usuarios] = await db.execute(
        "SELECT id, nombre, email FROM usuarios WHERE id=?",
        [id]
    );

    if (usuarios.length === 0) {
        return res.status(404).send("Usuario no encontrado");
    }

    res.json(usuarios[0]);
});



router.put("/:id", validarId, validarUsuarioEdicion, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    if (req.user.userId !== id) {
        return res.status(403).send("No podés modificar a otro usuario");
    }

    const { nombre, email, contraseña } = req.body;

    try {
        let result;
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, 12);
            [result] = await db.execute(
                "UPDATE usuarios SET nombre=?, email=?, `contraseña`=? WHERE id=?",
                [nombre, email, hashedPassword, id]
            );
        } else {
            [result] = await db.execute(
                "UPDATE usuarios SET nombre=?, email=? WHERE id=?",
                [nombre, email, id]
            );
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }

        res.json({ id, nombre, email });
    } catch (e) {
        if (e.code === "ER_DUP_ENTRY") {
            return res.status(400).send("El email ya está registrado");
        }
        throw e;
    }
});

router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    if (req.user.userId !== id) {
        return res.status(403).send("No podés eliminar a otro usuario");
    }

    const [result] = await db.execute("DELETE FROM usuarios WHERE id=?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).send("Usuario no encontrado");
    }

    res.send("Usuario eliminado correctamente");
});

export default router;
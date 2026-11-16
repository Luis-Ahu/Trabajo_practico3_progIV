import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy, ExtractJwt } from "passport-jwt";
import { db } from "./db.js";
import { validarRegistro, validarLogin, verificarValidaciones } from "./validaciones.js";


const router = express.Router();


export function authConfig() {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    passport.use(
        new Strategy(jwtOptions, async (payload, next) => {
            next(null, payload);
        })
    );
}


export const authMiddleware = passport.authenticate("jwt", { session: false });

router.post("/register", validarRegistro, verificarValidaciones, async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    const [existe] = await db.execute("SELECT id FROM usuarios WHERE email=?", [email]);
    if (existe.length > 0) {
        return res.status(400).send("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(contraseña, 12);

    const [result] = await db.execute(
        "INSERT INTO usuarios (nombre, email, `contraseña`) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword]
    );

    res.status(201).json({ id: result.insertId, nombre, email });
});


router.post("/login", validarLogin, verificarValidaciones, async (req, res) => {
    const { email, contraseña } = req.body;

    const [usuarios] = await db.execute("SELECT * FROM usuarios WHERE email=?", [email]);

    // Mismo mensaje para email y contraseña inválidos: no le damos pistas a un atacante
    if (usuarios.length === 0) {
        return res.status(401).send("Credenciales inválidas");
    }

    const passwordOk = await bcrypt.compare(contraseña, usuarios[0].contraseña);
    if (!passwordOk) {
        return res.status(401).send("Credenciales inválidas");
    }

    const payload = { userId: usuarios[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.json({ token });
});

export default router;
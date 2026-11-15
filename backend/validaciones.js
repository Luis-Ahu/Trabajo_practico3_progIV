import { body, param, validationResult } from "express-validator";

export const validarId = param("id")
    .isInt({ min: 1 })
    .withMessage("el id debe ser un número positivo mayor que 0");

// ---------- Usuarios ----------

export const validarRegistro = [
    body("nombre")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("El nombre es obligatorio"),
    body("email")
        .isEmail()
        .withMessage("Email inválido"),
    body("contraseña")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0
        })
        .withMessage("Mínimo 8 caracteres, una minúscula y un número"),
];

export const validarUsuarioEdicion = [
    body("nombre")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("El nombre es obligatorio"),
    body("email")
        .isEmail()
        .withMessage("Email inválido"),
    body("contraseña")
        .optional()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0
        })
        .withMessage("Mínimo 8 caracteres, una minúscula y un número"),
];


// ---------- Middleware ----------
export const verificarValidaciones = (req, res, next) => {
    const resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        return res.status(400).send({
            mensaje: "parametros no validos",
            errores: resultado.array(),
        });
    }
    next();
};
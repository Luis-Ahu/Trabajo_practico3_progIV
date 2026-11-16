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

export const validarLogin = [
    body("email")
        .isEmail()
        .withMessage("Email inválido"),
    body("contraseña")
        .notEmpty()
        .withMessage("La contraseña es obligatoria"),
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


// ---------- Vehículos ----------

export const validarVehiculos = [
    body("marca")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("La marca es obligatoria (máx. 50 caracteres)"),
    body("modelo")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("El modelo es obligatorio (máx. 50 caracteres)"),
    body("patente")
        .trim()
        .isLength({ min: 6, max: 10 })
        .withMessage("La patente debe tener entre 6 y 10 caracteres"),
    body("año")
        .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
        .withMessage("El año debe ser un número entre 1950 y el año próximo"),
    body("capacidad_carga_kg")
        .isFloat({ min: 0 })
        .withMessage("La capacidad de carga debe ser un número mayor o igual a 0"),
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
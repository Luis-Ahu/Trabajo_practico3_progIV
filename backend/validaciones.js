import { body, param, validationResult, query } from "express-validator";

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


// ---------- Conductores ----------

export const validarConductores = [
    body("nombre")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("El nombre es obligatorio (máx. 50 caracteres)"),
    body("apellido")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("El apellido es obligatorio (máx. 50 caracteres)"),
    body("documento")
        .trim()
        .isNumeric()
        .isLength({ min: 7, max: 20 })
        .withMessage("El documento debe ser numérico (entre 7 y 20 dígitos)"),
    body("licencia")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("La licencia es obligatoria (máx. 20 caracteres)"),
    body("fecha_alta_licencia")
        .isISO8601()
        .withMessage("La fecha de alta debe tener formato AAAA-MM-DD"),
    body("fecha_vencimiento_licencia")
        .isISO8601()
        .withMessage("La fecha de vencimiento debe tener formato AAAA-MM-DD")
        .custom((valor, { req }) => new Date(valor) > new Date(req.body.fecha_alta_licencia))
        .withMessage("El vencimiento debe ser posterior al alta"),
];

// ---------- Viajes ----------

export const validarViajes = [
    body("vehiculo_id")
        .isInt({ min: 1 })
        .withMessage("vehiculo_id debe ser un número positivo"),
    body("conductor_id")
        .isInt({ min: 1 })
        .withMessage("conductor_id debe ser un número positivo"),
    body("fecha_salida")
        .isISO8601()
        .withMessage("La fecha de salida debe tener formato AAAA-MM-DDTHH:MM"),
    body("fecha_llegada")
        .isISO8601()
        .withMessage("La fecha de llegada debe tener formato AAAA-MM-DDTHH:MM")
        .custom((valor, { req }) => new Date(valor) >= new Date(req.body.fecha_salida))
        .withMessage("La llegada no puede ser anterior a la salida"),
    body("origen")
        .trim()
        .notEmpty()
        .withMessage("El origen es obligatorio"),
    body("destino")
        .trim()
        .notEmpty()
        .withMessage("El destino es obligatorio"),
    body("kilometros")
        .isFloat({ min: 0.1 })
        .withMessage("Los kilómetros deben ser un número mayor a 0"),
    body("observaciones")
        .optional({ values: "falsy" })
        .isLength({ max: 255 })
        .withMessage("Las observaciones admiten hasta 255 caracteres"),
];

export const validarFiltrosViajes = [
    query("vehiculo_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("vehiculo_id debe ser un número positivo"),
    query("conductor_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("conductor_id debe ser un número positivo"),
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
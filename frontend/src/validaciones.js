export function validarVehiculo(v) {
  const e = {};
  const anioMax = new Date().getFullYear() + 1;

  if (!v.marca.trim()) e.marca = "La marca es obligatoria";
  else if (v.marca.length > 50) e.marca = "Máximo 50 caracteres";

  if (!v.modelo.trim()) e.modelo = "El modelo es obligatorio";
  else if (v.modelo.length > 50) e.modelo = "Máximo 50 caracteres";

  const patente = v.patente.trim();
  if (patente.length < 6 || patente.length > 10)
    e.patente = "La patente debe tener entre 6 y 10 caracteres";

  const anio = Number(v.año);
  if (v.año === "" || !Number.isInteger(anio) || anio < 1950 || anio > anioMax)
    e.año = `El año debe estar entre 1950 y ${anioMax}`;

  if (v.capacidad_carga_kg === "" || Number(v.capacidad_carga_kg) < 0)
    e.capacidad_carga_kg = "La capacidad debe ser un número mayor o igual a 0";

  return e;
}

export function validarConductor(c) {
  const e = {};

  if (!c.nombre.trim()) e.nombre = "El nombre es obligatorio";
  else if (c.nombre.length > 50) e.nombre = "Máximo 50 caracteres";

  if (!c.apellido.trim()) e.apellido = "El apellido es obligatorio";
  else if (c.apellido.length > 50) e.apellido = "Máximo 50 caracteres";

  if (!/^\d{7,20}$/.test(c.documento.trim()))
    e.documento = "El documento debe ser numérico (entre 7 y 20 dígitos)";

  if (!c.licencia.trim()) e.licencia = "La licencia es obligatoria";
  else if (c.licencia.length > 20) e.licencia = "Máximo 20 caracteres";

  if (!c.fecha_alta_licencia) e.fecha_alta_licencia = "La fecha de alta es obligatoria";

  if (!c.fecha_vencimiento_licencia)
    e.fecha_vencimiento_licencia = "La fecha de vencimiento es obligatoria";
  else if (
    c.fecha_alta_licencia &&
    new Date(c.fecha_vencimiento_licencia) <= new Date(c.fecha_alta_licencia)
  )
    e.fecha_vencimiento_licencia = "El vencimiento debe ser posterior al alta";

  return e;
}

export function validarViaje(v) {
  const e = {};

  if (!v.vehiculo_id || Number(v.vehiculo_id) === 0)
    e.vehiculo_id = "Seleccioná un vehículo";

  if (!v.conductor_id || Number(v.conductor_id) === 0)
    e.conductor_id = "Seleccioná un conductor";

  if (!v.fecha_salida) e.fecha_salida = "La fecha de salida es obligatoria";

  if (!v.fecha_llegada) e.fecha_llegada = "La fecha de llegada es obligatoria";
  else if (v.fecha_salida && new Date(v.fecha_llegada) < new Date(v.fecha_salida))
    e.fecha_llegada = "La llegada no puede ser anterior a la salida";

  if (!v.origen.trim()) e.origen = "El origen es obligatorio";
  else if (v.origen.length > 100) e.origen = "Máximo 100 caracteres";

  if (!v.destino.trim()) e.destino = "El destino es obligatorio";
  else if (v.destino.length > 100) e.destino = "Máximo 100 caracteres";

  if (v.kilometros === "" || Number(v.kilometros) <= 0)
    e.kilometros = "Los kilómetros deben ser mayores a 0";

  if (v.observaciones && v.observaciones.length > 255)
    e.observaciones = "Máximo 255 caracteres";

  return e;
}
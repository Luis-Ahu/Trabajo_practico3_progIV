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
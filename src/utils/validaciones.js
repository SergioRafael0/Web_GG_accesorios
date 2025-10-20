// validaciones.js

// Validar correo
export function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

// Validar contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo)
export function validarPassword(pass) {
  const regex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[@#$!%*?&!¡¿_.:,;+=-])[A-Za-zÁÉÍÓÚáéíóúÑñ\d@#$!%*?&!¡¿_.:,;+=-]{8,}$/;
  return regex.test(pass);
}

// Validar confirmación de contraseña
export function validarCoincidencia(valor1, valor2) {
  return valor1 === valor2 && valor1 !== "";
}

// Validar campos requeridos
export function validarRequerido(valor) {
  // Normalizar a string antes de trim para evitar errores cuando valor no es string
  return String(valor || "").trim() !== "";
}

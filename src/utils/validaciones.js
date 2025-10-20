// Campos requeridos
export function validarRequerido(valor) {
  return String(valor || "").trim() !== "";
}

// Validar correo
export function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

// Validar contraseña
export function validarPassword(pass) {
  const regex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[@#$!%*?&!¡¿_.:,;+=-])[A-Za-zÁÉÍÓÚáéíóúÑñ\d@#$!%*?&!¡¿_.:,;+=-]{8,}$/;
  return regex.test(pass);
}

// Validar coincidencia de contraseñas
export function validarCoincidencia(valor1, valor2) {
  return valor1 === valor2 && valor1 !== "";
}

// Validar número de tarjeta (Visa, 16 dígitos + Luhn)
export function validarTarjeta(numero) {
  const num = numero.replace(/\D/g, "");
  if (!/^\d{16}$/.test(num)) return false;

  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let digit = parseInt(num[15 - i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// Validar fecha de expiración MM/AA
export function validarExpiracion(exp) {
  const match = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const mes = parseInt(match[1], 10);
  const anio = 2000 + parseInt(match[2], 10);

  if (mes < 1 || mes > 12) return false;

  const now = new Date();
  const fechaExp = new Date(anio, mes - 1, 1);
  return fechaExp >= new Date(now.getFullYear(), now.getMonth(), 1);
}
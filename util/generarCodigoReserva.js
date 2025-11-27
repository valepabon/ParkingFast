
export function generarCodigoReserva() {
    const numero = Math.floor(Math.random() * 900) + 100; 
    return "R-" + numero;
  }
  
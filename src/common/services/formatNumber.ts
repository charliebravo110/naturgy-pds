const formatNumberES = (numero: Number, decimals?: boolean) => {
  let cadena: string = '';
  let sNumero = numero.toString();
  if (decimals) {
    const aux = numero.toString()
    if (!aux.includes(',')) {
      return `${numero},00`
    } else if (aux.includes(',') && aux.split(',')[1].length === 1) {
      return `${numero}0`
    } else {
      return formatNumberES(numero)
    }
  } else {
    if (sNumero.length == 4) {
      if (sNumero.includes('.') || sNumero.includes(',')) {
        return numero.toLocaleString('es-ES');
      } else {
        let cadena = numero.toLocaleString('es-ES');
        const result = cadena.slice(0, 1) + '.' + cadena.slice(1);
        return result;
      }
    } else {
      return numero.toLocaleString('es-ES');
    }
  }
}

export {
  formatNumberES
}
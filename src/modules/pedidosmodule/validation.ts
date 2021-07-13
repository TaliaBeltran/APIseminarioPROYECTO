export var validacion = (value: string) => {
  const regexp = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};
// ---------Validacion para Ordenar Pedido-------------
export var validacionOrdenarP = (value: String) => {
  value = value.toLowerCase();
  if (value == "off" || value == "on") {
    return true;
  }
  return false;
};

//-------------Validacion stock y  price de product
export var isValueOk = (value: number) => {
  if (value > -1) {
    return true;
  }
  return false;
};

// --------------Validar Eliminacion del Pedido ----------
export var validarEliminacionPedido = (value: Date) => {
  var horaPedido = parseInt(value.toString().substring(16, 18));
  var minutoPedido = parseInt(value.toString().substring(19, 21));
  var actual = new Date();
  var horaactual = parseInt(actual.toString().substring(16, 18));
  var minutoActual = parseInt(actual.toString().substring(19, 21));
  var transcurridoMinutos = minutoActual - minutoPedido;
  var transcurridoHoras = horaactual - horaPedido;
  console.log(
    "Hora actual " +
      horaactual +
      " minuto actual " +
      minutoActual +
      " horaPedido " +
      horaPedido +
      " minutopedido " +
      minutoPedido +
      " restatotal " +
      transcurridoHoras +
      " " +
      transcurridoMinutos
  );
  if (transcurridoHoras > 0) {
    return false;
  } else if (transcurridoMinutos > 10) {
    return false;
  }
  return true;
};

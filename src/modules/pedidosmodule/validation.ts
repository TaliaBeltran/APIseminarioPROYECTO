export var validacion = (value: string) => {
  const regexp = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};

export var validacionOrdenarP = (value: String) => {
  value = value.toLowerCase();
  if (value == "off" || value == "on") {
    return true;
  }
  return false;
};

//--validacion stock, price de product
export var isValueOk = (value: number) => {
  if (value > -1) {
    return true;
  }
  return false;
};

//validar eliminacion del pedido
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
    //como solo tenemos 10 min para eliminar el pedido, entonces aqui preguntamos si paso alguna hora entre la hora del pedido y el momento actual, en caso de ser asi se rechaza eliminacion, porque sobrepasa los 10 min
    return false;
  } else if (transcurridoMinutos > 10) {
    return false;
  }
  return true;
};

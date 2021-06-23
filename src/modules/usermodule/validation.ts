import BusinessUser from "./businessController/BusinessUser";
import { IUser } from "./models/Users";

export var validacion = (value: string) => {
  const regexp = /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  return regexp.test(value);
};

import RolesModel, { IRoles } from "../models/Roles";
class BussinessRoles {
  constructor() {}

  // ----crear rol  -----------------
  public async createRol(rol: IRoles) {
    try {
      let roles = new RolesModel(rol);
      let result = await roles.save();
      return result;
    } catch (error) {
      return null;
    }
  }
  //------leer rol ------------
  public async readRoles() {
    let listRoles: Array<IRoles> = await RolesModel.find();
    return listRoles;
  }
  //---- eliminar rol ---------------

  public async deleteRol(id: String) {
    let result = await RolesModel.remove({ _id: id });
    return result;
  }
}
export default BussinessRoles;

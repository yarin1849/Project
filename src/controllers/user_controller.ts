import Usermodel, { IUser } from "../models/user_model";
import createController from "./base_controller";

const UserController = createController<IUser>(Usermodel);

export default UserController


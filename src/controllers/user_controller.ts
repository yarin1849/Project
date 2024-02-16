import Usermodel, { IUser } from "../models/user_model";
import createController from "./base_controller";

const studentController = createController<IUser>(Usermodel);

export default studentController


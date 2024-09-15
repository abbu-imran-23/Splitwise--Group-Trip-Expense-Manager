// Imports
import express, { Router } from "express";
import validate from "../middlewares/SchemaValidation";
import { updateUserDetailsSchema } from "../utils/ZodSchemas";
import isAuthenticated from "../middlewares/auth";
import { deleteUser, getUserDetails, updateUserDetails } from "../controllers/user/User";

const router: Router = express.Router();

/***   AUTH ROUTES  ***/
router.route("/getUserDetails").get(isAuthenticated, getUserDetails);
router.route("/updateUserDetails").put(isAuthenticated, validate(updateUserDetailsSchema), updateUserDetails);
router.route("/deleteUser").delete(isAuthenticated, deleteUser);

export default router;
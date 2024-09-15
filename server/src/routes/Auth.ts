// Imports
import express, { Router } from "express";
import validate from "../middlewares/SchemaValidation";
import { SignUpSchema, LoginSchema, changePasswordSchema } from "../utils/ZodSchemas";
import signup from "../controllers/auth/Signup";
import login from "../controllers/auth/Login";
import isAuthenticated from "../middlewares/auth";
import logout from "../controllers/auth/Logout";
import refreshAccessToken from "../controllers/auth/RefreshAccessToken";
import verifyAccessToken from "../controllers/auth/VerifyAccessToken";
import changePassword from "../controllers/auth/ChangePassword";
import { validateRateLimit, handleLoginAttempt, resetLoginAttempt } from "../middlewares/rateLimit";

const router: Router = express.Router();

/***   AUTH ROUTES  ***/
router.route("/signup").post(validate(SignUpSchema), signup);
router.route("/login").post(validateRateLimit, handleLoginAttempt, validate(LoginSchema), login, resetLoginAttempt);
router.route("/logout").post(isAuthenticated, logout);
router.route("/refresh-access-token").post(isAuthenticated, refreshAccessToken);
router.route("/verify-access-token").post(isAuthenticated, verifyAccessToken);
router.route("/change-password").post(isAuthenticated, validate(changePasswordSchema), changePassword);

export default router;
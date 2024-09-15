// Imports
import express, { Router } from "express";
import isAuthenticated from "../middlewares/auth";
import paymentSuccess from "../../src/controllers/Payment";

const router: Router = express.Router();

/***   Payment Routes  ***/
router.route("/user/:userId/expense/:expenseId/paymentMethod/:paymentMethodId/success").post(isAuthenticated, paymentSuccess);


export default router;
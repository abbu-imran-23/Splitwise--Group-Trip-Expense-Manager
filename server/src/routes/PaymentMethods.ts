// Imports
import express, { Router } from "express";
import isAuthenticated from "../middlewares/auth";
import { addPaymentMethod, deletePaymentMethod, updatePaymentMethod } from "../../src/controllers/PaymentMethod";

const router: Router = express.Router();

/***   Payment Methods Routes  ***/
router.route("/addPaymentMethod/:userId").post(isAuthenticated, addPaymentMethod);
router.route("/updatePaymentMethod/:userId").put(isAuthenticated, updatePaymentMethod);
router.route("/deletePaymentMethod/:userId").delete(isAuthenticated, deletePaymentMethod);

export default router;
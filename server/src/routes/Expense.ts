// Imports
import express, { Router } from "express";
import isAuthenticated from "../middlewares/auth";
import { addExpenseMate, createExpense, removeExpenseMate, updateExpense } from "../../src/controllers/Expense";

const router: Router = express.Router();

/***   Expense Routes  ***/
router.route("/createExpense").post(isAuthenticated, createExpense);
router.route("/updateExpense/:expenseId").put(isAuthenticated, updateExpense);
router.route("/:expenseId/trip/:tripId/addExpenseMate/:tripMateId").patch(isAuthenticated, addExpenseMate);
router.route("/:expenseId/trip/:tripId/removeExpenseMate/:tripMateId").patch(isAuthenticated, removeExpenseMate);


export default router;
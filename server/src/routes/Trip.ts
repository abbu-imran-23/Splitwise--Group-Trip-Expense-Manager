// Imports
import express, { Router } from "express";
import isAuthenticated from "../middlewares/auth";
import { addTripMate, createTrip, deleteTrip, removeTripMate, updateTripName } from "../../src/controllers/Trip";

const router: Router = express.Router();

/***   Trip Routes  ***/
router.route("/createTrip").post(isAuthenticated, createTrip);
router.route("/deleteTrip/:tripId").delete(isAuthenticated, deleteTrip);
router.route("/updateTrip/:tripId").patch(isAuthenticated, updateTripName);
router.route("/:tripId/addTripMate/:tripMateId").post(isAuthenticated, addTripMate);
router.route("/:tripId/removeTripMate/:tripMateId").delete(isAuthenticated, removeTripMate);


export default router;
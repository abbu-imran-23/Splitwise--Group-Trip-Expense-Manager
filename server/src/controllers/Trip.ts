import { Request, Response } from "express";
import { Trip } from "../models/Trip";
import { User } from "../models/User";
import { Expense } from "../models/Expense";

// Create Trip
const createTrip = async (req: Request, res: Response) => {
    try {
        // Parse Trip Details from req body
        const { tripName, userId, tripMates, tripExpenses } = req.body;

        const tripCreater = userId;
        // Handle if any field is not entered by the trip creater
        if (!tripName || !tripCreater || !tripMates || !tripExpenses) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        tripMates.push(tripCreater);

        // Create Trip
        const trip = await Trip.create({
            tripName,
            tripCreater,
            tripMates,
            tripExpenses
        })

        // Push Trip in TripMates's Trips Array
        tripMates.forEach(async (tripMate: any) => {
            await User.findByIdAndUpdate(tripMate, {
                $push: {
                    trips: trip
                }
            })
        })

        // Return Success Flag
        return res.status(200).json({
            success: true,
            message: "Trip created successfully",
            data: trip
        })

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error in create trip"
        })
    }
}

// Delete Trip
const deleteTrip = async (req: Request, res: Response) => {
    try {
        // Parse tripId from req.params;
        const { tripId } = req.params;

        // Handle if tripId is not passed
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "TripId is missing"
            })
        }

        // Find trip from DB
        const isTripExist = await Trip.findById(tripId);

        // Handle if trip doesnot exist in DB
        if (!isTripExist) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }

        // Pull the trip from tripMates
        for (const tripMate of isTripExist.tripMates) {
            await User.findByIdAndUpdate(tripMate, {
                $pull: { trips: tripId }
            });
        }

        // Remove expense related to the trip
        await Expense.deleteMany({ _id: { $in: isTripExist.tripExpenses } });

        // Delete trip
        await Trip.findByIdAndDelete(tripId);

        // Success flag
        return res.status(200).json({
            success: true,
            message: "Trip deleted successfully"
        })

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error in create trip"
        })
    }
}

// Add TripMate to the Trip
const addTripMate = async (req: Request, res: Response) => {
    try {
        // Parse tripId and userId from req.body
        const { tripId, tripMateId } = req.params;

        // Handle if any field is not entered 
        if (!tripId || !tripMateId) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Add user to the trip
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
            $push: {
                tripMates: tripMateId
            }
        }, { new: true }).populate("tripMates");

        // Push trip to the tripMate's Trips Array
        await User.findByIdAndUpdate(tripMateId, {
            $push: {
                trips: updatedTrip
            }
        })

        // Handle if tripId not found
        if (!updatedTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }

        // Success Flag
        return res.status(200).json({
            success: true,
            message: "Trip mate added succcessfully",
            data: updatedTrip
        })

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error"
        })
    }
}

// Remove TripMate from Trip
const removeTripMate = async (req: Request, res: Response) => {
    try {
        // Parse tripId and userId from req.body
        const { tripId, tripMateId } = req.params;

        // Handle if any field is not entered 
        if (!tripId || !tripMateId) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Remove user from the trip
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
            $pull: {
                tripMates: tripMateId
            }
        }, { new: true }).populate("tripMates");

        // Pull trip from the tripMate's Trips Array
        await User.findByIdAndUpdate(tripMateId, {
            $pull: {
                trips: tripId
            }
        })

        // Handle if tripId not found
        if (!updatedTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }

        // Success Flag
        return res.status(200).json({
            success: true,
            message: "Trip mate removed succcessfully",
            data: updatedTrip
        })

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error"
        })
    }
}

// Update Trip
const updateTripName = async (req: Request, res: Response) => {
    try {
        // Parse tripId from req.params
        const { tripId } = req.params;

        // Parse updated tripName
        const { tripName } = req.body;

        // Handle if tripId is missing 
        if (!tripId) {
            return res.status(400).json({
                success: false,
                message: "tripId is missing in params"
            })
        }

        // Handle if tripName is not passed 
        if (!tripName) {
            return res.status(400).json({
                success: false,
                message: "tripName is missing in body"
            })
        }

        // Find trip from DB
        const trip = await Trip.findById(tripId);

        // Handle if trip doesnot exist in DB
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            })
        }

        // Update Trip Name
        const updtaedTripName = await Trip.findByIdAndUpdate(tripId, {
            tripName: tripName
        }, { new: true });

        // Success Flag
        return res.status(200).json({
            success: true,
            message: "Trip Name updtaed succcessfully",
            data: updtaedTripName
        })

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error"
        })
    }
}

export { createTrip, deleteTrip, addTripMate, removeTripMate, updateTripName };
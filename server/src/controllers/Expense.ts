import { Request, Response } from "express"
import { Expense } from "../models/Expense";
import { Trip } from "../models/Trip";
import { User } from "../models/User";

const createExpense = async (req: Request, res: Response) => {
    try {
        // Parse Expense details from req.body
        const { trip, expenseName, expenseCreater, amountSpent, amountOwedBy } = req.body;

        // Handle if any field is not entered by the expense creater
        if (!trip || !expenseName || !expenseCreater || !amountSpent || !amountOwedBy) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        const amountTobePaidByEach = amountSpent / (amountOwedBy.length + 1);

        // Create Expense
        const expense = await Expense.create({
            trip,
            expenseName,
            expenseCreater,
            amountSpent,
            amountOwedBy,
            amountTobePaidByEachExpenseMate: amountTobePaidByEach
        })

        // Push expense to the Trip's tripExpenses array
        await Trip.findByIdAndUpdate(trip, {
            $push: {
                tripExpenses: expense._id
            }
        }, { new: true })

        // Push the Expense to Owed users' paymentsToBePaid
        await User.updateMany(
            { _id: { $in: amountOwedBy } },
            { $push: { paymentsToBePaid: expense._id } }
        );

        // Push the Expense to expense creater's paymentsToBeRecieved
        await User.findByIdAndUpdate(expenseCreater, {
            $push: {
                paymentsToBeRecieved: expense._id
            }
        })

        // Send success flag
        return res.status(201).json({
            success: true,
            message: "Expense created successfully",
            data: expense
        });

    } catch (error) {
        // Send Failure flag
        res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server Error"
        })
    }
}

// Update Expense
const updateExpense = async (req: Request, res: Response) => {
    try {

        // Parse expenseId
        const { expenseId } = req.params;

        // Handle if expenseId is not passed
        if (!expenseId) {
            return res.status(404).json({
                success: false,
                message: "expenseId is missing"
            })
        }

        // Parse Expense details from req.body
        const { trip, expenseName, expenseCreater, amountSpent, amountOwedBy } = req.body;

        // Handle if any field is not entered by the expense creater
        if (!trip || !expenseName || !expenseCreater || !amountSpent || !amountOwedBy) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Calculate Each ExpenseMate's share
        const amountTobePaidByEach = amountSpent / (amountOwedBy.length + 1);

        // Update in DB
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            trip,
            expenseName,
            expenseCreater,
            amountSpent,
            amountOwedBy,
            amountTobePaidByEachExpenseMate: amountTobePaidByEach
        }, { new: true })

        // Success flag
        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense
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

// Add Expense Mate
const addExpenseMate = async (req: Request, res: Response) => {
    try {

        // Parse expenseId
        // /:expenseId/trip/:tripId/addExpenseMate/:tripMateId
        const { tripId, expenseId, tripMateId } = req.params;

        // Handle if expenseId is not passed
        if (!tripId || !expenseId || !tripMateId) {
            return res.status(404).json({
                success: false,
                message: "Please send all the required params"
            })
        }

        // Check whether the tripMate is in trip
        const trip = await Trip.findOne({ _id: tripId, tripMates: tripMateId });

        // Check if trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found or trip mate not found in the trip"
            });
        }

        // Add tripMate to the Expense
        const expense = await Expense.findOne({ _id: expenseId, trip: tripId });

        // Handle if expense not found
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Check if expenseMate is already present in the expense
        const isExpenseMatePresent = await Expense.findOne({ _id: expenseId, amountOwedBy: tripMateId });

        if (isExpenseMatePresent) {
            return res.status(409).json({
                success: false,
                message: "ExpenseMate is alreday present"
            })
        }

        // If not present, add expenseMate
        const expenseDetails = await Expense.findByIdAndUpdate(expenseId, {
            $push: {
                amountOwedBy: tripMateId
            }
        }, { new: true });

        if (!expenseDetails) {
            return res.status(404).json({
                success: false,
                message: "Expense details not found"
            });
        }

        const amountSpent = expenseDetails?.amountSpent;
        const amountOwedBy = expenseDetails?.amountOwedBy.length;

        const amountTobePaidByEachExpenseMate = amountSpent / (amountOwedBy + 1);

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            amountTobePaidByEachExpenseMate: amountTobePaidByEachExpenseMate
        }, { new: true })

        // Add the expense to the expenseMate's paymentsToBePaid array
        await User.findByIdAndUpdate(tripMateId, {
            $push: {
                paymentsToBePaid: updatedExpense
            }
        })

        // Success flag
        return res.status(200).json({
            success: true,
            message: "ExpenseMate added successfully",
            data: updatedExpense
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

// Remove Expense Mate
const removeExpenseMate = async (req: Request, res: Response) => {
    try {

        // Parse detials
        const { tripId, expenseId, tripMateId } = req.params;

        // Handle if expenseId is not passed
        if (!tripId || !expenseId || !tripMateId) {
            return res.status(404).json({
                success: false,
                message: "Please send all the required params"
            })
        }

        // Check whether the tripMate is in trip
        const trip = await Trip.findOne({ _id: tripId, tripMates: tripMateId });

        // Check if trip exists
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found or trip mate not found in the trip"
            });
        }

        // Add tripMate to the Expense
        const expense = await Expense.findOne({ _id: expenseId, trip: tripId });

        // Check if expense exists
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // If expenseMate is present in Expense, remove expenseMate
        const expenseDetails = await Expense.findOneAndUpdate({ _id: expenseId, amountOwedBy: tripMateId }, {
            $pull: {
                amountOwedBy: tripMateId
            }
        }, { new: true });

        // Check if expense exists
        if (!expenseDetails) {
            return res.status(404).json({
                success: false,
                message: "Expense with expenseMate not found"
            });
        }

        // Pull Expense from expenseMate's paymentsToBePaid array
        await User.findByIdAndUpdate(tripMateId, {
            $pull: {
                paymentsToBePaid: expenseDetails._id
            }
        })

        const amountSpent = expenseDetails?.amountSpent;
        const amountOwedBy = expenseDetails?.amountOwedBy.length;

        const amountTobePaidByEachExpenseMate = amountSpent / (amountOwedBy + 1);

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            amountTobePaidByEachExpenseMate: amountTobePaidByEachExpenseMate
        }, { new: true })

        // Success flag
        return res.status(200).json({
            success: true,
            message: "ExpenseMate removed successfully",
            data: updatedExpense
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

export { createExpense, updateExpense, addExpenseMate, removeExpenseMate }
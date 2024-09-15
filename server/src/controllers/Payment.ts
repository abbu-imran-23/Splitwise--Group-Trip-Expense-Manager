import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import JWT from "jsonwebtoken";

interface RequestWithUser extends Request {
    user?: JWT.JwtPayload
}

const paymentSuccess = async (req: RequestWithUser, res: Response) => {
    try {
        // Parse Details
        const { userId, expenseId, paymentMethodId } = req.params;

        // Hnadle if userId or expenseId is not passed
        if (!userId || !expenseId || !paymentMethodId) {
            return res.status(404).json({
                success: false,
                message: "userId is missing in params"
            })
        }

        // Check if the logged-in user's ID matches the userId provided in the request parameters
        if (userId !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }

        // Check if the expense exist
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }

        // Check if the user has already paid
        const paidDetails = await Payment.findOne({
            expense: expenseId,
            paidBy: userId,
            paymentStatus: true
        })

        if (paidDetails) {
            return res.status(409).json({
                success: false,
                message: "Payment has already been made"
            })
        }

        // Create payment
        const payment = {
            expense: expenseId,
            paidBy: userId,
            paymentMethod: paymentMethodId,
            paymentStatus: true,
        }

        // Save payment in DB
        const savePayment = await Payment.create(payment);

        // Push the payment in the user's paymentHistory array
        await User.findByIdAndUpdate(userId, {
            $push: {
                paymentHistory: savePayment._id
            },
            $pull: {
                paymentsToBePaid: expenseId
            }
        })

        // Remove the user from amountOwedBy array of the expense
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            $pull: {
                amountOwedBy: userId
            }
        }, { new: true })

        // Everyone paid
        if (updatedExpense?.amountOwedBy.length === 0) {
            // Mark paidByAll true
            await Expense.findByIdAndUpdate(expenseId, {
                paidByAll: true
            });

            // Remove expense from expenseCreator's paymentsToBeRecieved array
            await User.findByIdAndUpdate(updatedExpense?.expenseCreater, {
                $pull: {
                    paymentsToBeRecieved: expenseId
                }
            })

        }

        // Push payment to the recipient's paymentHistory array
        await User.findByIdAndUpdate(expense.expenseCreater, {
            $push: {
                paymentHistory: savePayment._id
            }
        })

        // Return success flag
        return res.status(200).json({
            success: true,
            message: "Payment made and updated successfully"
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

export default paymentSuccess;
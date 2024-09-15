import { Request, Response } from "express";
import { PaymentMethod } from "../models/PaymentMethods"
import { User } from "../models/User";

// Add Payment Method
const addPaymentMethod = async (req: Request, res: Response) => {
    try {
        // Parse userId from req params
        const { userId } = req.params;

        // Parse payment methods
        const { paymentName, paymentNumber } = req.body;

        // Handle if any field is not entered 
        if (!paymentName || !paymentNumber) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Handle if the payment details already exist
        const paymentDetails = await PaymentMethod.findOne({ paymentName, paymentNumber });

        if (paymentDetails) {
            return res.status(409).json({
                success: false,
                message: "Payment Method already exist"
            })
        }

        // Create Payment Method
        const payment = await PaymentMethod.create({
            paymentName,
            paymentNumber
        })

        // Push paymentMethod to the user's acceptedPaymentMethods array
        await User.findByIdAndUpdate(userId, {
            $push: {
                acceptedPaymentMethods: payment
            }
        })

        // Success flag
        return res.status(200).json({
            success: true,
            message: "Payment Method added successfully",
            data: payment
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

// Update Payment Method
const updatePaymentMethod = async (req: Request, res: Response) => {
    try {
        // Parse paymentMethodId
        const { paymentMethodId } = req.params;

        // Parse payment methods
        const { paymentName, paymentNumber } = req.body;

        // Handle if any field is not entered 
        if (!paymentName || !paymentNumber) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Handle if the payment details already exist
        const paymentDetails = await PaymentMethod.findById(paymentMethodId);

        if (!paymentDetails) {
            return res.status(404).json({
                success: false,
                message: "Payment Method doesnot exist"
            })
        }

        // Create Payment Method
        const payment = await PaymentMethod.findByIdAndUpdate(paymentMethodId, {
            paymentName,
            paymentNumber
        }, { new: true })

        // Success flag
        return res.status(200).json({
            success: true,
            message: "Payment Method updated successfully",
            data: payment
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

// Delete Payment Method
const deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        // Parse userId from req params
        const { userId } = req.params;

        // Handle if userId is not passed
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "userId is missing in params"
            })
        }

        // Parse payment methods
        const { paymentName, paymentNumber } = req.body;

        // Handle if any field is not entered 
        if (!paymentName || !paymentNumber) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }

        // Handle if the payment details doesnot exist
        const paymentDetails = await PaymentMethod.findOne({ paymentName });

        if (!paymentDetails) {
            return res.status(404).json({
                success: false,
                message: "Payment Method doesnot exist"
            })
        }

        // Pull the paymentMethod from user's acceptedPaymentMethods
        await User.findByIdAndUpdate(userId, {
            $pull: {
                acceptedPaymentMethods: paymentDetails._id
            }
        })

        // Create Payment Method
        await PaymentMethod.findOneAndDelete({ paymentName });

        // Success flag
        return res.status(200).json({
            success: true,
            message: "Payment Method deleted successfully",
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

export { addPaymentMethod, updatePaymentMethod, deletePaymentMethod }
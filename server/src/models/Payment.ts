import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Expense"
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        paymentDate: {
            type: Date,
            required: true,
            default: new Date()
        },
        paymentMethod: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "PaymentMethod"
        },
        paymentStatus: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
    {
        paymentName: {
            type: String,
            required: true
        },
        paymentNumber: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
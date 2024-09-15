import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
    {
        tripName: {
            type: String,
            required: true
        },
        tripCreater: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        tripMates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
            }
        ],
        tripExpenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Expense"
            }
        ]
    },
    {
        timestamps: true
    }
)

export const Trip = mongoose.model("Trip", TripSchema);
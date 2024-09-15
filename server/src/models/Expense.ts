import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Trip"
        },
        expenseName: {
            type: String,
            required: true,
        },
        expenseCreater: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        amountSpent: {
            type: Number,
            required: true
        },
        amountTobePaidByEachExpenseMate: {
            type: Number,
            required: true
        },
        amountOwedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
            }
        ],
        paidByAll: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Expense = mongoose.model("Expense", ExpenseSchema);
import { NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IJwtPayload, IUser } from "../interfaces/index";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new mongoose.Schema<IUser>(
    {
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String, // Cloudinary Url
            trim: true,
            default: null
        },
        trips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Trip"
            }
        ],
        acceptedPaymentMethods: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "PaymentMethod"
            }
        ],
        paymentsToBePaid: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Expense"
            },
        ],
        paymentsToBeRecieved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Expense"
            }
        ],
        paymentHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Payment"
            }
        ],
        refreshToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)

/****  Middlewares  ****/
UserSchema.pre("save", async function (next: NextFunction) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS));
    next();
})

/****  Methods  ****/
UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function (): string {
    const payload: IJwtPayload = {
        id: this._id,
        name: `${this.firstname} ${this.lastname}`,
        email: this.email
    }

    const token: string = JWT.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
    });

    return token;
}

UserSchema.methods.generateRefreshToken = function (): string {
    const payload: IJwtPayload = {
        id: this._id,
        name: `${this.firstname} ${this.lastname}`,
        email: this.email
    }

    const token: string = JWT.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
    });

    return token;
}

export const User = mongoose.model("User", UserSchema);
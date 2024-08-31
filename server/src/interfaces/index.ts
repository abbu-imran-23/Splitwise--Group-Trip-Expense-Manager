import mongoose, { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
    _id: string,
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar: string | null;
    trips: mongoose.Types.ObjectId[];
    acceptedPaymentMethods: mongoose.Types.ObjectId[];
    paymentsToBePaid: mongoose.Types.ObjectId[];
    paymentsToBeRecieved: mongoose.Types.ObjectId[];
    paymentHistory: mongoose.Types.ObjectId[];
    refreshToken: string | null;

    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}


export interface IJwtPayload {
    id: string;
    name: string,
    email: string,
}

export interface IRequestWithJwtPayload extends Request {
    user?: IJwtPayload
}
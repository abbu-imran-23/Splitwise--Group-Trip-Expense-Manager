import { StatusCodes } from "http-status-codes"
import { ApiError } from "./ApiError"
import { User } from "../models/User"
import { IUser } from "../interfaces";

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user: IUser | null = await User.findById(userId);
        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong while generating Access and Refresh Token")
    }
}

export { generateAccessAndRefreshToken }
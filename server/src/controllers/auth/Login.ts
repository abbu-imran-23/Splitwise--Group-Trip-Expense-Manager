// Imports
import { Request, Response } from "express"
import { User } from "../../models/User";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { generateAccessAndRefreshToken } from "../../utils/GenerateAccessAndRefreshToken";
import { IUser } from "../../interfaces";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/Constants";
import { ApiResponse } from "../../utils/ApiResponse";
import { redis } from "../../configs/redis";

/***   Login Controller  ***/

const login = asyncHandler(async (req: Request, res: Response) => {
    // Parse user details from request body
    const { email, password } = req.body;

    // Check if the user already exist with the provided email
    const user: (IUser | null) = await User.findOne({ email });

    // Handle if  the user does not exist
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Email not registered")
    }

    // Validate Password
    const isPasswordMatched: boolean = await user.isPasswordCorrect(password);

    // Handle if password is not matched
    if (!isPasswordMatched) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
    }

    // Generate Access and Refresh Tooken
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Update Access Token in Redis
    const accessTokenInRedis: string = await redis.set(`${user._id}:${ACCESS_TOKEN}`, accessToken, 'EX', 24 * 60 * 60);

    // Handle if Access Token not updated in Redis
    if (accessTokenInRedis !== "OK") {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user's access token in Redis");
    }

    // Update Refresh Token in Redis
    const refreshTokenInRedis: string = await redis.set(`${user._id}:${REFRESH_TOKEN}`, refreshToken, 'EX', 10 * 24 * 60 * 60);

    // Handle if Refresh Token not updated in Redis
    if (refreshTokenInRedis !== "OK") {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user's refresh token in Redis");
    }

    // Update Refresh Token in User
    const loggedInUser: (IUser | null) = await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true }).select("-password -refreshToken");

    // Handle if Refresh Token not updated in User
    if (!loggedInUser) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user's refresh token in DB");
    }

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true,
        path: "/"
    }

    // Get Access Token in Redis
    const accessTokenFromRedis: string = await redis.get(`${user._id}:${ACCESS_TOKEN}`);

    // Handle if Access Token could not get from Redis
    if (!accessTokenFromRedis) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user's access token in Redis");
    }

    // Get Refresh Token in Redis
    const refreshTokenFromRedis: string = await redis.get(`${user._id}:${REFRESH_TOKEN}`);

    // Handle if Refresh Token could not get from Redis
    if (!refreshTokenFromRedis) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get user's refresh token in Redis");
    }

    // Return Success Response and set cookies
    return res.status(StatusCodes.OK)
        .cookie(ACCESS_TOKEN, accessToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 12), ...options })
        .cookie(REFRESH_TOKEN, refreshToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), ...options })
        .json(
            new ApiResponse(StatusCodes.OK, { loggedInUser, accessToken, refreshToken }, "User Loggedin Successfully")
        );

})

export default login;
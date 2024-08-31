// Imports
import { Request, Response } from "express"
import asyncHandler from "../../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError";
import Jwt from "jsonwebtoken";
import { IJwtPayload, IUser } from "../../interfaces";
import { User } from "../../models/User";
import { generateAccessAndRefreshToken } from "../../utils/GenerateAccessAndRefreshToken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/Constants";
import { ApiResponse } from "../../utils/ApiResponse";
import { redis } from "../../configs/redis";

/***   Refresh Access Token Controller  ***/

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    // Parse Refresh Token
    const clientRefreshToken: string = req.cookies?.refreshToken || req.body.refreshToken;

    // Handle if token is not parsed
    if (!clientRefreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh Token is missing");
    }

    try {
        // Verify Token
        const decoded = Jwt.verify(clientRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET) as IJwtPayload;

        // Fetch User
        const user: IUser = await User.findById(decoded?.id);

        // Handle if user is not found
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh Token is invalid");
        }

        // Handle if client refresh token is not matching with server refresh token
        if (clientRefreshToken !== user?.refreshToken) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh Token is expired");
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
        const updatedUser: (IUser | null) = await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true }).select("-password -refreshToken");

        // Handle if Refresh Token not updated in User
        if (!updatedUser) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update user's refresh token");
        }

        // Cookie options
        const options = {
            httpOnly: true,
            secure: true
        }

        // Return Success Response
        return res.status(StatusCodes.OK)
            .cookie(ACCESS_TOKEN, accessToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 12), ...options })
            .cookie(REFRESH_TOKEN, refreshToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), ...options })
            .json(
                new ApiResponse(StatusCodes.OK, { updatedUser, accessToken, refreshToken }, "Refresh Token Updated Successfully")
            );
    } catch (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh Token is invalid", err);
    }
})

export default refreshAccessToken;
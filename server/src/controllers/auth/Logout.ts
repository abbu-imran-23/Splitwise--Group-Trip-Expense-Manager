// Imports
import { Response } from "express"
import { User } from "../../models/User";
import asyncHandler from "../../utils/asyncHandler";
import { IRequestWithJwtPayload, IUser } from "../../interfaces";
import { ApiError } from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/Constants";
import { ApiResponse } from "../../utils/ApiResponse";
import { redis } from "../../configs/redis";

const logout = asyncHandler(async (req: IRequestWithJwtPayload, res: Response) => {
    // Set refresh token null
    const logoutUser: IUser = await User.findByIdAndUpdate(req.user?.id, {
        $set: {
            refreshToken: null
        }
    }, { new: true });

    // Handle if refresh token not updated
    if (!logoutUser) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error while logging out user");
    }

    // Clear Tokens from Redis
    const removeAccessTokenFromRedis = await redis.del(`${logoutUser._id}:${ACCESS_TOKEN}`);
    const removeRefreshTokenFromRedis = await redis.del(`${logoutUser._id}:${REFRESH_TOKEN}`);

    // Handle if Token cannot be removed from Redis
    if (!removeAccessTokenFromRedis || !removeRefreshTokenFromRedis) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to remove access and refresh tokens from redis");
    }

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true
    }

    // Return Success Response and Clear Cookies from Client
    return res.status(StatusCodes.OK)
        .clearCookie(ACCESS_TOKEN, { expires: new Date(Date.now() + 1000 * 60 * 60 * 12), ...options })
        .clearCookie(REFRESH_TOKEN, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), ...options })
        .json(
            new ApiResponse(StatusCodes.OK, {}, "User Logged out Successfully")
        );
})

export default logout;
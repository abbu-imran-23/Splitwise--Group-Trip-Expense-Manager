// Imports
import { Response } from "express"
import asyncHandler from "../../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../utils/ApiResponse";
import { User } from "../../models/User";
import { IRequestWithJwtPayload, IUser } from "../../interfaces";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../configs/redis";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/Constants";

/***   Verify Access Token Controller  ***/

const getUserDetails = asyncHandler(async (req: IRequestWithJwtPayload, res: Response) => {

    // Fetch User
    const user: IUser = await User.findById(req.user.id).select("-password -refreshToken");

    // Handle if user is not found
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Return Success Response
    return res.status(StatusCodes.OK).json(
        new ApiResponse(StatusCodes.OK, user, "User Details fetched Successfully")
    )
})

const updateUserDetails = asyncHandler(async (req: IRequestWithJwtPayload, res: Response) => {

    // Fetch User
    const user: IUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password -refreshToken");

    // Handle if user is not found
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Return Success Response
    return res.status(StatusCodes.OK).json(
        new ApiResponse(StatusCodes.OK, user, "User Details updated Successfully")
    )
})

const deleteUser = asyncHandler(async (req: IRequestWithJwtPayload, res: Response) => {

    // Fetch User
    const user: IUser = await User.findById(req.user.id);

    // Handle if user is not found
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Clear Tokens from Redis
    const removeAccessTokenFromRedis = await redis.del(`${user._id}:${ACCESS_TOKEN}`);
    const removeRefreshTokenFromRedis = await redis.del(`${user._id}:${REFRESH_TOKEN}`);

    // Handle if Token cannot be removed from Redis
    if (!removeAccessTokenFromRedis || !removeRefreshTokenFromRedis) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to remove access and refresh tokens from redis");
    }

    // Delete User from DB
    await User.findByIdAndDelete(req.user.id);

    const isUserExist = await User.findById(req.user?.id);

    // Handle if the User is not deleted from DB
    if (isUserExist) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to deleted User from DB")
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
            new ApiResponse(StatusCodes.OK, {}, "User deleted Successfully")
        );

})

export { getUserDetails, updateUserDetails, deleteUser }
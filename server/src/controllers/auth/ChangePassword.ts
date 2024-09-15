// Imports
import { Response } from "express"
import asyncHandler from "../../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../utils/ApiResponse";
import { IRequestWithJwtPayload, IUser } from "../../interfaces";
import { User } from "../../models/User";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../configs/redis";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/Constants";

/***   Change Password Controller  ***/

const changePassword = asyncHandler(async (req: IRequestWithJwtPayload, res: Response) => {

    // Parse Passwords 
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Handle if newPassword is not matching with confirmPassword
    if (newPassword !== confirmPassword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "New password do not match with confirm password")
    }

    // Fetch User
    const user: IUser = await User.findById(req.user?.id);

    // Handle if user is not found
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Compare Passwords
    const isPasswordValidated = await user.isPasswordCorrect(currentPassword);

    // Handle if Password is not matching
    if (!isPasswordValidated) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Current Password is incorrect");
    }

    // Clear Tokens from Redis
    const removeAccessTokenFromRedis = await redis.del(`${user._id}:${ACCESS_TOKEN}`);
    const removeRefreshTokenFromRedis = await redis.del(`${user._id}:${REFRESH_TOKEN}`);

    // Handle if Token cannot be removed from Redis
    if (!removeAccessTokenFromRedis || !removeRefreshTokenFromRedis) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to remove access and refresh tokens from redis");
    }

    // Change the Password and Save
    user.password = newPassword;
    user.refreshToken = null;
    const updatedUser = await user.save({ validateBeforeSave: true });

    // Handle if the failed to update DB
    if (!updatedUser) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to Update Password in DB");
    }

    /// Cookie options
    const options = {
        httpOnly: true,
        secure: true
    }

    // Return Success Response and Clear Cookies from Client
    return res.status(StatusCodes.OK)
        .clearCookie(ACCESS_TOKEN, { expires: new Date(Date.now() + 1000 * 60 * 60 * 12), ...options })
        .clearCookie(REFRESH_TOKEN, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), ...options })
        .json(
            new ApiResponse(StatusCodes.OK, {}, "Password Changed Successfully")
        );
})

export default changePassword;
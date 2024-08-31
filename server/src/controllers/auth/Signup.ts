// Imports
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../../models/User";
import asyncHandler from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { IUser } from "../../interfaces";

/***   Signup Controller  ***/

const signup = asyncHandler(async (req: Request, res: Response) => {
    // Parse user details from request body
    const { firstname, lastname, email, password } = req.body;

    // Handle if the user is already registered
    const isExistingUser: (IUser | null) = await User.findOne({ email });
    if (isExistingUser) {
        throw new ApiError(StatusCodes.CONFLICT, "User already exist, Please sign in with different email id");
    }

    // Insert User to DB
    const user = await User.create({
        firstname,
        lastname,
        email,
        password
    })

    // Fetch the inserted User
    const createdUser: (IUser | null) = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Handle if the User is not created
    if (!createdUser) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong, while registering user")
    }

    // Return Success Response once created
    return res.status(StatusCodes.CREATED).json(
        new ApiResponse(StatusCodes.CREATED, createdUser, "User Created Successfully")
    )

})

export default signup;
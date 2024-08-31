// Imports
import { Request, Response } from "express"
import asyncHandler from "../../utils/asyncHandler";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../utils/ApiResponse";

/***   Verify Access Token Controller  ***/

const verifyAccessToken = asyncHandler(async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json(
        new ApiResponse(StatusCodes.OK, {}, "Access Token is valid")
    )
})

export default verifyAccessToken;
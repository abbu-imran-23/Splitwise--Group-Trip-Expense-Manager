// Imports
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

/***   Error Handler Middleware  ***/

const errorHandler = (err: ApiError, _: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        error: err.error || null
    });
};

export default errorHandler;

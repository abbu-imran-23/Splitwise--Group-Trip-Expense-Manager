// Imports
import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

/***   Schema Validation Middleware  ***/

const validate = (schema: ZodSchema) => async (req: Request, _: Response, next: NextFunction) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (err: any) {
        if (err instanceof ZodError) {
            const errorDetails = err.errors.map((error) => error.message).join(", ");
            next(new ApiError(StatusCodes.BAD_REQUEST, "Input Validation Error", errorDetails))
        } else {
            next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error while validating inputs"))
        }
    }
};

export default validate;

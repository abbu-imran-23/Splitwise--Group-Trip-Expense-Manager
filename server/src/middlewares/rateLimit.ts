// Imports
import { Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { IRequestWithJwtPayload } from "../interfaces";
import { redis } from "../configs/redis";

/***   Rate Limit Middleware  ***/

const MAX_ATTEMPTS = 3; // Maximum login attempts allowed
const BLOCK_TIME = 15 * 60; // Block time in seconds (15 minutes)

const validateRateLimit = asyncHandler(async (req: IRequestWithJwtPayload, _: Response, next: NextFunction) => {
    // Parse email
    const { email } = req.body;
    const key = `login_attempts:${email}`;

    // Check the current number of attempts
    const attempts = await redis.get(key);
    console.log("Attemps validate", attempts);

    if (attempts && parseInt(attempts) >= MAX_ATTEMPTS) {
        // User has exceeded the maximum number of attempts
        throw new ApiError(StatusCodes.TOO_MANY_REQUESTS, `Too many login attempts. Please try again after ${BLOCK_TIME / 60} minutes.`)
    }

    next();
})

const handleLoginAttempt = asyncHandler(async (req: IRequestWithJwtPayload, _: Response, next: NextFunction) => {
    // Parse email
    const { email } = req.body;
    const key = `login_attempts:${email}`;

    // Check the current number of attempts
    const attempts = await redis.incr(key);

    if (attempts === 1) {
        // Set the expiry time for the key if it's the first attempt
        await redis.expire(key, BLOCK_TIME);
    }

    next();
})

const resetLoginAttempt = asyncHandler(async (req: IRequestWithJwtPayload, _: Response, next: NextFunction) => {
    // Parse email
    const { email } = req.body;
    const key = `login_attempts:${email}`;

    // Check the current number of attempts
    const attempts = await redis.del(key);

    next();
})

export { validateRateLimit, handleLoginAttempt, resetLoginAttempt }
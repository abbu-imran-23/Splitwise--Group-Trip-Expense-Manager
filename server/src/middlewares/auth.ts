// Imports
import { Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import Jwt from "jsonwebtoken";
import { IJwtPayload, IRequestWithJwtPayload } from "../interfaces";
import { redis } from "../configs/redis";
import { ACCESS_TOKEN } from "../utils/Constants";

/***   Auth Middleware  ***/

const isAuthenticated = asyncHandler(async (req: IRequestWithJwtPayload, _: Response, next: NextFunction) => {
    // Parse Access Token
    const accessToken: string = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // Handle if token is not parsed
    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Access Token is missing");
    }

    try {
        // Verify Token
        const decoded = Jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as IJwtPayload;

        // Extract user ID from decoded token
        const userId = decoded.id;

        // Get Access Token in Redis
        const accessTokenFromRedis: string = await redis.get(`${userId}:${ACCESS_TOKEN}`);

        //* Ensures Single Session Enforcement
        // Check if the token from Redis matches the token provided in the request
        if ((accessToken !== accessTokenFromRedis) || !accessTokenFromRedis) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token from client doesnot match with Redis Access Token");
        }

        req.user = decoded;

    } catch (err) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Access Token is invalid", err);
    }

    next();
})

export default isAuthenticated;
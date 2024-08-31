import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
    public statusCode: number;
    public success: boolean;
    public error: any;
    public data: null;

    constructor(statusCode: StatusCodes, message: string, error?: any, stack: string = "") {
        super(message)
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }
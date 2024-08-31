import { StatusCodes } from "http-status-codes";

class ApiResponse {
    public statusCode: number;
    public data: any;
    public message: string;
    public success: boolean;

    constructor(statusCode: StatusCodes, data: any, message: string) {
        this.statusCode = statusCode;
        this.success = true;
        this.data = data;
        this.message = message;
    }
}

export { ApiResponse }
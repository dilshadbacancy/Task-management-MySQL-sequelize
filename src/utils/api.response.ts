import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export class ApiResponse {

    static success(res: Response, message: string | "Success", data: any, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data || null,
        });
    }



    static error(res: Response, error: any, statusCode: number = 500) {
        let message = "Something went wrong";
        let details: any = null;

        // ✅ Case 1: Sequelize-style validation error (errors array)
        if (error?.errors && Array.isArray(error.errors)) {
            const firstError = error.errors[0];
            message = firstError?.message || message;
            details = {
                message: firstError?.message,
                type: firstError?.type,
                field: firstError?.path,
                value: firstError?.value,
            };
        }
        // ✅ Case 2: Error object with message
        else if (error?.message) {
            message = error.message;
            details = {
                message: error.message,
                stack: error.stack || undefined,
            };
        }
        // ✅ Case 3: String error
        else if (typeof error === "string") {
            message = error;
            details = { message: error };
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errors: details,
        });
    }

}
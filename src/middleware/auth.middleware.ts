import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { config } from "../config/config";
import { userService } from "../service/user.service";
import { UtilsHelper } from "../utils/jwt.helper";
import { JWTPaylod } from "../types";
import User from "../models/user.modle";


export interface AuthRequest extends Request {
    user?: User
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: "Your are not authorises to access the apis, please authorised and try again."
            })
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid token formate  "
            })
            return;
        }

        const decoded = UtilsHelper.verifyAccessToken(token) as JWTPaylod;

        const user = await userService.getUserById(decoded.id.toString());

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Current user no longer exists."
            })
            return;

        }

        req.user = user;
        next();
    } catch (error: any) {
        if (error.name == "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
            return;
        }
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message,
        });
    }
}
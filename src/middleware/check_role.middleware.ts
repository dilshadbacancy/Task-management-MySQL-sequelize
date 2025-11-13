import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";


const checkRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    const role = req.user?.role;
    if (!role || role.toLowerCase() !== "admin") {
        res.status(401).json({
            status: false,
            message: "You are not authorized. Please request admin to allow you.",
        })
        return;
    }

    next();
}
export default checkRole;
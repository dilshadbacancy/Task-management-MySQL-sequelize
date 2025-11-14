import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

export const openRoouteMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers.authorization;

    const openRouteKey = config.keys.open_route_key;

    if (openRouteKey !== authorization) {
        res.status(401).json({
            status: false,
            message: "Athorization x-token is required."
        })
        return;
    }
    next();


}


import jwt from "jsonwebtoken";
import { JWTPaylod } from "../types";
import { config } from "../config/config";

export class UtilsHelper {
    static generateAccessToken(payload: JWTPaylod): string {
        return jwt.sign(
            {
                id: payload.id,
                email: payload.email,
                role: payload.role
            },
            config.keys.secret_jwt_key!,
            {
                expiresIn: "1d"
            }
        )
    }

    static verifyAccessToken(token: string): JWTPaylod {

        return jwt.verify(token, config.keys.secret_jwt_key!) as JWTPaylod;
    }
}
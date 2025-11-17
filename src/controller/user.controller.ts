import express, { Request, Response } from 'express'
import { userService } from '../service/user.service';
import { ChangePasswordDto, UserDto } from '../dtos/user.dto';
import { JWTPaylod } from '../types';
import { UtilsHelper } from '../utils/jwt.helper';
import { ApiResponse } from '../utils/api.response';
import e from 'express';
import { AuthRequest, blackListToken } from '../middleware/auth.middleware';

class UserController {

    async createUser(req: Request, res: Response): Promise<void> {
        const userDto: UserDto = req.body;
        await userService.createUser(userDto).then((value) => {
            const payload: JWTPaylod = value;
            const token = UtilsHelper.generateAccessToken(payload);
            return ApiResponse.success(res, "User created successfully", { ...value.toJSON(), token })
        }).catch((error) => {
            return ApiResponse.error(res, error, 401)
        })
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        const { remaining, limit } = req.rateLimit;
        if (!req.body.email) {
            ApiResponse.error(
                res,
                {
                    message: "Password is required.",
                    attemptsLeft: remaining,
                    attemptsUsed: limit - remaining,

                })
            return;
        };

        if (!req.body.password) {
            ApiResponse.error(
                res,
                {
                    message: "Password is required.",
                    attemptsLeft: remaining,
                    attemptsUsed: limit - remaining,
                })
            return;
        };

        const dto: UserDto = req.body;
        await userService.loginUser(dto).then(async (value) => {
            if (!value) {
                res.status(401).json({
                    message: "User not found.",
                    attemptsLeft: remaining,
                    attemptsUsed: limit - remaining,
                });
                return;
            }
            const isValidPassword = await value.comparePassword(dto.password);
            if (!isValidPassword) {
                res.status(401).json({
                    message: "Password is not matcheddd.",
                    attemptsLeft: remaining,
                    attemptsUsed: limit - remaining,
                });
                return;
            }
            const payload: JWTPaylod = value;
            const token = UtilsHelper.generateAccessToken(payload)
            ApiResponse.success(res, "Login success", { ...value.toJSON(), token })

        }).catch((error) => {
            ApiResponse.error(res, error);
        })
    }


    async logoutUser(req: AuthRequest, res: Response): Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            blackListToken(token);
        }
        ApiResponse.success(res, "Logout successfully.", "Token is blacklisted");
    }

    async uploadFile(req: AuthRequest, res: Response): Promise<void> {

        if (!req.file) {
            ApiResponse.error(res, "File is required")
            return;
        };
        const id = req.user?.id;

        const saved = await userService.uploadFile(req.file, id!);
        if (!saved) {
            ApiResponse.error(res, "Failed to upload");
        }
        ApiResponse.success(res, "File uploaded", saved);
    }

    async getFile(req: AuthRequest, res: Response): Promise<void> {
        await userService.getFile(req.user!.id).then((value) => {
            if (!value) {
                ApiResponse.error(res, "File not found");
                return;
            }

            res.end(value)
        }).catch((error) => {
            ApiResponse.error(res, error);
        })
    }

    async deleteAllUser(req: Request, res: Response): Promise<void> {
        await userService.deleteAllUsers().then((value) => {
            return ApiResponse.success(res, "All Users deleted successfullly.", `${value} record deleted`);
        }).catch((error) => {
            return ApiResponse.error(res, error, 201);
        })
    }
    async findAllUsers(req: Request, res: Response): Promise<void> {
        await userService.getAllUsers()
            .then((value) => {
                ApiResponse.success(res, "Fethed all the users.", value)
            }).catch((error) => {
                ApiResponse.error(res, error);
            })
    }

    async findUserById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await userService.getUserById(id)
            .then((value) => {
                if (!value) {
                    ApiResponse.error(res, "User doesnot exist with the id", 201)
                }
                ApiResponse.success(res, "Fetched user successfully,", value);
            }).catch((error) => {
                ApiResponse.error(res, error);
            })
    }

    async deleteUserById(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await userService.deleteUserById(id)
            .then((value) => {
                if (!value) return ApiResponse.error(res, "No user exist ");
                ApiResponse.success(res, "User deleted successfully.", value)
            }).catch((error) => {
                ApiResponse.error(res, e);
            })
    }

    async updateUser(req: AuthRequest, res: Response): Promise<void> {

        if (!req.body) {
            ApiResponse.error(res, "Field are required to update the user")
        }
        const body: UserDto = req.body;
        const id = req.user!.id.toString();

        await userService.updateUser(body, id)
            .then((value) => {
                if (!value) return ApiResponse.error(res, "User does not found!");
                ApiResponse.success(res, "User Updated successfully", value)
            }).catch((error) => {
                ApiResponse.error(res, error);
            })
    }

    async changePassword(req: AuthRequest, res: Response): Promise<void> {
        const body: ChangePasswordDto = req.body;
        const id = req.user!.id.toString();
        if (!body.password) {
            ApiResponse.error(res, "Current password is required");
            return;
        }

        if (!body.newPassword) {
            ApiResponse.error(res, "New Password is required");
            return;
        }

        if (body.newPassword.length < 4) {
            ApiResponse.error(res, "password must be in between 4 to 6 charchter.")
            return;
        }

        if (!body.confirmPassword) {
            ApiResponse.error(res, "Confirm Password is required");
        }
        if (!body.confirmPassword.match(body.newPassword)) {
            ApiResponse.error(res, "Password does not match.")
        }

        await userService.changePassword(body, id)
            .then((value) => {
                if (!value) return ApiResponse.error(res, "Yet to implement change password functionality. ");
                ApiResponse.success(res, "Password changed successfully", value);
            }).catch((error) => {
                ApiResponse.error(res, error);
            })
    }

}

export const userController = new UserController();
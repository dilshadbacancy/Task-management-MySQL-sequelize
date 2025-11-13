import express, { Request, Response } from 'express'
import { userService } from '../service/user.service';
import { ChangePasswordDto, UserDto } from '../dtos/user.dto';
import { JWTPaylod } from '../types';
import { UtilsHelper } from '../utils/jwt.helper';
import { ApiResponse } from '../utils/api.response';
import e from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

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

        if (!req.body.email) {
            ApiResponse.error(res, "Email is required")
            return;
        };

        if (!req.body.password) {
            ApiResponse.error(res, "Passowrd is required")
            return;
        };

        const dto: UserDto = req.body;
        await userService.loginUser(dto).then(async (value) => {
            if (!value) return ApiResponse.error(res, "User not found")
            const isValidPassword = await value.comparePassword(dto.password);
            if (!isValidPassword) return ApiResponse.error(res, "Password doesnot match");
            const payload: JWTPaylod = value;
            const token = UtilsHelper.generateAccessToken(payload)
            ApiResponse.success(res, "Login success", { ...value.toJSON(), token })

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
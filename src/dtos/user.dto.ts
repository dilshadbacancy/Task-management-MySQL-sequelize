import { UserRole } from "../types";

export interface UserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole
}

export interface ChangePasswordDto {
    password: string,
    newPassword: string,
    confirmPassword: string;
}
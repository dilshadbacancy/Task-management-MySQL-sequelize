import bcrypt from 'bcryptjs';
import { ChangePasswordDto, UserDto } from "../dtos/user.dto";
import User from "../models/user.modle";
import { UserRole, JWTPaylod } from "../types";
import { FileService } from '../utils/file.utils';
import fs from 'fs';

class UserService {

    async createUser(data: UserDto): Promise<User> {

        const existingUser = await User.findOne({ where: { email: data.email } });

        if (existingUser) {
            throw new Error("User already exist with the same email.")
        }

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role || UserRole.USER
        })


        return user;
    }

    async loginUser(data: UserDto): Promise<User | null> {
        return await User.findOne({ where: { email: data.email } });
    }

    async deleteAllUsers(): Promise<number> {
        const users = await User.destroy({ where: {} });
        return users
    }

    async updateUser(data: UserDto, id: string): Promise<User | null> {
        const user = await User.findByPk(id);
        if (user === null) return null;
        user.email = data.email;
        user.name = data.name;
        user.save();
        return user;
    }

    async uploadFile(file: Express.Multer.File, userId: number): Promise<any> {
        const result = FileService.saveToLocalByUser(file, userId);
        return result;

    }



    async getFile(userId: number,): Promise<any> {
        const stream = FileService.getUserFirstFileBuffer(userId);
        return stream;
    }

    async getAllUsers(): Promise<User[]> {
        const user = await User.findAll();
        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await User.findByPk(id)

        return user;
    }

    async deleteUserById(id: string): Promise<User | null> {
        const user = await this.getUserById(id);
        user?.destroy();
        return user;
    }

    async changePassword(data: ChangePasswordDto, id: string): Promise<User | null> {
        return null;
        // const user = await User.findByPk(id);
        // if (!user) return null;
        // const isValidPassword = await user.comparePassword(data.password);
        // if (!isValidPassword) {
        //     throw Error("Current Password does not match")
        // }
        // const salt = await bcrypt.genSalt(10);
        // const hashedPASSWORD = await bcrypt.hash(user.password, salt);
        // user.password = hashedPASSWORD;
        // // user.changed();
        // await user.save();
        // return user;

    }

}

export const userService = new UserService();
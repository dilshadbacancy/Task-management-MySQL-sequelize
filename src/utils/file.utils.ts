


import fs from "fs";
import path from "path";

export class FileService {
    static saveToLocalByUser(file: Express.Multer.File, userId: number) {

        // Create user-specific folder
        const uploadDir = path.join(__dirname, "../../uploads", userId.toString());

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // unique filename
        const ext = file.originalname.split(".");
        const fileName = `${userId}.${ext[ext.length - 1]}`;
        const filePath = path.join(uploadDir, fileName);

        // write file buffer to disk
        fs.writeFileSync(filePath, file.buffer);

        return {
            fileName,
            filePath,
            folder: uploadDir,
        };
    }


    static getUserFirstFileBuffer(userId: number): any {
        const folderPath = path.join(process.cwd(), "uploads", String(userId));

        if (!fs.existsSync(folderPath)) {
            throw new Error("User folder not found");
        }

        const files = fs.readdirSync(folderPath);

        if (files.length === 0) {
            throw new Error("No files found for this user");
        }

        const fileName = files[0]; // <-- the first file
        const filePath = path.join(folderPath, fileName);
        const fileBuffer = fs.readFileSync(filePath); // returns Buffer
        const base64String = fileBuffer.toString("base64");
        return fileBuffer
    }
}

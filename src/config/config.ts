import dotenv from "dotenv";

dotenv.config();



interface Config {
    server: {
        port: string;
        environment: string;

    }
    database: {
        db_host: string;
        db_user: string;
        db_password: string;
        db_name: string;
        db_port: string;
    }
    keys: {
        secret_jwt_key: string,
    }
}

function validateConfig() {
    if (!process.env.DB_PASSWORD) {
        throw new Error("Database password not found");
    }
    if (!process.env.DB_NAME) {
        throw new Error("Database name not found")
    }
    if (!process.env.DB_USER) {
        throw new Error("Database user not found")
    }
    return {
        server: {
            port: process.env.PORT,
            environment: process.env.NODE_ENV
        },
        database: {
            db_host: process.env.DB_HOST,
            db_user: process.env.DB_USER,
            db_password: process.env.DB_PASSWORD,
            db_name: process.env.DB_NAME,
            db_port: process.env.DB_PORT,
        },
        keys: {
            secret_jwt_key: process.env.JWT_SECRET,
        }
    }
}

export const config = validateConfig();
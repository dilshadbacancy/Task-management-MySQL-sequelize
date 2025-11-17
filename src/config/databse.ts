

import { Sequelize } from "sequelize";
import { config } from "./config";

export class SequelizeConnection {
    private static instance: Sequelize;

    private constructor() { }

    static connectionUrl = 'mysql://root:eQtpXTkArIgODIOuhvcIeCjSDnCSsrHo@switchyard.proxy.rlwy.net:12296/railway';

    public static getInstance(): Sequelize {
        if (!SequelizeConnection.instance) {

            console.log(config);


            // SequelizeConnection.instance = new Sequelize(SequelizeConnection.connectionUrl)


            SequelizeConnection.instance = new Sequelize(
                config.database.db_name,
                config.database.db_user,
                config.database.db_password,
                {
                    host: config.database.db_host,
                    dialect: "mysql",
                    logging: console.log,
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    }
                }
            )
        }
        return SequelizeConnection.instance;
    }

}
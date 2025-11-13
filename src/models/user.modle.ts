import { DataTypes, Model, Optional } from "sequelize";
import { UserAttributes, UserRole } from "../types";
import bcrypt from 'bcryptjs';
import { SequelizeConnection } from "../config/databse";


const sequelize = SequelizeConnection.getInstance();

class User extends Model implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: UserRole;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(userPassword: string): Promise<boolean> {
        return await bcrypt.compare(userPassword, this.password);
    }

    public toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    msg: 'Name is required',
                },
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Email is not valid',
                },
                notEmpty: {
                    msg: "Email cannnot be empty."
                },

                notNull: {
                    msg: 'Email is required',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Password cannot be empty",
                },
                len: {
                    args: [4, 8],
                    msg: "Password must be between 4 and 8 characters",
                },
            },
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            defaultValue: UserRole.USER,
            allowNull: false,
            set(value: string) {
                this.setDataValue("role", value.toLowerCase());
            },
            validate: {
                isIn: {
                    args: [["admin", "employee", "user"]],
                    msg: "Role must be one of: admin, employee, user",
                },
            }
        },
    },
    {
        sequelize, // ✅ required: the connection instance
        modelName: "User",
        tableName: "users",
        timestamps: true,
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            // Before updating user, hash the password if changed
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        }
    }
)

export default User;
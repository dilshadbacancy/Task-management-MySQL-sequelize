import { DataTypes, Model } from "sequelize";
import { TaskStatus, TodoAttributes } from "../types";
import { SequelizeConnection } from "../config/databse";



const sequelize = SequelizeConnection.getInstance();

class Todo extends Model<TodoAttributes> implements TodoAttributes {
    public id!: string;
    public title!: string;
    public description!: string;
    public status!: TaskStatus;
    public creator!: string;
    public assignee!: string | null;
    public assigner!: string | null;

    public toJSON() {
        const values = { ...this.get() }

        delete values.assignee;
        delete values.assigner;
        delete values.creator;
        return values;
    }
}

Todo.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Title is required" },
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Description is required" },
            },
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
            allowNull: false,
            defaultValue: TaskStatus.IN_PROGRESS,
        },
        creator: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        assignee: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            defaultValue: null,
        },
        assigner: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            defaultValue: null,
        },
    },
    {
        sequelize,
        modelName: "Todo",
        tableName: "todos",
        timestamps: true,
    }
);


Todo.beforeCreate((todo: Todo) => {
    if (!todo.assigner) {
        todo.assigner = todo.creator;
    }
    if (!todo.assignee) {
        todo.assignee = todo.creator;
    }
});


export default Todo
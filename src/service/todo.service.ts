import { CreateTodoDTO } from "../dtos/todo.dto";
import Todo from "../models/todo.model";
import User from "../models/user.modle";

class TodoService {
    async createTodo(data: CreateTodoDTO, id: number): Promise<Todo> {
        const existingTodo = await Todo.findOne({ where: { title: data.title.trim() } })
        if (existingTodo) {
            throw Error("Task is with the same title is already exist")
        }
        return await Todo.create({
            title: data.title.trim(),
            description: data.description.trim(),
            status: data.status,
            creator: id.toString()
        })
    }

    async getAllTodos(userId: number, completed?: string, assigned?: boolean,
        query?: { page: number; limit: number; offset: number; }): Promise<{
            rows: Todo[];
            count: number;
        }> {

        let where: any = {}
        if (assigned && completed !== undefined) {
            where.assignee = userId;
            where.status = completed;
            where.creator = userId;
        } else if (completed) {
            where.status = completed;
            where.creator = userId;
        } else if (assigned) {
            where.assignee = userId;
            // where.creator = userId;
        } else {

            where.creator = userId;
        }

        const todos = await Todo.findAndCountAll({
            where,
            include: [
                { model: User, as: "createdByUser", attributes: ["id", "name", "email"] },
                { model: User, as: "assignedByUser", attributes: ["id", "name", "email"] },
                { model: User, as: "assignToUser", attributes: ["id", "name", "email"] },
            ],
            order: [["createdAt", "ASC"]],
            limit: query?.limit,
            offset: query?.offset,
        });
        return todos;
    }

    async assignTodo(assignee: string, todoId: number): Promise<Todo> {
        const todo = await Todo.findByPk(todoId);
        if (!todo) throw Error("No todo assicated with the given id");
        todo!.assignee = assignee;
        todo.save();
        return todo;
    }
}


export const todoService = new TodoService();
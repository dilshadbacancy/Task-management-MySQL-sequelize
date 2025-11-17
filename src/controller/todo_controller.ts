import { Request, Response } from "express";
import { todoService } from "../service/todo.service";
import { CreateTodoDTO } from "../dtos/todo.dto";
import { AuthRequest } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/api.response";
import { error } from "console";
import { getPagination } from "../utils/pagination";
import { getMetaData } from "../utils/metadata";

class TodoController {

    async createTodo(req: AuthRequest, res: Response): Promise<void> {
        const body: CreateTodoDTO = req.body;
        const id = req.user!.id;
        await todoService.createTodo(body, id).then((value) => {
            if (!value) ApiResponse.error(res, "Failed to create task");
            ApiResponse.success(res, "Task created successfully", value);
        }).catch((error) => {
            ApiResponse.error(res, error);
        });
    }

    async getAllTodos(req: AuthRequest, res: Response): Promise<void> {
        const status = req.query.status as string || undefined;
        const assigned = req.query.is_assigned === 'true';
        const id = req.user!.id;

        const query = getPagination(req.query);
        return todoService.getAllTodos(id, status, assigned, query)
            .then((value) => {



                ApiResponse.success(res, "Todos fetched successfully.", value, getMetaData(value, query));
            })
            .catch((error) => {
                ApiResponse.error(res, error);
            })
    }

    async assignTodo(req: AuthRequest, res: Response): Promise<void> {
        const { todoId, assignee } = req.body;
        await todoService.assignTodo(assignee, todoId)
            .then((value) => {
                ApiResponse.success(res, "Task Assigned", value);
            }).catch((error) => {
                ApiResponse.error(res, error)
            });
    }
}

export const todoController = new TodoController();
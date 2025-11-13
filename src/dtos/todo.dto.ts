import { TaskStatus, TodoAttributes } from "../types";

export interface CreateTodoDTO {
    title: string;
    description: string;
    status: TaskStatus;
    createdBy: number;
    assingedTo: number;

}
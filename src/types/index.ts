export enum UserRole {
    ADMIN = "admin",
    EMPLOUEE = "employee",
    USER = "user"
}

export enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    IN_PROGRESS = 'in-progress'
}


export interface UserAttributes {
    id: number,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date,
}

export interface TodoAttributes {
    id?: string;
    title?: string;
    description: string;
    status: TaskStatus;
    creator?: string | null;
    assignee?: string | null;
    assigner?: string | null;
}


export interface JWTPaylod {
    id: number,
    email: string,
    role: string,
}
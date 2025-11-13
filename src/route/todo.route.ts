
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { todoController } from "../controller/todo_controller";
import checkRole from "../middleware/check_role.middleware";

const router = Router();


router.use(authMiddleware)

router.get('/all-task', todoController.getAllTodos.bind(todoController))

router.use(checkRole);
router.post('/create-task', todoController.createTodo.bind(todoController));
router.post('/assign-task', todoController.assignTodo.bind(todoController));

export default router;
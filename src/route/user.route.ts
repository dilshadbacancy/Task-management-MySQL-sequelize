import { Router } from "express";
import { userController } from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();


router.post("/create-user", userController.createUser.bind(userController));
router.post('/login-user', userController.loginUser.bind(userController));

router.use(authMiddleware)
router.delete("/delete-all-users", userController.deleteAllUser.bind(userController));
router.get('/get-all-users', userController.findAllUsers.bind(userController));
router.get('/get-user/:id', userController.findUserById.bind(userController))
router.delete('/delete-user/:id', userController.deleteUserById.bind(userController));
router.post('/update-user', userController.updateUser.bind(userController));
router.post('/update-password', userController.changePassword.bind(userController));

export default router;
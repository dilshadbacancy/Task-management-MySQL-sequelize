import { Router } from "express";
import { userController } from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { openRoouteMiddleware } from "../middleware/open_route.middleware";
import { authLimitter } from "../middleware/auth_limitter.middleware";
import { upload } from "../middleware/multer.middleware";



const router = Router();



router.post("/create-user", openRoouteMiddleware, userController.createUser.bind(userController));
router.post('/login-user', authLimitter, openRoouteMiddleware, userController.loginUser.bind(userController));

router.use(authMiddleware)
router.delete("/delete-all-users", userController.deleteAllUser.bind(userController));
router.get('/get-all-users', userController.findAllUsers.bind(userController));
router.get('/get-user/:id', userController.findUserById.bind(userController))
router.delete('/delete-user/:id', userController.deleteUserById.bind(userController));
router.post('/update-user', userController.updateUser.bind(userController));
router.post('/update-password', userController.changePassword.bind(userController));
router.post('/logout', userController.logoutUser.bind(userController))
router.post('/upload', upload.single('file'), userController.uploadFile.bind(userController))
router.get('/get-file', userController.getFile.bind(userController))

export default router;
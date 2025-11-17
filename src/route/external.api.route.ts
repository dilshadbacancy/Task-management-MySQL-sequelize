import { Router } from "express";
import { externlApiController } from "../controller/external.api.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();;



router.use(authMiddleware)
router.get("/get-posts", externlApiController.fetchPosts.bind(externlApiController));


export default router;
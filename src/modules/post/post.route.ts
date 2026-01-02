import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.post("/", auth(UserRole.USER), postController.createPost);
router.get("/", postController.getAllPost);

export const postRouter = router;

import { Router } from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/", postController.getAllPost);
router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts);
router.get("/:postId", postController.getPostById);
router.post("/", auth(UserRole.USER), postController.createPost);

export const postRouter = router;

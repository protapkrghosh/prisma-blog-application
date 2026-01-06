import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

router.post(
   "/",
   auth(UserRole.ADMIN, UserRole.USER),
   commentController.createComment
);

export const commentRouter = router;

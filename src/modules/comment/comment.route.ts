import { Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthor);
router.get("/:commentId", commentController.getCommentById);

router.post(
   "/",
   auth(UserRole.USER, UserRole.ADMIN),
   commentController.createComment
);

router.patch(
   "/:commentId",
   auth(UserRole.USER, UserRole.ADMIN),
   commentController.updateComment
);

router.patch(
   "/:commentId/moderate",
   auth(UserRole.ADMIN),
   commentController.moderateComment
);

router.delete(
   "/:commentId",
   auth(UserRole.USER, UserRole.ADMIN),
   commentController.deleteComment
);

export const commentRouter = router;

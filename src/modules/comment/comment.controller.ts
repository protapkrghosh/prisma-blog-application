import type { NextFunction, Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const user = req.user;
      req.body.authorId = user?.id;

      const result = await commentService.createComment(req.body);
      res.status(201).json(result);
   } catch (error) {
      next(error);
   }
};

const getCommentById = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { commentId } = req.params;
      const result = await commentService.getCommentById(commentId as string);
      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

const getCommentByAuthor = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { authorId } = req.params;
      const result = await commentService.getCommentByAuthor(
         authorId as string
      );
      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

const updateComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const user = req.user;
      const { commentId } = req.params;
      const result = await commentService.updateComment(
         commentId as string,
         req.body,
         user?.id as string
      );
      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

const moderateComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const { commentId } = req.params;
      const result = await commentService.moderateComment(
         commentId as string,
         req.body
      );
      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

const deleteComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const user = req.user;
      const { commentId } = req.params;

      const result = await commentService.deleteComment(
         commentId as string,
         user?.id as string
      );
      res.status(200).json(result);
   } catch (error) {
      next(error)
   }
};

export const commentController = {
   createComment,
   getCommentById,
   getCommentByAuthor,
   updateComment,
   moderateComment,
   deleteComment,
};

import type { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
   try {
      const user = req.user;
      req.body.authorId = user?.id;

      const result = await commentService.createComment(req.body);
      res.status(201).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Comment creation failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const getCommentById = async (req: Request, res: Response) => {
   try {
      const { commentId } = req.params;
      const result = await commentService.getCommentById(commentId as string);
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Comment fetched failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const getCommentByAuthor = async (req: Request, res: Response) => {
   try {
      const { authorId } = req.params;
      const result = await commentService.getCommentByAuthor(
         authorId as string
      );
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Comment fetched failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const updateComment = async (req: Request, res: Response) => {
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
      const errorMessage =
         error instanceof Error ? error.message : "Comment update failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const moderateComment = async (req: Request, res: Response) => {
   try {
      const { commentId } = req.params;
      const result = await commentService.moderateComment(
         commentId as string,
         req.body
      );
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Comment moderate failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const deleteComment = async (req: Request, res: Response) => {
   try {
      const user = req.user;
      const { commentId } = req.params;

      const result = await commentService.deleteComment(
         commentId as string,
         user?.id as string
      );
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Comment delete failed";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
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

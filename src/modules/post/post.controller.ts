import type { Request, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
   try {
      if (!req.user) {
         return res.status(400).json({
            error: "Unauthorized",
         });
      }

      const result = await postService.createPost(req.body, req.user.id);
      res.status(201).json(result);
   } catch (error) {
      res.status(400).json({
         error: "Post creation failed",
         details: error,
      });
   }
};

const getAllPost = async (req: Request, res: Response) => {
   try {
      // Filtering
      const { search } = req.query;
      const searchString = typeof search === "string" ? search : undefined;

      const tags = req.query.tag ? (req.query.tag as string).split(",") : [];

      // True or False
      const isFeatured = req.query.isFeatured
         ? req.query.isFeatured === "true"
            ? true
            : req.query.isFeatured === "false"
            ? false
            : undefined
         : undefined;

      const status = req.query.status as PostStatus | undefined;
      const authorId = req.query.authorId as string | undefined;

      // Page Pagination
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const skip = (page - 1) * limit;

      // Sorting order
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as string | undefined;

      const result = await postService.getAllPost({
         search: searchString,
         tags,
         isFeatured,
         status,
         authorId,
         page,
         limit,
         skip,
         sortBy,
         sortOrder,
      });
      res.status(200).json(result);
   } catch (error) {
      res.status(404).json({
         error: "Post not found",
         details: error,
      });
   }
};

export const postController = {
   createPost,
   getAllPost,
};

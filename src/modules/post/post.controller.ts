import type { Request, Response } from "express";
import { postService } from "./post.service";
import type { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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
      const errorMessage =
         error instanceof Error ? error.message : "Post creation failed";
      res.status(400).json({
         error: errorMessage,
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

      // Page pagination and sorting helper function
      const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
         req.query
      );

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
      const errorMessage =
         error instanceof Error ? error.message : "Post not found!";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const getPostById = async (req: Request, res: Response) => {
   try {
      const { postId } = req.params;

      if (!postId) {
         throw new Error("Post Id is required!");
      }

      const result = await postService.getPostById(postId);
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Post not found!";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

const getMyPosts = async (req: Request, res: Response) => {
   try {
      const user = req.user;
      if (!user) throw new Error("You are unauthorized!");

      const result = await postService.getMyPosts(user.id);
      res.status(200).json(result);
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : "Your post not found!";
      res.status(400).json({
         error: errorMessage,
         details: error,
      });
   }
};

export const postController = {
   createPost,
   getAllPost,
   getPostById,
   getMyPosts,
};

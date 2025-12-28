import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
   try {
      const result = await postService.createPost(req.body);
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
      const result = await postService.getAllPost();
      res.status(200).json(result);
   } catch (error) {
      res.status(404).json({
         details: error,
      });
   }
};

export const postController = {
   createPost,
   getAllPost,
};

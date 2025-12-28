import express, { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.post("/", postController.createPost);
router.get("/", postController.getAllPost);

export const postRouter = router;

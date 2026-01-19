import { auth } from "./lib/auth";
import express, { type Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { commentRouter } from "./modules/comment/comment.route";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app: Application = express();

app.use(
   cors({
      origin: process.env.APP_URL || "http://localhost:3000",
      credentials: true,
   })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res) => {
   res.send("Welcome To Blog Application");
});

app.use(notFound);
app.use(errorHandler); // Global Error Handling

export default app;

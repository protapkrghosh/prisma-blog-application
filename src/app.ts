import { auth } from "./lib/auth";
import express, { type Application } from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(
   cors({
      origin: process.env.APP_URL || "http://localhost:4000",
      credentials: true,
   })
);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
   res.send("Welcome To Blog Application");
});

export default app;

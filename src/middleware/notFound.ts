import type { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
   res.status(404).json({
      message: "Route no found",
      path: req.originalUrl,
      date: Date(),
   });
}

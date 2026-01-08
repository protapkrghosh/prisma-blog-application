import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) {
   let statusCode = 500;
   let errorMessage = "Internal Server Error";
   let errorDetails = err;

   // PrismaClientKnownRequestError
   if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
         statusCode = 400;
         errorMessage =
            "An operation failed because it depends on one or more records that were required but not found.";
      } else if (err.code === "P2002") {
         statusCode = 400;
         errorMessage = "Unique constraint failed.";
      } else if (err.code === "P2003") {
         statusCode = 400;
         errorMessage = "Foreign key constraint failed.";
      }
   }

   // PrismaClientUnknownRequestError
   else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      statusCode = 500;
      errorMessage = "Error occurred during query execution.";
   }

   // PrismaClientRustPanicError
   else if (err instanceof Prisma.PrismaClientRustPanicError) {
      statusCode = 500;
      errorMessage =
         "Internal server error occurred while processing the database request.";
   }

   // PrismaClientInitializationError
   else if (err instanceof Prisma.PrismaClientInitializationError) {
      if (err.errorCode === "P1000") {
         statusCode = 401;
         errorMessage = "Authentication failed. Please check your credentials.";
      } else if (err.errorCode === "P1001") {
         statusCode = 400;
         errorMessage = "Can't reach database server.";
      }
   }

   // PrismaClientValidationError
   else if (err instanceof Prisma.PrismaClientValidationError) {
      statusCode = 400;
      errorMessage = "You provide incorrect field type or missing field.";
   }

   res.status(statusCode);
   res.json({
      message: errorMessage,
      error: errorDetails,
   });
}

export default errorHandler;

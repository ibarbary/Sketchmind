import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateBody =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unexpected validation error",
      });
    }
  };

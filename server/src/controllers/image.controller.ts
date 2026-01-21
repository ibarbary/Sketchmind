import { Request, Response } from "express";
import { generateImageService } from "../services/image.service";

export const generateImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    const response = await generateImageService(userId, prompt);

    return res.status(201).json(response);
  } catch (err: any) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

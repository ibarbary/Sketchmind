import express from "express";
import { verifyAccessToken } from "../middlewares/jwt";
import { generateImage } from "../controllers/image.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { generateImageSchema } from "../validations/image.validation";

const imageRouter = express.Router();

imageRouter.post("/generate", verifyAccessToken, validateBody(generateImageSchema), generateImage);

export default imageRouter;

import express from "express";
import {
  addPlan,
  buyCredits,
  getPlans,
} from "../controllers/credits.controller";
import { validateBody } from "../middlewares/validate.middleware";
import {
  addPlanSchema,
  buyCreditsSchema,
} from "../validations/credits.validation";
import { verifyAccessToken } from "../middlewares/jwt";

const creditsRouter = express.Router();

creditsRouter.get("/plans", getPlans);
creditsRouter.post("/plans", validateBody(addPlanSchema), addPlan);
creditsRouter.post(
  "/buy",
  verifyAccessToken,
  validateBody(buyCreditsSchema),
  buyCredits,
);

export default creditsRouter;

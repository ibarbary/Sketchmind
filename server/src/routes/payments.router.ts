import express from "express";
import { captureOrder, createOrder } from "../controllers/payments.controller";
import { validateBody } from "../middlewares/validate.middleware";
import {
  captureOrderSchema,
  createOrderSchema,
} from "../validations/payments.validation";
import { verifyAccessToken } from "../middlewares/jwt";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create",
  verifyAccessToken,
  validateBody(createOrderSchema),
  createOrder,
);
paymentRouter.post(
  "/capture",
  verifyAccessToken,
  validateBody(captureOrderSchema),
  captureOrder,
);

export default paymentRouter;

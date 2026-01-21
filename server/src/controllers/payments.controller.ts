import {
  captureOrderService,
  createOrderService,
} from "../services/payments.service";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await createOrderService(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await captureOrderService(req.body, userId);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

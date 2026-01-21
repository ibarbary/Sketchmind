import { Request, Response } from "express";
import {
  addPlanService,
  buyCreditsService,
  getPlansService,
} from "../services/credits.service";

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await getPlansService();
    res.status(200).json(plans);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const addPlan = async (req: Request, res: Response) => {
  try {
    await addPlanService(req.body);
    return res.status(201).json({ message: "Plan added successfully" });
  } catch (err: any) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

export const buyCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;
    const result = await buyCreditsService(userId, planId);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(err.status || 500).json({ message: err.message });
  }
};

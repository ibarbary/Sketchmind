import PricingPlan from "../models/pricingPlan.model";
import User from "../models/user.model";

export const getPlansService = async () => {
  try {
    const plans = await PricingPlan.find();
    if (!plans) {
      const error = new Error("No Plans Found") as any;
      error.status = 404;
      throw error;
    }
    return plans;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addPlanService = async (data: any) => {
  try {
    await PricingPlan.create(data);
  } catch (error) {
    return new Error((error as Error).message);
  }
};

export const buyCreditsService = async (userId: string, planId: string) => {
  try {
    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      const error = new Error("Plan not found") as any;
      error.status = 404;
      throw error;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: plan.credits } },
      { new: true },
    );

    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }

    return {
      message: "Credits purchased successfully",
      credits: user.credits,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

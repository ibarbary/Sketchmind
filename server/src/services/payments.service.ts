import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import PricingPlan from "../models/pricingPlan.model";
import User from "../models/user.model";
import Payment from "../models/payment.model";
dotenv.config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!,
);

const client = new paypal.core.PayPalHttpClient(environment);

export const createOrderService = async (data: any) => {
  try {
    const { planId } = data;

    const plan = await PricingPlan.findById(planId);

    if (!plan) {
      const error = new Error("Plan not found") as any;
      error.status = 404;
      throw error;
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: plan.price.toString(),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/payment/success?planId=${planId}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      },
    });

    const order = await client.execute(request);

    const approvalUrl = order.result.links.find(
      (l: any) => l.rel === "approve",
    ).href;

    return { approvalUrl };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during creating order",
      status: error.status || 500,
    };
  }
};

export const captureOrderService = async (data: any, userId: string) => {
  try {
    const { token, planId } = data;

    const existingPayment = await Payment.findOne({ orderId: token });

    if (existingPayment && existingPayment.status === "completed") {
      const user = await User.findById(userId);
      return {
        user,
        message: "Payment already verified. Credits are available.",
      };
    }

    const plan = await PricingPlan.findById(planId);
    if (!plan) {
      const error = new Error("Plan not found") as any;
      error.status = 404;
      throw error;
    }

    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({} as any);
    const capture = await client.execute(request);

    const orderStatus = capture.result.status;
    if (orderStatus !== "COMPLETED") {
      const error = new Error("Payment not completed") as any;
      error.status = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }

    user.credits += plan.credits;
    await user.save();

    await Payment.create({
      userId,
      planId,
      orderId: token,
      status: "completed",
    });

    return {
      user,
      message: "Payment successful, credits added",
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during creating order",
      status: error.status || 500,
    };
  }
};

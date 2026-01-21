import User from "../models/user.model";
import { sendWelcomeEmail } from "./sendEmail";

export const createUserService = async (data: any) => {
  try {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    await sendWelcomeEmail(user.name, user.email);

    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getCurrentUserService = async (userId: string) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }
    return user;
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong",
      status: error.status || 500,
    };
  }
};
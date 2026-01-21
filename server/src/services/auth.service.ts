import User from "../models/user.model";
import bcrypt from "bcrypt";
import PendingUser from "../models/pendingUser.model";
import { generateOtp } from "../utils/generateOTP";
import { sendForgotPasswordEmail, sendVerificationEmail } from "./sendEmail";
import { createUserService } from "./user.service";
import PasswordReset from "../models/passwordReset.model";

export const signupService = async (data: any) => {
  const { name, email, password } = data;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("User already exists") as any;
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await PendingUser.updateOne(
      { email },
      {
        $set: {
          name,
          password: hashedPassword,
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      },
      { upsert: true },
    );

    await sendVerificationEmail(name, email, otp);

    return {
      message: "Verification email sent. Please check your inbox.",
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during signup",
      status: error.status || 500,
    };
  }
};

export const resendOTPService = async (data: any) => {
  const { email } = data;

  try {
    if (!email) {
      const error = new Error("Email is required") as any;
      error.status = 400;
      throw error;
    }

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      const error = new Error(
        "No pending verification found for this email",
      ) as any;
      error.status = 404;
      throw error;
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await PendingUser.updateOne(
      { email },
      {
        $set: {
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      },
    );

    await sendVerificationEmail(pendingUser.name, email, otp);

    return {
      message: "OTP resent. Please check your inbox.",
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong",
      status: error.status || 500,
    };
  }
};

export const verifyEmailService = async (data: any) => {
  const { email, otp } = data;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      const error = new Error(
        "No pending verification found for this email",
      ) as any;
      error.status = 404;
      throw error;
    }

    const isOtpValid = await bcrypt.compare(otp, pendingUser.otp);
    if (!isOtpValid) {
      const error = new Error("Invalid or expired OTP") as any;
      error.status = 400;
      throw error;
    }

    const user = await createUserService({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    await PendingUser.deleteOne({ email });

    return {
      message: "Email verified successfully. Your account has been created.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during verification",
      status: error.status || 500,
    };
  }
};

export const loginService = async (data: any) => {
  const { email, password } = data;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password") as any;
      error.status = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password") as any;
      error.status = 401;
      throw error;
    }

    return {
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        credits: user.credits,
      },
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during login",
      status: error.status || 500,
    };
  }
};

export const sendForgotPasswordOTPService = async (data: any) => {
  const { email } = data;

  const r = await User.find();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User with this email does not exist") as any;
      error.status = 404;
      throw error;
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await PasswordReset.updateOne(
      { email },
      {
        $set: {
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      },
      { upsert: true },
    );
    await sendForgotPasswordEmail(user.name, email, otp);
    return {
      message: "OTP sent to your email. Please check your inbox.",
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong",
      status: error.status || 500,
    };
  }
};

export const verifyForgotPasswordOTPService = async (data: any) => {
  const { email, otp } = data;

  try {
    const passReset = await PasswordReset.findOne({ email });
    if (!passReset) {
      const error = new Error(
        "No pending verification found for this email",
      ) as any;
      error.status = 404;
      throw error;
    }

    const isOtpValid = await bcrypt.compare(otp, passReset.otp);
    if (!isOtpValid) {
      const error = new Error("Invalid or expired OTP") as any;
      error.status = 400;
      throw error;
    }

    await PasswordReset.deleteOne({ email });

    return {
      message: "OTP verified successfully",
    };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during verification",
      status: error.status || 500,
    };
  }
};

export const resetPasswordService = async (data: any) => {
  const { email, password } = data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return { message: "Password updated successfully" };
  } catch (error: any) {
    throw {
      message: error.message || "Something went wrong during verification",
      status: error.status || 500,
    };
  }
};

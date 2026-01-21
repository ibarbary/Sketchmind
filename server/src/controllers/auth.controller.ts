import { Request, Response } from "express";
import {
  loginService,
  resendOTPService,
  resetPasswordService,
  sendForgotPasswordOTPService,
  signupService,
  verifyEmailService,
  verifyForgotPasswordOTPService,
} from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../middlewares/jwt";
import { getCurrentUserService } from "../services/user.service";

const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000;
const REMEMBER_ME_EXPIRY = 90 * 24 * 60 * 60 * 1000;

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string | null,
  rememberMe = false,
) {
  const refreshExpiry = rememberMe ? REMEMBER_ME_EXPIRY : REFRESH_TOKEN_EXPIRY;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  if (refreshToken)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: refreshExpiry,
    });
}

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const result = await resendOTPService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { user, message } = await verifyEmailService(req.body);

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ user, message });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, message } = await loginService(req.body);
    const rememberMe = req.body.rememberMe || false;

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken(
      { id: user.id, email: user.email },
      rememberMe,
    );

    setAuthCookies(res, accessToken, refreshToken, rememberMe);

    res.status(200).json({ user, message });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUserService(req.user.id);
    res.status(200).json({ user });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    const { id, email } = req.user;

    const newAccessToken = generateAccessToken({ id, email });

    setAuthCookies(res, newAccessToken, null);

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Something went wrong during token refresh" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Something went wrong during logout" });
  }
};

export const sendForgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const result = await sendForgotPasswordOTPService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const verifyForgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const result = await verifyForgotPasswordOTPService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

import express from "express";
import { validateBody } from "../middlewares/validate.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  resendOTPSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOTPSchema,
} from "../validations/auth.validation";
import {
  getCurrentUser,
  login,
  logout,
  refresh,
  resendOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  signup,
  verifyEmail,
  resetPassword,
} from "../controllers/auth.controller";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/jwt";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signupSchema), signup);
authRouter.post("/resendOTP", validateBody(resendOTPSchema), resendOTP);
authRouter.post("/verifyEmail", validateBody(verifyOTPSchema), verifyEmail);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", verifyAccessToken, getCurrentUser);
authRouter.post("/refresh", verifyRefreshToken, refresh);
authRouter.post("/logout", logout);
authRouter.post(
  "/forgot/send-otp",
  validateBody(forgotPasswordSchema),
  sendForgotPasswordOTP,
);
authRouter.post(
  "/forgot/verify-otp",
  validateBody(verifyOTPSchema),
  verifyForgotPasswordOTP,
);

authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  resetPassword,
);

export default authRouter;

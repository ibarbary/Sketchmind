import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" } as any)
    .min(3, "Name must be at least 3 characters"),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" } as any)
    .min(8, "Password must be at least 8 characters"),
});

export const resendOTPSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});

export const verifyOTPSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  otp: z
    .string({ required_error: "OTP is required" } as any)
    .length(6, "OTP must be 6 digits"),
});

export const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" } as any)
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});

export const resetPasswordSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" } as any)
    .min(8, "Password must be at least 8 characters"),
});

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  name: string,
  email: string,
  otp: string
) => {
  const mailOptions = {
    from: `"SketchMind" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SketchMind Verification Code",
    html: ` <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border: 1px solid #cccccc;"> <h2 style="color: #333333;">Hello ${name},</h2> <p style="color: #555555;"> Welcome to <strong>SketchMind</strong>! To complete your verification, please use the code below: </p> <div style="background-color: #f5f5f5; border: 1px solid #cccccc; padding: 15px; text-align: center; margin: 20px 0;"> <span style="font-size: 24px; font-weight: bold; color: #000000;">${otp}</span> </div> <p style="color: #555555;"> This code will expire in <strong>15 minutes</strong>. </p> <p style="color: #777777; font-size: 12px;"> If you didn’t request this, please ignore this email. </p> <hr style="border: none; border-top: 1px solid #cccccc; margin: 20px 0;" /> <p style="color: #999999; font-size: 12px; text-align: center;"> &copy; ${new Date().getFullYear()} SketchMind. All rights reserved. </p> </div> `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const sendForgotPasswordEmail = async (
  name: string,
  email: string,
  otp: string,
) => {
  const mailOptions = {
    from: `"SketchMind" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SketchMind Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border: 1px solid #cccccc;">
        <h2 style="color: #333333;">Hello ${name},</h2>
        <p style="color: #555555;">
          We received a request to reset your <strong>SketchMind</strong> account password. 
          Please use the code below to proceed:
        </p>
        <div style="background-color: #f5f5f5; border: 1px solid #cccccc; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #000000;">${otp}</span>
        </div>
        <p style="color: #555555;">
          This code will expire in <strong>15 minutes</strong>. If you did not request a password reset, 
          you can safely ignore this email and your password will remain unchanged.
        </p>
        <hr style="border: none; border-top: 1px solid #cccccc; margin: 20px 0;" />
        <p style="color: #999999; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} SketchMind. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


export const sendWelcomeEmail = async (name: string, email: string) => {
  const mailOptions = {
    from: `"SketchMind" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to SketchMind",
    html: ` <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 20px; border: 1px solid #cccccc;"> <h2 style="color: #333333;">Welcome, ${name}!</h2> <p style="color: #555555;"> Your account has been created successfully. We're excited to have you join <strong>SketchMind</strong> — a space where ideas take shape. </p> <div style="background-color: #f5f5f5; border: 1px solid #cccccc; padding: 15px; margin: 20px 0;"> <p style="color: #000000; text-align: center; font-size: 16px;"> Start exploring and sketching your thoughts today. </p> </div> <p style="color: #555555;"> If you have any questions or need support, feel free to reach out to us anytime. </p> <hr style="border: none; border-top: 1px solid #cccccc; margin: 20px 0;" /> <p style="color: #999999; font-size: 12px; text-align: center;"> &copy; ${new Date().getFullYear()} SketchMind. All rights reserved. </p> </div> `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
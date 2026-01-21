import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connection";
import authRouter from "./routes/auth.router";
import creditsRouter from "./routes/credits.router";
import imageRouter from "./routes/image.router";
import paymentRouter from "./routes/payments.router";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/credits", creditsRouter);
app.use("/api/image", imageRouter);
app.use("/api/payments", paymentRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

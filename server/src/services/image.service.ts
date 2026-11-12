
import axios from "axios";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

export const generateImageService = async (
  userId: string,
  prompt: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found") as any;
    error.status = 404;
    throw error;
  }

  if (user.credits < 1) {
    const error = new Error("Insufficient credits") as any;
    error.status = 402;
    throw error;
  }

  try {
    const response = await axios.post(
      "https://router.huggingface.co/fal-ai/black-forest-labs/FLUX.1-schnell",
      {
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        responseType: "arraybuffer",
      }
    );

    const output_url =
      `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    user.credits -= 1;
    await user.save();

    return {
      imageUrl: output_url,
      credits: user.credits,
    };

  } catch (error: any) {
    console.error(
      "Hugging Face error:",
      error.response?.status,
      error.response?.data
        ? Buffer.from(error.response.data).toString("utf8")
        : error.message
    );

    throw error;
  }
};

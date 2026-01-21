import axios from "axios";
import User from "../models/user.model";
import dotenv from "dotenv";
dotenv.config();

export const generateImageService = async (userId: string, prompt: string) => {
  try {
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

    const response = await axios.post(
      "https://router.huggingface.co/nscale/v1/images/generations",
      {
        response_format: "b64_json",
        prompt,
        model: "black-forest-labs/FLUX.1-schnell",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      },
    );

    const output_url = `data:image/png;base64,${response.data.data[0].b64_json}`;

    user.credits -= 1;
    await user.save();

    return {
      imageUrl: output_url,
      credits: user.credits,
    };
  } catch (error: any) {
    throw new Error((error as Error).message);
  }
};

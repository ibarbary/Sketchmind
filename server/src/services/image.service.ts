
import axios from "axios";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
    const headers = {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    };

    // STEP 1: Submit the generation request
    const submitResponse = await axios.post(
      "https://router.huggingface.co/fal-ai/fal-ai/flux/schnell?_subdomain=queue",
      { prompt },
      { headers }
    );

    const queueData = submitResponse.data;

    console.log("Generation submitted:", queueData);

    if (!queueData.request_id || !queueData.response_url) {
      throw new Error("Invalid queue response from Hugging Face");
    }

    // STEP 2: Build the Hugging Face status and result URLs
    const responsePath = new URL(queueData.response_url).pathname;

    const statusUrl =
      `https://router.huggingface.co/fal-ai${responsePath}/status?_subdomain=queue`;

    const resultUrl =
      `https://router.huggingface.co/fal-ai${responsePath}?_subdomain=queue`;

    // STEP 3: Wait until generation is completed
    let status = queueData.status;
    const startTime = Date.now();
    const timeoutMs = 90000;

    while (status !== "COMPLETED") {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error("Image generation timed out");
      }

      await sleep(1000);

      const statusResponse = await axios.get(statusUrl, {
        headers,
      });

      status = statusResponse.data.status;

      console.log("Generation status:", status);

      if (!["IN_QUEUE", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        throw new Error(`Unexpected generation status: ${status}`);
      }
    }

    // STEP 4: Retrieve the actual generation result
    const resultResponse = await axios.get(resultUrl, {
      headers,
    });

    const result = resultResponse.data;

    console.log("Generation result:", result);

    if (!result.images || !result.images[0]?.url) {
      throw new Error(
        "Generation completed, but no image URL was returned"
      );
    }

    // STEP 5: Download the actual image
    const imageResponse = await axios.get(result.images[0].url, {
      responseType: "arraybuffer",
    });

    const mimeType =
      imageResponse.headers["content-type"] || "image/png";

    const base64Image = Buffer.from(imageResponse.data).toString("base64");

    const outputUrl = `data:${mimeType};base64,${base64Image}`;

    // STEP 6: Deduct credits only after successful image generation
    user.credits -= 1;
    await user.save();

    return {
      imageUrl: outputUrl,
      credits: user.credits,
    };

  } catch (error: any) {
    console.error(
      "Image generation error:",
      error.response?.status,
      error.response?.data || error.message
    );

    throw error;
  }
};

import { useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { context } from "../context/AppContext";

function GenerateImage() {
  const { user, setUser } = useContext(context);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!user?.credits || user?.credits < 1) {
      toast.dismiss();
      toast.error("You don't have enough credits");
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const { data } = await api.post("/api/image/generate", { prompt });
      setImageUrl(data.imageUrl);
      setUser({ ...user!, credits: data.credits });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to generate image";
      toast.dismiss();
      toast.error(message);
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 flex flex-col items-center px-4">
      <div className="relative group w-full max-w-3xl min-h-105 h-auto bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-gray-400 text-sm">
            Your generated image will appear here
          </p>
        )}

        {imageUrl && !loading && (
          <button
            onClick={handleDownload}
            className="cursor-pointer absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-400 transition text-black text-sm rounded-full"
          >
            Download
          </button>
        )}
      </div>

      <form
        onSubmit={handleGenerate}
        className="mt-6 w-full max-w-3xl flex gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-full text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-zinc-800 cursor-pointer"
          }`}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}

export default GenerateImage;

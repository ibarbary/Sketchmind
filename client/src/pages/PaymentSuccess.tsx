import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { context } from "../context/AppContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const planId = params.get("planId");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const { setUser } = useContext(context);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token || !planId) {
        setStatus("error");
        return;
      }

      try {
        const { data } = await api.post("/api/payments/capture", {
          token,
          planId,
        });

        if (data.user) setUser(data.user);

        toast.success(data.message || "Payment verified! Credits added.");
        setStatus("success");
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Payment verification failed.";
        toast.dismiss();
        toast.error(message);
        setStatus("error");
      }
    };

    verify();
  }, []);

  if (status === "verifying") {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-medium">Verifying payment...</h1>
        <p className="mt-2 text-gray-600">Please wait a moment.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-semibold">Payment Successful 🎉</h1>
        <p className="mt-3 text-gray-600">
          Your credits have been added! You can now generate images.
        </p>

        <button
          onClick={() => navigate("/generate")}
          className="cursor-pointer mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg"
        >
          Generate Images
        </button>
      </div>
    );
  }

  // error case
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-semibold">Verification Failed ❌</h1>
      <p className="mt-3 text-gray-600">
        We could not verify your payment. No credits were added.
      </p>

      <button
        onClick={() => navigate("/pricing")}
        className="cursor-pointer mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg"
      >
        Return to Pricing
      </button>
    </div>
  );
}

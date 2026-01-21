import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {
  email: string;
  onSuccess: (user: any, token: string) => void;
  onClose: () => void;
}

export default function OTP({ email, onSuccess, onClose }: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) return toast.error("Enter OTP code");
    setLoading(true);

    try {
      const res = await axios.post("/auth/verify-email", { email, otp });
      toast.success(res.data.message);

      // Pass data back to parent
      onSuccess(res.data.user, res.data.token);

      onClose();
    } catch (error: any) {
      const data = error.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg w-95 space-y-4">
        <h2 className="text-xl font-semibold text-center">Verify Email</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter the 6-digit code sent to <b>{email}</b>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border w-full p-2 rounded text-center tracking-widest text-lg"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={onClose}
          className="text-sm w-full text-gray-600 text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

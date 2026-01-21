import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import apiAuth from "../utils/apiAuth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sendingOTP, setSendingOTP] = useState(false);
  const navigate = useNavigate();

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setSendingOTP(true);
    try {
      const { data } = await apiAuth.post("/api/auth/forgot/send-otp", { email });
      toast.success(data.message);
      navigate(`/verify-otp?email=${email}`);
    } catch (err: any) {
      const data = err.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Error sending OTP");
      }
    }

    setSendingOTP(false);
  }

  return (
    <>
      <form
        onSubmit={sendOtp}
        className="bg-white p-8 py-10 rounded-lg shadow-xl border border-gray-200 w-full max-w-lg mx-auto flex flex-col gap-4"
      >
        <p className="text-xl font-medium text-center">Forgot Password</p>
        <p className="text-sm text-center text-gray-500">
          Enter your email to receive an OTP
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded text-center tracking-wide text-lg outline-none"
          placeholder="Email"
        />

        <button
          type="submit"
          disabled={sendingOTP}
          className={`${
            sendingOTP ? "cursor-not-allowed" : "cursor-pointer"
          } w-full py-3 rounded-md bg-black text-white disabled:bg-gray-400`}
        >
          {sendingOTP ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </>
  );
}
export default ForgotPassword;

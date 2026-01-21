import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import apiAuth from "../utils/apiAuth";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || otp.length !== 6) {
      toast.dismiss();
      toast.error("All Fields are required");
      return;
    }

    setIsVerifying(true);
    try {
      await apiAuth.post("/api/auth/forgot/verify-otp", { email, otp });
      navigate(`/reset-password?email=${email}`);
    } catch (error: any) {
      const data = error.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    }
    setIsVerifying(false);
  }

  async function resendOtp() {
    setResendDisabled(true);
    try {
      const res = await apiAuth.post("/api/auth/forgot/send-otp", { email });
      toast.dismiss();
      toast.success(res.data.message || "OTP resent. Please check your email.");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error occurred while resending OTP.";
      toast.dismiss();
      toast.error(message);
      setResendDisabled(false);
    }
  }

  useEffect(() => {
    let timer: any;
    if (resendDisabled) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  return (
    <>
      <form
        onSubmit={verifyOtp}
        className="bg-white p-8 py-10 rounded-lg shadow-xl border border-gray-200 w-full max-w-lg mx-auto flex flex-col gap-4"
      >
        <p className="text-xl font-medium text-center">Verify OTP</p>
        <p className="text-sm text-center text-gray-500">
          Enter the OTP sent to your email
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          maxLength={6}
          className="border p-2 rounded text-center tracking-widest text-lg"
        />

        <button
          type="submit"
          disabled={otp.length !== 6 || isVerifying}
          className={`${
            isVerifying ? "cursor-not-allowed" : "cursor-pointer"
          } w-full py-2 rounded-md bg-black text-white disabled:bg-gray-400`}
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          onClick={resendOtp}
          disabled={resendDisabled}
          className={`${
            resendDisabled ? "cursor-not-allowed" : "cursor-pointer"
          } w-full mt-2 py-2 rounded-md bg-gray-200 text-gray-800 disabled:opacity-50`}
        >
          {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </button>
      </form>
    </>
  );
}
export default VerifyOTP;

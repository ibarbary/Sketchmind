import { useContext, useEffect, useState } from "react";
import { context } from "../context/AppContext";
import { isStrongPassword, validateEmail } from "../utils/validator";
import hide from "../assets/hide.png";
import see from "../assets/see.png";
import toast from "react-hot-toast";
import apiAuth from "../utils/apiAuth";

const Signup = () => {
  const [step, setStep] = useState<"form" | "otp">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const { setShowSignup, setShowLogin, setUser } = useContext(context);

  // Handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Countdown timer for Resend OTP
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

  // Handle signup submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiAuth.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setStep("otp");

      toast.dismiss();
      toast.success(
        res.data.message || "Verification email sent. Please check your inbox.",
      );
    } catch (error: any) {
      const data = error.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Error occurred during signup.");
      }
    }

    setIsSubmitting(false);
  }

  // Handle OTP verification
  async function verifyEmail(e: React.FormEvent) {
    e.preventDefault();

    if (otp.length !== 6) return; // prevent submission if OTP is incomplete

    setIsVerifying(true);
    try {
      const res = await apiAuth.post("/api/auth/verifyEmail", { email, otp });
      toast.dismiss();
      toast.success(
        res.data.message || "Email verified successfully. Welcome!",
      );

      setUser(res.data.user);
      setShowSignup(false);
    } catch (error: any) {
      const data = error.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Error occurred during verification.");
      }
    }

    setIsVerifying(false);
  }

  // Resend OTP
  async function resendOtp() {
    setResendDisabled(true);
    try {
      const res = await apiAuth.post("/api/auth/resendOTP", { name, email });
      toast.dismiss();
      toast.success(res.data.message || "OTP resent. Please check your email.");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error occurred while resending OTP.";
      toast.dismiss();
      toast.error(message);
      setResendDisabled(false); // re-enable if error
    }
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
      onClick={() => setShowSignup(false)}
    >
      {/* FORM STEP */}
      {step === "form" && (
        <form
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-100 rounded-lg shadow-xl border border-gray-200 bg-white"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <p className="text-2xl font-medium m-auto">Sign Up</p>

          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none"
              type="text"
              required
            />
          </div>

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => {
                setIsValidEmail(validateEmail(e.target.value.trim()));
                setEmail(e.target.value.trim());
              }}
              value={email}
              className={`border rounded w-full p-2 mt-1 outline-none ${
                email.length > 0
                  ? isValidEmail
                    ? "border-green-400"
                    : "border-red-400"
                  : "border-gray-200"
              }`}
              type="email"
              required
            />
            {email.length > 0 && !isValidEmail && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div className="w-full">
            <p>Password</p>
            <div className="relative">
              <input
                onChange={(e) => {
                  setIsValidPassword(isStrongPassword(e.target.value));
                  setPassword(e.target.value);
                }}
                value={password}
                className={`border rounded w-full p-2 mt-1 outline-none ${
                  password.length > 0
                    ? isValidPassword
                      ? "border-green-400"
                      : "border-red-400"
                    : "border-gray-200"
                }`}
                type={showPassword ? "text" : "password"}
                required
              />
              <img
                src={showPassword ? hide : see}
                alt="eye"
                className="w-5 h-5 absolute right-3 top-3.5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded mt-3">
              Password must include:
              <ul className="list-disc ml-6 mt-1">
                <li>At least 8 characters</li>
                <li>1 lowercase letter</li>
                <li>1 uppercase letter</li>
                <li>1 number</li>
                <li>1 special character</li>
              </ul>
            </div>
          </div>

          <p>
            Already have account?{" "}
            <span
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              className="text-black underline cursor-pointer"
            >
              click here
            </span>
          </p>

          <button
            disabled={!isValidPassword || !isValidEmail || isSubmitting}
            className={`${
              isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
            } w-full py-2 rounded-md bg-black text-white disabled:bg-gray-400`}
          >
            {isSubmitting ? "Submitting..." : "Create Account"}
          </button>
        </form>
      )}

      {/* OTP STEP */}
      {step === "otp" && (
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={verifyEmail}
          className="bg-white p-8 py-10 rounded-lg shadow-xl border border-gray-200 w-90 flex flex-col gap-4 relative m-auto"
        >
          <button
            type="button"
            className="cursor-pointer absolute left-4 top-4 text-sm hover:text-black"
            onClick={() => setStep("form")}
          >
            ← Back
          </button>
          <p className="text-xl font-medium text-center">Verify Email</p>
          <p className="text-sm text-center">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>
          <input
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="border p-2 rounded text-center tracking-widest text-lg"
            required
            inputMode="numeric"
          />
          <button
            disabled={otp.length !== 6 || isVerifying}
            className={`${
              isVerifying ? "cursor-not-allowed" : "cursor-pointer"
            } w-full py-2 rounded-md bg-black text-white disabled:bg-gray-400`}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
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
      )}
    </div>
  );
};

export default Signup;

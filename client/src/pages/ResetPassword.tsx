import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isStrongPassword } from "../utils/validator";
import apiAuth from "../utils/apiAuth";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword) {
      toast.error("Weak Password");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await apiAuth.post("/api/auth/reset-password", {
        email,
        password,
      });

      toast.success(data.message || "Password updated successfully");

      setTimeout(() => {
        navigate("/");
      }, 800);
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

    setSubmitting(false);
  };

  return (
    <>
      <form
        onSubmit={resetPassword}
        className="bg-white p-8 py-10 rounded-lg shadow-xl border border-gray-200 w-full max-w-md mx-auto flex flex-col gap-4"
      >
        <p className="text-xl font-medium text-center">Reset Password</p>
        <input
          type="text"
          value={email || ""}
          disabled
          className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
        />

        <input
          type="text"
          placeholder="New password"
          value={password}
          onChange={(e) => {
            setIsValidPassword(isStrongPassword(e.target.value));
            setPassword(e.target.value);
          }}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => {
            setIsValidPassword(isStrongPassword(e.target.value));
            setConfirm(e.target.value);
          }}
          required
          className="border p-2 rounded"
        />

        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          Password must include:
          <ul className="list-disc ml-6 mt-1">
            <li>At least 8 characters</li>
            <li>1 lowercase letter</li>
            <li>1 uppercase letter</li>
            <li>1 number</li>
            <li>1 special character</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded-md bg-black text-white transition hover:bg-zinc-800 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? "Submitting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}
export default ResetPassword;

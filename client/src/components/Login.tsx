import { useContext, useEffect, useState } from "react";
import { context } from "../context/AppContext";
import hide from "../assets/hide.png";
import see from "../assets/see.png";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import apiAuth from "../utils/apiAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setUser, setShowLogin, setShowSignup } = useContext(context);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiAuth.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });
      setUser(res.data.user);
      setShowLogin(false);
      toast.dismiss();
      toast.success(res.data.message);
    } catch (error: any) {
      const data = error.response?.data;
      toast.dismiss();
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error: any) => {
          toast.error(error.message);
        });
      } else {
        toast.error(data?.message || "Login failed. Please try again.");
      }
    }

    setIsSubmitting(false);
  }
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
      onClick={() => setShowLogin(false)}
    >
      <form
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-100 rounded-lg shadow-xl border border-gray-200 bg-white"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleSubmit(e)}
      >
        <p className="text-2xl font-medium m-auto">Login</p>

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => {
              setEmail(e.target.value.trim());
            }}
            value={email}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <div className="relative">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none"
              type={showPassword ? "text" : "password"}
              required
            />

            <img
              src={showPassword ? hide : see}
              alt=""
              className="w-5 h-5 absolute right-3 top-3.5 cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          </div>
        </div>

        <p
          onClick={() => setShowLogin(false)}
          className="w-full text-right text-primary cursor-pointer hover:underline"
        >
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <p>
          Create an account?{" "}
          <span
            onClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            className="text-black underline cursor-pointer"
          >
            click here
          </span>
        </p>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe" className="cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full py-2 rounded-md transition-all bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

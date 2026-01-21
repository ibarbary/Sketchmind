import { createContext, useEffect, useState } from "react";
import api, { setAxiosLogout } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiAuth from "../utils/apiAuth";

export type PricingPlan = {
  _id: string;
  name: string;
  price: number;
  credits: number;
  popular: boolean;
  description: string;
};

export type User = {
  name: string;
  credits: number;
};

export const context = createContext({
  user: null as User | null,
  setUser: (user: User | null) => {},
  pricingPlans: null as PricingPlan[] | null,
  setPricingPlans: (plans: PricingPlan[] | null) => {},
  loadingUser: true,
  setLoadingUser: (loading: boolean) => {},
  logout: () => {},
  showLogin: false,
  setShowLogin: (show: boolean) => {},
  showSignup: false,
  setShowSignup: (show: boolean) => {},
});

function AppContext({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[] | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const navigate = useNavigate();

  function forceLogoutForExpiry() {
    setUser(null);
    navigate("/");
  }

  async function logout() {
    try {
      const res = await apiAuth.post("/api/auth/logout");
      setUser(null);
      navigate("/");
      const message = res.data?.message || "Logged out successfully.";
      toast.success(message);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(message);
      console.error("Logout error:", message);
    }
  }

  useEffect(() => {
    setAxiosLogout(forceLogoutForExpiry);
  }, []);

  useEffect(() => {
    async function loadUser() {
      setLoadingUser(true);
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    async function loadPlans() {
      const res = await apiAuth.get("/api/credits/plans");
      setPricingPlans(res.data);
    }

    loadUser();
    loadPlans();
  }, []);

  return (
    <context.Provider
      value={{
        user,
        setUser,
        pricingPlans,
        setPricingPlans,
        loadingUser,
        setLoadingUser,
        logout,
        showLogin,
        setShowLogin,
        showSignup,
        setShowSignup,
      }}
    >
      {children}
    </context.Provider>
  );
}
export default AppContext;

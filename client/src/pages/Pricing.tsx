import { useContext, useState } from "react";
import { context } from "../context/AppContext";
import api from "../utils/api";
import toast from "react-hot-toast";

function Pricing() {
  const { user, setUser, setShowLogin, pricingPlans } = useContext(context);
  const [buyingCredits, setBuyingCredits] = useState(false);
  const [chosenPlan, setChosenPlan] = useState<string>("");

  async function handleBuyCredits(planId: string) {
    if (!user) {
      setShowLogin(true);
      return;
    } else {
      // const { data } = await api.post("/api/payments/create", { planId });
      // window.location.href = data.approvalUrl;
      setBuyingCredits(true);
      try {
        const { data } = await api.post("/api/credits/buy", { planId });
        setUser({ ...user, credits: data.credits });
        toast.dismiss();
        toast.success(data.message || "Credits added successfully");
      } catch (error: any) {
        const data = error.response?.data;
        toast.dismiss();
        if (data?.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error: any) => {
            toast.error(error.message);
          });
        } else {
          toast.error(data?.message || "Failed to buy credits");
        }
      }

      setBuyingCredits(false);
    }
  }

  return (
    <>
      <section className="flex items-center justify-center flex-col py-10 px-4">
        <h1 className="font-medium text-4xl md:text-[52px] text-black text-center">
          Choose Your Plan
        </h1>
        {!pricingPlans && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="border border-zinc-200 rounded-2xl py-10 px-10 max-w-md animate-pulse"
              >
                <div className="h-4 w-24 bg-zinc-300 rounded mb-3" />
                <div className="h-3 w-32 bg-zinc-200 rounded mb-5" />
                <div className="h-6 w-20 bg-zinc-300 rounded mb-10" />
                <div className="h-10 w-full bg-zinc-300 rounded" />
              </div>
            ))}
          </div>
        )}

        {pricingPlans && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pricingPlans?.map((plan, index) => (
              <div
                key={index}
                className="relative border border-zinc-200 rounded-2xl py-10 px-10 flex flex-col items-start max-w-md transition duration-300 hover:-translate-y-1"
              >
                {plan.popular && (
                  <span className="text-s text-slate-800 bg-zinc-300 px-3 py-1 rounded-full mb-4 absolute top-2 right-2">
                    Most Popular
                  </span>
                )}

                <h1 className="font-medium text-3xl text-slate-800 mt-1">
                  {plan.name}
                </h1>
                <p className="text-sm text-zinc-500 mt-2">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="font-medium text-4xl text-slate-800 mt-10">
                    ${plan.price}
                  </span>
                  <span className="text-m text-zinc-500 mb-1">
                    / {plan.credits} credits
                  </span>
                </div>

                <button
                  disabled={buyingCredits}
                  onClick={() => {
                    handleBuyCredits(plan._id);
                    setChosenPlan(plan._id);
                  }}
                  className={`${
                    buyingCredits ? "cursor-not-allowed" : "cursor-pointer"
                  } w-full px-4 py-3 rounded-full bg-black text-white text-sm mt-10 border`}
                >
                  {buyingCredits && plan._id == chosenPlan
                    ? "Buying..."
                    : "Get Credits"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Pricing;

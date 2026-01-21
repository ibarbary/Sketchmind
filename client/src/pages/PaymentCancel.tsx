import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-semibold">Payment Canceled ❌</h1>
      <p className="mt-3 text-gray-600">
        Your payment was canceled. No charges were made.
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

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../context/AppContext";

const CTA = () => {
  const { user, setShowLogin } = useContext(context);
  const navigate = useNavigate();

  function handleGenerate() {
    if (user) navigate("/generate");
    else setShowLogin(true);
  }

  return (
    <section className="py-16 flex flex-col items-center text-center px-4 md:px-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6">
        Ready to create your own masterpiece?
      </h2>
      <button
        onClick={() => handleGenerate()}
        className="cursor-pointer mt-4 px-15 py-3 text-sm md:text-base bg-black text-white rounded-full hover:bg-zinc-800 transition"
      >
        Generate Images
      </button>
    </section>
  );
};

export default CTA;

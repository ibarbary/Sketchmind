import { useNavigate } from "react-router-dom";
import sketch from "../assets/sketch.webp";
import { useContext } from "react";
import { context } from "../context/AppContext";

function Header() {
  const { user, setShowLogin } = useContext(context);

  const navigate = useNavigate();

  function handleGenerate() {
    if (user) navigate("/generate");
    else setShowLogin(true);
  }

  return (
    <>
      <section className="relative mx-auto mb-10 flex items-center justify-center text-center">
        <img
          src={sketch}
          alt="Sketch background"
          className="w-full max-h-150 object-cover rounded-xl"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black max-w-3xl leading-tight">
            Turn Text Into Stunning AI Images
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl">
            Describe your idea in words and let Sketchmind transform it into
            unique, high-quality images in seconds — no design skills required.
          </p>
          <button
            onClick={() => handleGenerate()}
            className="cursor-pointer mt-6 px-15 py-3 text-sm md:text-base bg-black text-white rounded-full hover:bg-zinc-800 transition"
          >
            Generate Images
          </button>
        </div>
      </section>
    </>
  );
}

export default Header;

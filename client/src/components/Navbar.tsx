import { Link, useNavigate } from "react-router-dom";
import person from "../assets/person.png";
import { useContext, useEffect, useRef, useState } from "react";
import { context } from "../context/AppContext";

function Navbar() {
  const { user, logout, setShowLogin, setShowSignup, loadingUser } =
    useContext(context);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").slice(-1)[0].slice(0, 2).toUpperCase()
    : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-5 md:px-10 lg:px-15 xl:px-20 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to={"/"} className="flex items-center gap-1">
        <img className="h-14" src={person} alt="logo" />
        <h1 className="hidden sm:block text-3xl font-bold">Sketchmind</h1>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {loadingUser ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {" "}
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>{" "}
          </div>
        ) : !user ? (
          // GUEST VIEW (Login/Sign Up)
          <>
            <Link
              to="/pricing"
              className="text-lg font-medium text-gray-700 hover:text-black transition"
            >
              Pricing
            </Link>

            <button
              onClick={() => setShowLogin(true)}
              className="cursor-pointer px-6 py-2 text-md font-medium border border-gray-400 rounded-full hover:bg-gray-100 transition"
            >
              Login
            </button>

            <button
              onClick={() => setShowSignup(true)}
              className="cursor-pointer px-6 py-2 text-md font-medium bg-black text-white rounded-full hover:bg-zinc-800 transition"
            >
              Sign Up
            </button>
          </>
        ) : (
          // 👤 AUTHENTICATED VIEW
          <>
            <button
              onClick={() => navigate("/pricing")}
              className="cursor-pointer px-4 py-2 text-lg font-medium bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              Credits: {user.credits}
            </button>

            <div ref={dropdownRef} className="relative">
              <div
                onClick={() => setOpen((prev) => !prev)}
                title={user.name}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold cursor-pointer select-none"
              >
                {initials}
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/generate");
                      setOpen(false);
                    }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Generate Image
                  </button>
                  <button
                    onClick={() => {
                      navigate("/pricing");
                      setOpen(false);
                    }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Purchase Credits
                  </button>
                  <button
                    onClick={logout}
                    className="cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

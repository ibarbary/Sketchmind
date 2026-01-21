import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Signup from "../components/Signup";
import Login from "../components/Login";
import { context } from "../context/AppContext";
import { useContext } from "react";

export default function MainLayout() {
    const { showLogin, showSignup } = useContext(context);
    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow px-6 md:px-16 lg:px-24 xl:px-32">
        {showLogin && <Login />}
        {showSignup && <Signup />}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import WelcomeText from "./WelcomeText";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen">

      <Spline
        scene="https://prod.spline.design/1JGeGQjU8jC4LrLd/scene.splinecode"
        className="w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none pb-10">

        {/* Center Text */}
        <div className="flex justify-center  flex-1">
          <WelcomeText />
        </div>

        {/* Button (bottom center with spacing) */}
        <button  onClick={() => navigate("/login")} className="pointer-events-auto bg-[#1E90FF] text-black px-6 py-3 rounded-lg shadow-md  hover:bg-[#72b1f4] transition-colors duration-300">
          Get Started
        </button>

      </div>

    </div>
  );
};

export default LandingPage;
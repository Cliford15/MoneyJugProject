"use client";

import React, { useState } from "react";
import Signup from "@/components/forms/SignupForm";
import Login from "@/components/forms/LoginForm";

export default function Register() {
  const [activeForm, setActiveForm] = useState<"login" | "signup">("signup");
  const handleActiveForm = (e: React.MouseEvent<HTMLButtonElement>) =>
    setActiveForm(e.currentTarget.id as "login" | "signup");

  return (
    <div className="w-full h-screen flex justify-center bg-[#1F2A44]">
      <div className="w-[400px] flex flex-col items-center">
        <div className="text-[30px] text-[#D6A33A] font-archivoblack mb-2">
          <h1>
            Welcome to M<span className="text-[#BF8E5C]">oney</span> J
            <span className="text-[#BF8E5C]">ug</span>
          </h1>
        </div>

        <div className="w-[400px] shadow-md border-2 font-montserrat rounded-xl bg-white">
          <div className="flex text-2xl font-thin">
            <button
              id="login"
              className={`rounded-tl-xl flex-1 py-[10px] ${activeForm === "login" ? "bg-white" : "bg-gray-200"}`}
              onClick={handleActiveForm}
            >
              Log in
            </button>
            <button
              id="signup"
              className={`rounded-tr-xl flex-1 py-[10px] ${activeForm === "signup" ? "bg-white" : "bg-gray-200"}`}
              onClick={handleActiveForm}
            >
              Sign up
            </button>
          </div>

          <div className="p-[30px] bg-white rounded-xl w-full">
            {activeForm === "signup" && <Signup />}
            {activeForm === "login" && <Login />}
          </div>
        </div>
      </div>
    </div>
  );
}
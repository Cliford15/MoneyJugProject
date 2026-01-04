"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1F2A44] flex justify-center">
      <div className="flex justify-between bg-transparent/50 py-10 w-11/12 mt-10 h-full rounded-lg">
        <div className="flex flex-col items-center justify-center w-1/2">
          <img src="/HomePicture.jpg" alt="Money Jug Logo" className="w-[217px] rounded-3xl hover:scale-105 transition-all duration-300" />
          <h1 className="text-7xl font-bungee mt-4 underline decoration-orange-600 decoration-8 underline-offset-8 hover:scale-105 transition-all duration-300">
            Money Jug
          </h1>
          <p className="text-xl mt-4 text-center px-8 font-bungee hover:scale-105 transition-all duration-300">
            Fill your jug, secure your future.
          </p>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-[250px] h-[250.5px] bg-[#F2CC7D] rounded-xl flex flex-col justify-center items-center text-[#7E4228] px-5 font-montserrat">
            <button
              onClick={() => router.push("/prototype")}
              className="bg-[#75DB55] hover:bg-[#67c246] rounded-md py-1 w-[150px] h-[50px] font-archivoblack hover:scale-105 transition-all duration-300"
            >
              Prototype
            </button>
            <span className="font-semibold text-sm mt-2">Limited features only</span>
            <button
              className="bg-[#75DB55] rounded-md py-1 w-[150px] h-[50px] font-archivoblack mt-8 cursor-not-allowed"
            >
              Premium
            </button>
            <span className="font-semibold text-sm mt-2">Get full access of Money Jug</span>
          </div>
        </div>
      </div>
    </div>
  );
}
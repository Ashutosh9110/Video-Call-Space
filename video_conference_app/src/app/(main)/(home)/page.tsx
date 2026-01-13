"use client";

import MainMenu from "../../../components/MainMenu";
import { useMenuState } from "@/app/hooks/useMenuState";

const HomePage = () => {
  const menuOpen = useMenuState();

  return (
    <div className="flex flex-col items-center min-h-screen">
      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-20">
          <div className="w-full h-full flex justify-center items-center">
            <div
              className={`transition-all duration-500 ease-out ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <MainMenu />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 w-full flex flex-col justify-center items-center">
        <h1 className="text-6xl font-bold text-white mb-8">Connect Anywhere</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl">
          Seamless video conferencing for the modern world
        </p>
      </div>
    </div>
  );
};

export default HomePage;
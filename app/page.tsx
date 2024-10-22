"use client";

import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import Link from "next/link";
import Particles from "@/components/ui/particles";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Home() {
  return (
    <main className="relative flex h-screen flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={120}
        staticity={70}
        ease={50}
        color="#ffffff"
      />
      <div className="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="absolute top-0 left-0 right-0 flex justify-between items-center py-6 px-4 sm:px-6 lg:px-8">
          {/* <UserGreetText /> */}
          {/* <LoginButton /> */}
        </header>

        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            Create AR Experiences with Art
          </h1>
          <p className="text-2xl text-white mb-8">
            Transform your artwork into immersive augmented reality experiences
          </p>
          <Link href="/login">
            <button className="bg-white text-purple-600 font-bold py-4 px-24 rounded-full hover:bg-opacity-90 transition duration-300 text-xl">
              Get Started
            </button>
          </Link>
          <div className="mt-4">
            <Link href="/explore">
              <RainbowButton className="bg-white text-white font-bold py-8 px-10 rounded-full hover:bg-opacity-90 transition duration-300 text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Start Exploring
              </RainbowButton>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

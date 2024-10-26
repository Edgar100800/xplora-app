"use client";

import React from "react";
import { SignUpForm } from "./components/SignUpForm";
import { useTheme } from 'next-themes'
import { BiSun } from "react-icons/bi"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FaMoon } from "react-icons/fa6"
import Background from "@/components/auth/Background";

const SignUpPage = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          className={cn(
            "absolute right-4 top-4 md:right-8 md:top-8",
            'text-white dark:text-black',
            'bg-black dark:bg-white',
            'hover:bg-gray-800 dark:hover:bg-gray-200',
            'p-4',
            'text-xl'
          )}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <FaMoon size={32} /> : <BiSun size={32} />}
        </Button>
        <Background />
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;

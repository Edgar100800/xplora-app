"use client";

import React from 'react'
import { LoginForm } from './components/LoginForm'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FaMoon } from "react-icons/fa6"
import { BiSun } from "react-icons/bi"
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const LoginPage = () => {
  const { theme, setTheme } = useTheme()

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
        <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          {/* Imagen de fondo que cubre todo el div */}
          <Image
            className="absolute inset-0 w-full h-full object-cover brightness-50"
            alt="bg"
            src="/background/bg.webp"
            width={1280}
            height={843}
          />

          {/* Contenido del div */}
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Xplora
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { createClient } from '@/utils/supabase/client'
// import { createClient } from '@/utils/supabase/client'
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])

  return (
    <div className="relative bg-[#F5E6D3] min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23997B66' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#4A3728] mb-6">
            AI-Powered To-Do List
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-[#6B5744] mb-8 max-w-3xl mx-auto">
            Organize your tasks effortlessly with the power of artificial intelligence
          </p>
          <Button onClick={() => router.push('/login')} className="bg-[#8C7A6B] hover:bg-[#6B5744] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#E8D5B5] to-transparent" />
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#D9C4A9] opacity-50 animate-float" />
        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-[#BFA98F] opacity-50 animate-float animation-delay-1000" />
      </main>
    </div>
  );
}

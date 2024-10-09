'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = () => {
    window.location.href = '/login'
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-[#8C7A6B] p-4 text-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">AI Todo</Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">Hello, {user.email}</span>
              <Link href="/dashboard" className="mr-4">
                <Button>Dashboard</Button>
              </Link>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <Button onClick={handleSignIn}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  )
}
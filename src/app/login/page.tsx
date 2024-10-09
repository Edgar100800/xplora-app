'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error('Error signing up:', error.message)
      setError(error.message)
    } else if (data.user) {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: data.user.id,
          username, 
          email, 
          password 
        }),
      })

      if (response.ok) {
        console.log('User created in database')
        router.push('/dashboard')
      } else {
        console.error('Failed to create user in database')
        setError('Failed to create user in database')
      }
    }
    setIsLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Error signing in:', error.message)
      setError(error.message)
    } else if (data.user) {
      console.log('User signed in:', data.user.id)
      router.push('/dashboard')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          {isSignUp && (
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-[#8C7A6B] hover:bg-[#6B5744] text-white mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>
        <div className="text-center">
          <p className="mb-2">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <Button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="bg-transparent hover:bg-[#F5E6D3] text-[#8C7A6B] font-semibold hover:text-[#6B5744] py-2 px-4 border border-[#8C7A6B] hover:border-transparent rounded"
            disabled={isLoading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  )
}
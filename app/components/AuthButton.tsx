'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthButtonProps {
  user: User | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in:', error)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    setLoading(false)
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground/80">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-foreground/10 hover:bg-foreground/20 text-foreground px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="bg-jade hover:bg-jade-dark text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Sign In with Google'}
    </button>
  )
}

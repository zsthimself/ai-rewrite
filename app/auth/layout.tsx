"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Redirect authenticated users to account page
  useEffect(() => {
    if (isLoaded && user) {
      router.push('/account')
    }
  }, [user, isLoaded, router])

  // If loading or user is authenticated, show nothing (will redirect)
  if (!isLoaded || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth pages for non-authenticated users
  return children
} 
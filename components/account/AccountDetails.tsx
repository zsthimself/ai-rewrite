"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'

export function AccountDetails() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>
          View and manage your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || 'Not available'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Account Type</p>
          <p className="text-sm text-muted-foreground">
            {user?.publicMetadata?.plan === 'premium' ? 'Premium' : 'Free'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">User ID</p>
          <p className="text-sm text-muted-foreground truncate">
            {user?.id || 'Not available'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/auth/reset-password')}>
          Change Password
        </Button>
        <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </CardFooter>
    </Card>
  )
} 
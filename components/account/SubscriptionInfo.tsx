"use client"

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'

export function SubscriptionInfo() {
  const { user } = useUser();

  // Check premium status from Clerk's publicMetadata
  const isPremium = user?.publicMetadata?.plan === 'premium';
  
  // Default usage limits for free users
  const defaultWordLimit = 1000;
  const defaultChecksLimit = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Current Plan</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              {isPremium ? 'Premium' : 'Free'}
            </p>
            {isPremium && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
        </div>

        {isPremium ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-medium">Features</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Unlimited paraphrasing</li>
                <li>Unlimited grammar checks</li>
                <li>Advanced AI models</li>
                <li>Priority support</li>
              </ul>
            </div>
            {/* In a real app, we'd display billing info here */}
            <div className="space-y-1">
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm text-muted-foreground">
                December 1, 2025
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Upgrade to Premium</p>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Unlimited paraphrasing (currently limited to {defaultWordLimit} words)</li>
              <li>Unlimited grammar checks (currently limited to {defaultChecksLimit} checks)</li>
              <li>Access to advanced AI models</li>
              <li>Priority support</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPremium ? (
          <Button className="w-full" variant="outline">
            Manage Subscription
          </Button>
        ) : (
          <Button className="w-full">
            Upgrade to Premium
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 
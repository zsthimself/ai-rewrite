"use client"

import { useUser } from '@clerk/nextjs'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function UsageStats() {
  const { user } = useUser();
  
  // Default limits for free users
  const paraphraseLimit = 1000; // words
  const grammarChecksLimit = 5; // checks

  // In a real app, these would come from the user's actual usage data
  const paraphraseUsed = 450; // words
  const grammarChecksUsed = 2; // checks

  // Check if user is premium from Clerk's publicMetadata
  const isPremium = user?.publicMetadata?.plan === 'premium';

  // Calculate percentages for progress bars
  const paraphrasePercentage = Math.min(100, (paraphraseUsed / paraphraseLimit) * 100);
  const grammarPercentage = Math.min(100, (grammarChecksUsed / grammarChecksLimit) * 100);

  // Determine if usage limits are approaching
  const isParaphraseWarning = paraphrasePercentage > 80;
  const isGrammarWarning = grammarPercentage > 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>
          Track your current usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Paraphrasing</p>
            <p className={`text-sm ${isParaphraseWarning ? 'text-amber-600' : 'text-muted-foreground'}`}>
              {paraphraseUsed} / {isPremium ? '∞' : paraphraseLimit} words
            </p>
          </div>
          <Progress value={isPremium ? 0 : paraphrasePercentage} 
            className={isParaphraseWarning && !isPremium ? 'bg-amber-100' : ''} 
            indicatorClassName={isParaphraseWarning && !isPremium ? 'bg-amber-500' : ''} 
          />
          {isParaphraseWarning && !isPremium && (
            <p className="text-xs text-amber-600">
              You're approaching your monthly limit. Consider upgrading to Premium for unlimited usage.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Grammar Checks</p>
            <p className={`text-sm ${isGrammarWarning ? 'text-amber-600' : 'text-muted-foreground'}`}>
              {grammarChecksUsed} / {isPremium ? '∞' : grammarChecksLimit} checks
            </p>
          </div>
          <Progress value={isPremium ? 0 : grammarPercentage} 
            className={isGrammarWarning && !isPremium ? 'bg-amber-100' : ''} 
            indicatorClassName={isGrammarWarning && !isPremium ? 'bg-amber-500' : ''} 
          />
          {isGrammarWarning && !isPremium && (
            <p className="text-xs text-amber-600">
              You're approaching your monthly limit. Consider upgrading to Premium for unlimited usage.
            </p>
          )}
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">
            {isPremium ? (
              <span>Thank you for being a Premium subscriber! You have unlimited access to all features.</span>
            ) : (
              <span>Upgrade to Premium for unlimited usage of all features and advanced AI capabilities.</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
import { useState, useEffect } from 'react'
import { User, Loader2, CheckCircle2 } from 'lucide-react'
import { useSession, authClient } from '@/lib/auth-client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ProfileForm() {
  const { data: session, isPending: isSessionLoading } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Initialize form state from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
    }
  }, [session])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const result = await authClient.updateUser({
        name,
        // image is not included in this version - can be added later for avatar upload
      })

      if (result.error) {
        setError(result.error.message || 'Failed to update profile')
      } else {
        setSuccessMessage('Profile updated successfully')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Profile update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSessionLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-24" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your personal information and profile settings
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="border-green-500 text-green-700 dark:text-green-300">
              <CheckCircle2 className="size-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed
            </p>
          </div>

          {/* Avatar upload placeholder - can be implemented later */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <User className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Avatar upload coming soon
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            disabled={isLoading || name === (session?.user?.name || '')}
          >
            {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

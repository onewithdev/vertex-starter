import { useState, useEffect } from 'react'
import { Building2, Loader2, CheckCircle2, Users, Crown } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState } from '@/components/shared/empty-state'
import { appConfig } from '@/config/app.config'

interface Member {
  _id: string
  role: string
  createdAt: number
  user: {
    id: string
    name?: string
    email: string
    image?: string
  } | null
}

export function OrgSettingsForm() {
  // Skip queries if auth is disabled - similar to how ProfileForm handles no-auth
  const shouldSkipQueries = !appConfig.auth.enabled
  const orgData = useQuery(api.users.getCurrentWithOrg, shouldSkipQueries ? 'skip' : {})
  const members = useQuery(api.organizations.getMembers, orgData?.organization ? {} : 'skip')

  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const organization = orgData?.organization
  const membership = orgData?.membership
  const isOwnerOrAdmin = membership?.role === 'owner' || membership?.role === 'admin'

  // Initialize form state from organization data
  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || '')
      setOrgSlug(organization.slug || '')
    }
  }, [organization])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const updateOrganization = useMutation(api.organizations.updateOrganization)

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      await updateOrganization({
        name: orgName,
        slug: orgSlug,
      })
      setSuccessMessage('Organization updated successfully')
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred')
      console.error('Organization update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default'
      case 'admin':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getMemberInitials = (name: string | undefined, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.charAt(0).toUpperCase()
  }

  // No-auth mode - show appropriate empty state
  if (shouldSkipQueries) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Building2}
            title="Organization Settings Unavailable"
            description="Authentication is disabled. Organization settings require user authentication to manage."
          />
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (orgData === undefined || (organization && members === undefined)) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // No organization state
  if (!organization) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Building2}
            title="No Organization"
            description="You are not currently a member of any organization."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Organization Details
          </CardTitle>
          <CardDescription>
            Manage your organization name and settings
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateOrg}>
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
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter organization name"
                disabled={isLoading || !isOwnerOrAdmin}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgSlug">Organization Slug</Label>
              <Input
                id="orgSlug"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                placeholder="enter-slug-here"
                disabled={isLoading || !isOwnerOrAdmin}
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs and API requests
              </p>
            </div>
          </CardContent>
          {isOwnerOrAdmin && (
            <CardFooter>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (orgName === (organization.name || '') &&
                    orgSlug === (organization.slug || ''))
                }
              >
                {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>

      {/* Organization Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Organization Members
          </CardTitle>
          <CardDescription>
            View and manage members of your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Members"
                description="There are no members in this organization yet."
              />
            ) : (
              members.map((member: Member, index: number) => (
                <div key={member._id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {member.user?.image && (
                          <AvatarImage
                            src={member.user.image}
                            alt={member.user.name || member.user.email}
                          />
                        )}
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                          {member.user
                            ? getMemberInitials(
                                member.user.name,
                                member.user.email
                              )
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.user?.name || member.user?.email}
                        </p>
                        {member.user?.name && (
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.role === 'owner' && (
                        <Crown className="size-4 text-yellow-500" />
                      )}
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  {index < members.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createFileRoute, redirect, Outlet, useNavigate, useLocation, Link } from '@tanstack/react-router'
import { Navbar } from '@/components/navigation/navbar'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'
import { appConfig } from '@/config/app.config'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, ArrowRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/api'

export const Route = createFileRoute('/app/_layout')({
  beforeLoad: async ({ context, location }) => {
    // Skip auth check if auth feature is disabled
    if (!appConfig.auth.enabled) {
      return
    }

    // Check if user is authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AppLayoutComponent,
})

interface OrganizationWithRole {
  organization: {
    _id: string
    name: string
  } | null
  membershipRole: string
  joinedAt: number
}

function AppLayoutComponent() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const organizations = useQuery(
    api.organizations.listForUser,
    appConfig.auth.enabled ? {} : 'skip'
  ) as OrganizationWithRole[] | undefined

  useEffect(() => {
    // Skip session validation if auth is disabled
    if (!appConfig.auth.enabled) {
      return
    }

    // Handle late session resolution - redirect if user is not authenticated
    if (!isPending && !session?.user) {
      navigate({ 
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
  }, [session, isPending, navigate, location.href])

  const showNoOrgBanner = appConfig.auth.enabled && organizations?.length === 0

  return (
    <Navbar>
      {showNoOrgBanner && (
        <Alert className="mx-4 mt-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
          <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="flex items-center justify-between">
            <span>You're not part of any organization yet.</span>
            <Link
              to="/settings/org"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Create organization
              <ArrowRight className="size-4" />
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <div className="container mx-auto py-6 px-4">
        <Outlet />
      </div>
    </Navbar>
  )
}

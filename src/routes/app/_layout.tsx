import { createFileRoute, redirect, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { Sidebar } from '@/components/navigation/sidebar'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'

export const Route = createFileRoute('/app/_layout')({
  beforeLoad: async ({ context, location }) => {
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

function AppLayoutComponent() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
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

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  )
}

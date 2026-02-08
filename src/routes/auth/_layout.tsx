import { createFileRoute, redirect, Outlet, useNavigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/_layout')({
  beforeLoad: async ({ context }) => {
    // Redirect authenticated users to the app
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/app',
      })
    }
  },
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    // Handle late session resolution - redirect if user becomes authenticated
    if (!isPending && session?.user) {
      navigate({ to: '/app' })
    }
  }, [session, isPending, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Gradient decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

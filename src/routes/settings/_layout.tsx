import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/_layout')({
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
  component: SettingsLayoutComponent,
})

function SettingsLayoutComponent() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>
      <Outlet />
    </div>
  )
}

import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/profile')({
  component: ProfileRedirect,
})

function ProfileRedirect() {
  // Redirect to main settings page which defaults to profile tab
  return <Navigate to="/settings" />
}

import { Shield, Key, Smartphone, Monitor, Trash2, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { useState } from 'react'

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)

  // Placeholder handlers for future implementation
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Placeholder - will be implemented when Better Auth password API is ready
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Key className="size-4" />
              Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Update Password
              </Button>
              <p className="text-xs text-muted-foreground">
                Password change functionality coming soon
              </p>
            </form>
          </div>

          <Separator />

          {/* Two-Factor Authentication Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Smartphone className="size-4" />
              Two-Factor Authentication
            </h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="mt-4">
                <Button variant="outline" disabled>
                  Enable 2FA
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Two-factor authentication coming soon
              </p>
            </div>
          </div>

          <Separator />

          {/* Active Sessions Section */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Monitor className="size-4" />
              Active Sessions
            </h3>
            <div className="rounded-lg border border-dashed p-6">
              <EmptyState
                icon={Monitor}
                title="Session Management"
                description="View and manage your active sessions across devices."
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Session management coming soon
              </p>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-destructive">Danger Zone</h3>
            <div className="rounded-lg border border-destructive/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  <Trash2 className="size-4 mr-2" />
                  Delete Account
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Account deletion coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

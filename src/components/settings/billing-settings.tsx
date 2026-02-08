import { CreditCard, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/shared/empty-state'

export function BillingSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Billing & Subscription
          </CardTitle>
          <CardDescription>
            Manage your billing information and subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Placeholder */}
          <div>
            <h3 className="text-sm font-medium mb-3">Current Plan</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Free Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Basic features for individuals
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Upgrade
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method Placeholder */}
          <div>
            <h3 className="text-sm font-medium mb-3">Payment Method</h3>
            <div className="rounded-lg border border-dashed p-8">
              <EmptyState
                icon={CreditCard}
                title="No Payment Method"
                description="Add a payment method to upgrade your plan."
                action={{
                  label: 'Add Payment Method',
                  onClick: () => {
                    // Placeholder for future implementation
                    console.log('Add payment method clicked')
                  },
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Billing History Placeholder */}
          <div>
            <h3 className="text-sm font-medium mb-3">Billing History</h3>
            <div className="rounded-lg border border-dashed p-8">
              <EmptyState
                icon={Sparkles}
                title="No Billing History"
                description="Your invoices and receipts will appear here."
              />
            </div>
          </div>

          <Separator />

          {/* Coming Soon Notice */}
          <div className="rounded-lg bg-muted p-4 text-center">
            <Sparkles className="size-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Billing features are coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

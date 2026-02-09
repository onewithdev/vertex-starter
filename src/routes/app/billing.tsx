import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/billing')({
  component: BillingComponent,
})

function BillingComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Billing</h1>
      <p className="text-muted-foreground">Your billing information will appear here.</p>
    </div>
  )
}

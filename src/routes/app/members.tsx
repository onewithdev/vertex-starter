import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/members')({
  component: MembersComponent,
})

function MembersComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Members</h1>
      <p className="text-muted-foreground">Workspace members will appear here.</p>
    </div>
  )
}

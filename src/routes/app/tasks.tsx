import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/tasks')({
  component: TasksComponent,
})

function TasksComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Tasks</h1>
      <p className="text-muted-foreground">Your tasks will appear here.</p>
    </div>
  )
}

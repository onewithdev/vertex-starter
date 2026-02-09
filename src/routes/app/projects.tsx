import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      <p className="text-muted-foreground">Your projects will appear here.</p>
    </div>
  )
}

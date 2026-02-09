import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@/convex/api'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, FolderKanban, CheckSquare, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/app/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const userData = useQuery(api.users.getCurrentWithOrg)

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        {userData === undefined ? (
          <>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {userData?.user?.name || userData?.user?.email || 'Guest'}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your workspace and recent activity.
            </p>
          </>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Projects"
          value={12}
          description="Active projects this month"
          icon={FolderKanban}
          trend="+2"
          loading={userData === undefined}
        />
        <MetricCard
          title="Tasks Completed"
          value={48}
          description="Tasks completed this week"
          icon={CheckSquare}
          trend="+8"
          loading={userData === undefined}
        />
        <MetricCard
          title="Team Members"
          value={6}
          description="Active team members"
          icon={Users}
          trend="+1"
          loading={userData === undefined}
        />
        <MetricCard
          title="Productivity"
          value={92}
          description="Efficiency score"
          icon={TrendingUp}
          trend="+5%"
          loading={userData === undefined}
        />
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {userData === undefined ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <ActivityItem
                  title="Project created"
                  description="You created a new project 'Marketing Campaign'"
                  time="2 hours ago"
                />
                <ActivityItem
                  title="Task completed"
                  description="You completed 'Design homepage mockups'"
                  time="5 hours ago"
                />
                <ActivityItem
                  title="Team invitation sent"
                  description="You invited sarah@example.com to join"
                  time="1 day ago"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userData === undefined ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              <>
                <StatBar label="Tasks Done" value={75} max={100} />
                <StatBar label="Projects Progress" value={60} max={100} />
                <StatBar label="Team Collaboration" value={85} max={100} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend: string
  loading?: boolean
}

function MetricCard({ title, value, description, icon: Icon, trend, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          <span className="text-xs text-emerald-500 font-medium">{trend}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  title: string
  description: string
  time: string
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  )
}

interface StatBarProps {
  label: string
  value: number
  max: number
}

function StatBar({ label, value, max }: StatBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

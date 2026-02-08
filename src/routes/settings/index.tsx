import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { User, Building2, CreditCard, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFeatures } from '@/hooks/use-app-config'
import { ProfileForm } from '@/components/settings/profile-form'
import { OrgSettingsForm } from '@/components/settings/org-settings-form'
import { BillingSettings } from '@/components/settings/billing-settings'
import { SecuritySettings } from '@/components/settings/security-settings'

interface TabConfig {
  id: string
  label: string
  icon: React.ElementType
  component: React.ComponentType
  featureFlag?: boolean
}

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const features = useFeatures()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs: TabConfig[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      component: ProfileForm,
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
      component: OrgSettingsForm,
      featureFlag: features.multiTenant,
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      component: BillingSettings,
      featureFlag: features.billing,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      component: SecuritySettings,
    },
  ]

  // Filter tabs based on feature flags
  const visibleTabs = tabs.filter((tab) =>
    tab.featureFlag === undefined ? true : tab.featureFlag
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="w-full justify-start">
        {visibleTabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
            <tab.icon className="size-4" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {visibleTabs.map((tab) => {
        const Component = tab.component
        return (
          <TabsContent key={tab.id} value={tab.id}>
            <Component />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

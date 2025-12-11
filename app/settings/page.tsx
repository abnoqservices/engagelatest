"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Bell, Shield, Palette, Globe, CreditCard, Users, Key, Upload } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface CompanyInfo {
  name: string
  industry: string
  website: string
  description: string
  timezone: string
  language: string
  logo: string
}

interface BrandingInfo {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  emailHeader: string
  emailFooter: string
}

interface NotificationSettings {
  newLead: boolean
  eventRegistrations: boolean
  qrScans: boolean
  campaignPerformance: boolean
  formSubmissions: boolean
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

interface ApiKey {
  name: string
  key: string
}

interface BillingPlan {
  name: string
  price: string
  features: string[]
}

interface PaymentMethod {
  lastFour: string
  expiry: string
}

interface Invoice {
  date: string
  amount: string
  status: string
}

export default function SettingsPage() {
  const { toast } = useToast()

  // General Tab State
  const [companyInfo, setCompanyInfo] = React.useState<CompanyInfo>({
    name: '',
    industry: '',
    website: '',
    description: '',
    timezone: 'utc',
    language: 'en',
    logo: '/placeholder.svg'
  })

  // Branding Tab State
  const [brandingInfo, setBrandingInfo] = React.useState<BrandingInfo>({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    fontFamily: 'inter',
    emailHeader: '',
    emailFooter: ''
  })

  // Notifications Tab State
  const [notifications, setNotifications] = React.useState<NotificationSettings>({
    newLead: true,
    eventRegistrations: true,
    qrScans: true,
    campaignPerformance: false,
    formSubmissions: false
  })

  // Team Tab State
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([])

  // Security Tab State
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [twoFAEnabled, setTwoFAEnabled] = React.useState(false)
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([
    { name: 'Production Key', key: 'sk_live_••••••••••••••••••••1234' }
  ])

  // Billing Tab State
  const [currentPlan, setCurrentPlan] = React.useState<BillingPlan>({
    name: 'Professional',
    price: '$99',
    features: [
      'Unlimited products and events',
      'Advanced analytics',
      'Priority support'
    ]
  })
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>({
    lastFour: '4242',
    expiry: '12/25'
  })
  const [billingHistory, setBillingHistory] = React.useState<Invoice[]>([])

  // Sample API functions (mocked with JSON for testing)
  const mockApi = {
    fetchCompanyInfo: () => Promise.resolve({
      name: 'Your Company Inc.',
      industry: 'tech',
      website: 'https://yourcompany.com',
      description: 'Brief description of your company...',
      timezone: 'utc',
      language: 'en',
      logo: '/placeholder.svg'
    } as CompanyInfo),

    updateCompanyInfo: (data: CompanyInfo) => {
      console.log('Updating company info:', data)
      return Promise.resolve({ success: true })
    },

    fetchBrandingInfo: () => Promise.resolve({
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      fontFamily: 'inter',
      emailHeader: 'Header text...',
      emailFooter: 'Footer text...'
    } as BrandingInfo),

    updateBrandingInfo: (data: BrandingInfo) => {
      console.log('Updating branding info:', data)
      return Promise.resolve({ success: true })
    },

    fetchNotifications: () => Promise.resolve({
      newLead: true,
      eventRegistrations: true,
      qrScans: true,
      campaignPerformance: false,
      formSubmissions: false
    } as NotificationSettings),

    updateNotifications: (data: NotificationSettings) => {
      console.log('Updating notifications:', data)
      return Promise.resolve({ success: true })
    },

    fetchTeamMembers: () => Promise.resolve([
      { id: '1', name: 'John Smith', email: 'john@company.com', role: 'admin', avatar: 'JS' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'editor', avatar: 'SJ' },
      { id: '3', name: 'Michael Chen', email: 'michael@company.com', role: 'viewer', avatar: 'MC' }
    ] as TeamMember[]),

    inviteTeamMember: (email: string) => {
      console.log('Inviting team member:', email)
      return Promise.resolve({ success: true, newMember: { id: Date.now().toString(), name: 'New Member', email, role: 'viewer', avatar: 'NM' } })
    },

    updateTeamMemberRole: (id: string, role: string) => {
      console.log('Updating role for member:', id, role)
      return Promise.resolve({ success: true })
    },

    removeTeamMember: (id: string) => {
      console.log('Removing member:', id)
      return Promise.resolve({ success: true })
    },

    updatePassword: (current: string, newPass: string) => {
      console.log('Updating password from', current, 'to', newPass)
      return Promise.resolve({ success: true })
    },

    toggleTwoFA: (enabled: boolean) => {
      console.log('Toggling 2FA:', enabled)
      return Promise.resolve({ success: true })
    },

    regenerateApiKey: (name: string) => {
      console.log('Regenerating key:', name)
      return Promise.resolve({ newKey: `sk_live_••••••••••••••••••••${Math.floor(Math.random() * 10000)}` })
    },

    createApiKey: () => {
      console.log('Creating new API key')
      return Promise.resolve({ name: 'New Key', key: `sk_live_••••••••••••••••••••${Math.floor(Math.random() * 10000)}` })
    },

    fetchBillingPlan: () => Promise.resolve({
      name: 'Professional',
      price: '$99',
      features: [
        'Unlimited products and events',
        'Advanced analytics',
        'Priority support'
      ]
    } as BillingPlan),

    fetchPaymentMethod: () => Promise.resolve({
      lastFour: '4242',
      expiry: '12/25'
    } as PaymentMethod),

    fetchBillingHistory: () => Promise.resolve([
      { date: 'March 1, 2024', amount: '$99.00', status: 'Paid' },
      { date: 'February 1, 2024', amount: '$99.00', status: 'Paid' },
      { date: 'January 1, 2024', amount: '$99.00', status: 'Paid' }
    ] as Invoice[]),

    changePlan: () => {
      console.log('Changing plan')
      return Promise.resolve({ success: true })
    },

    cancelSubscription: () => {
      console.log('Cancelling subscription')
      return Promise.resolve({ success: true })
    },

    updatePaymentMethod: () => {
      console.log('Updating payment method')
      return Promise.resolve({ success: true })
    },

    downloadInvoice: (date: string) => {
      console.log('Downloading invoice for:', date)
      return Promise.resolve({ success: true })
    }
  }

  // Fetch initial data on mount
  React.useEffect(() => {
    mockApi.fetchCompanyInfo().then(setCompanyInfo)
    mockApi.fetchBrandingInfo().then(setBrandingInfo)
    mockApi.fetchNotifications().then(setNotifications)
    mockApi.fetchTeamMembers().then(setTeamMembers)
    mockApi.fetchBillingPlan().then(setCurrentPlan)
    mockApi.fetchPaymentMethod().then(setPaymentMethod)
    mockApi.fetchBillingHistory().then(setBillingHistory)
  }, [])

  // Handlers
  const handleSaveCompanyChanges = async () => {
    try {
      await mockApi.updateCompanyInfo(companyInfo)
      toast({ title: 'Success', description: 'Company information updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setCompanyInfo(prev => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBranding = async () => {
    try {
      await mockApi.updateBrandingInfo(brandingInfo)
      toast({ title: 'Success', description: 'Branding updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleNotificationToggle = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    try {
      await mockApi.updateNotifications(updated)
      toast({ title: 'Success', description: 'Notification settings updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleInviteMember = async () => {
    const email = prompt('Enter email to invite:')
    if (email) {
      try {
        const { newMember } = await mockApi.inviteTeamMember(email)
        setTeamMembers(prev => [...prev, newMember])
        toast({ title: 'Success', description: 'Member invited' })
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to invite', variant: 'destructive' })
      }
    }
  }

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await mockApi.updateTeamMemberRole(id, role)
      setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
      toast({ title: 'Success', description: 'Role updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleRemoveMember = async (id: string) => {
    try {
      await mockApi.removeTeamMember(id)
      setTeamMembers(prev => prev.filter(m => m.id !== id))
      toast({ title: 'Success', description: 'Member removed' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove', variant: 'destructive' })
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' })
      return
    }
    try {
      await mockApi.updatePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast({ title: 'Success', description: 'Password updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleToggleTwoFA = async (enabled: boolean) => {
    setTwoFAEnabled(enabled)
    try {
      await mockApi.toggleTwoFA(enabled)
      toast({ title: 'Success', description: '2FA updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleRegenerateKey = async (name: string) => {
    try {
      const { newKey } = await mockApi.regenerateApiKey(name)
      setApiKeys(prev => prev.map(k => k.name === name ? { ...k, key: newKey } : k))
      toast({ title: 'Success', description: 'Key regenerated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to regenerate', variant: 'destructive' })
    }
  }

  const handleCreateNewKey = async () => {
    try {
      const newKey = await mockApi.createApiKey()
      setApiKeys(prev => [...prev, newKey])
      toast({ title: 'Success', description: 'New key created' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' })
    }
  }

  const handleChangePlan = async () => {
    try {
      await mockApi.changePlan()
      toast({ title: 'Success', description: 'Plan change requested' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to change plan', variant: 'destructive' })
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await mockApi.cancelSubscription()
      toast({ title: 'Success', description: 'Subscription cancelled' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel', variant: 'destructive' })
    }
  }

  const handleUpdatePayment = async () => {
    try {
      await mockApi.updatePaymentMethod()
      toast({ title: 'Success', description: 'Payment method updated' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleDownloadInvoice = async (date: string) => {
    try {
      await mockApi.downloadInvoice(date)
      toast({ title: 'Success', description: 'Invoice downloaded' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download', variant: 'destructive' })
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company profile and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={companyInfo.logo} />
                    <AvatarFallback>CO</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <label>
                        <Upload className="h-4 w-4" />
                        Upload Logo
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 512x512px, PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={companyInfo.name}
                      onChange={e => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={companyInfo.industry}
                      onValueChange={value => setCompanyInfo(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    type="url" 
                    value={companyInfo.website}
                    onChange={e => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyInfo.description}
                    onChange={e => setCompanyInfo(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={companyInfo.timezone}
                      onValueChange={value => setCompanyInfo(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={companyInfo.language}
                      onValueChange={value => setCompanyInfo(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveCompanyChanges}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Customize your brand identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={brandingInfo.primaryColor}
                        onChange={e => setBrandingInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input value={brandingInfo.primaryColor} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={brandingInfo.secondaryColor}
                        onChange={e => setBrandingInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input value={brandingInfo.secondaryColor} readOnly className="flex-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select 
                    value={brandingInfo.fontFamily}
                    onValueChange={value => setBrandingInfo(prev => ({ ...prev, fontFamily: value }))}
                  >
                    <SelectTrigger id="font-family">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveBranding}>Save Branding</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Customize email header and footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-header">Email Header</Label>
                  <Textarea 
                    id="email-header" 
                    rows={3} 
                    value={brandingInfo.emailHeader}
                    onChange={e => setBrandingInfo(prev => ({ ...prev, emailHeader: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-footer">Email Footer</Label>
                  <Textarea 
                    id="email-footer" 
                    rows={3} 
                    value={brandingInfo.emailFooter}
                    onChange={e => setBrandingInfo(prev => ({ ...prev, emailFooter: e.target.value }))}
                  />
                </div>
                <Button variant="outline" onClick={handleSaveBranding}>Save Templates</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'newLead' as const, label: "New lead captured", description: "Get notified when a new lead is generated" },
                  { key: 'eventRegistrations' as const, label: "Event registrations", description: "Receive alerts for new event sign-ups" },
                  { key: 'qrScans' as const, label: "QR code scans", description: "Daily summary of QR code activity" },
                  { key: 'campaignPerformance' as const, label: "Campaign performance", description: "Weekly campaign performance reports" },
                  { key: 'formSubmissions' as const, label: "Form submissions", description: "Instant notifications for form fills" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch 
                      checked={notifications[item.key]} 
                      onCheckedChange={value => handleNotificationToggle(item.key, value)} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team access and roles</CardDescription>
                  </div>
                  <Button onClick={handleInviteMember}>Invite Member</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={member.role}
                        onValueChange={value => handleUpdateRole(member.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app to generate codes
                    </p>
                  </div>
                  <Switch 
                    checked={twoFAEnabled} 
                    onCheckedChange={handleToggleTwoFA} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API access keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((key, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{key.name}</p>
                      <Button variant="outline" size="sm" onClick={() => handleRegenerateKey(key.name)}>Regenerate</Button>
                    </div>
                    <code className="block rounded bg-secondary p-2 text-sm font-mono">
                      {key.key}
                    </code>
                  </div>
                ))}
                <Button variant="outline" onClick={handleCreateNewKey}>Create New Key</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      <p className="text-sm text-muted-foreground">Billed monthly</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{currentPlan.price}</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {currentPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={handleChangePlan}>Change Plan</Button>
                    <Button variant="outline" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Update your billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• {paymentMethod.lastFour}</p>
                      <p className="text-sm text-muted-foreground">Expires {paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleUpdatePayment}>Update</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {billingHistory.map((invoice, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">{invoice.status}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{invoice.amount}</p>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.date)}>Download</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
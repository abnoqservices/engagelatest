"use client"
import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, Settings, Plug, Loader2, Trash2 } from 'lucide-react'
import axiosClient from "@/lib/axiosClient"
import { showToast } from "@/lib/showToast"
import HubSpotLoginButton from '@/components/HubSpotLoginButton'
import LeadsManager from '@/components/LeadsManager';
interface WhatsAppAccount {
  id: number
  phone_number: string
  status: 'connected' | 'disconnected' | 'expired'
  business_account_name?: string
  created_at?: string
}

export default function IntegrationsPage() {

  const [whatsappAccounts, setWhatsappAccounts] = useState<WhatsAppAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [accountToDisconnect, setAccountToDisconnect] = useState<number | null>(null)

  // HubSpot state
  const [hubspotConnected, setHubspotConnected] = useState(false)
  const [hubspotExpiry, setHubspotExpiry] = useState<number | null>(null)
  const [hubspotToken, setHubspotToken] = useState<string | null>(null) // better as string
  const [hubspotStatusLoading, setHubspotStatusLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("communication");
  
  // ────────────────────────────────────────────────
  // Fetch HubSpot status
  // ────────────────────────────────────────────────
  const fetchHubSpotStatus = useCallback(async () => {
    try {
      setHubspotStatusLoading(true)
      const res = await fetch("/api/hubspot/status")
      if (!res.ok) throw new Error("Status fetch failed")
      
      const data = await res.json()
      
      setHubspotConnected(!!data.connected)
      setHubspotExpiry(data.expiresIn ?? null)
      setHubspotToken(data.token ?? null)

      // Optional: show current status on load (only once)
      if (data.connected) {
        showToast("HubSpot is connected", "success")
      }
    } catch (err) {
      console.error("Failed to fetch HubSpot status", err)
      showToast("Could not check HubSpot connection status", "error")
    } finally {
      setHubspotStatusLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHubSpotStatus()

    const params = new URLSearchParams(window.location.search)

    /* CRM TAB ACTIVATION */
    const tabParam = params.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1954879162132993",
        cookie: true,
        xfbml: true,
        version: "v24.0",
      })
    }

    ;(function (d: any, s: any, id: any) {
      if (d.getElementById(id)) return
      const js = d.createElement(s)
      js.id = id
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      d.getElementsByTagName(s)[0].parentNode.insertBefore(js, null)
    })(document, "script", "facebook-jssdk")

    // Handle WhatsApp OAuth callback

    const urlParams = new URLSearchParams(window.location.search)
    const whatsappStatus = urlParams.get('whatsapp')
    if (whatsappStatus === 'connected') {
      showToast('WhatsApp account connected successfully!', 'success')
      // Remove query param from URL
      window.history.replaceState({}, '', '/integrations')
      // Reload accounts
      loadWhatsAppAccounts()
    } else if (whatsappStatus === 'error') {
      const msg = urlParams.get('message') || 'Failed to connect WhatsApp account'
      showToast(msg, 'error')

      window.history.replaceState({}, '', '/integrations')
    }
  }, [fetchHubSpotStatus])

  const loadWhatsAppAccounts = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/whatsapp/accounts')
      if (response.data.success) {
        setWhatsappAccounts(response.data.data || [])
      }
    } catch (error: any) {
      console.error('Failed to load WhatsApp accounts:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleConnectWhatsApp = async () => {
    try {
      setConnecting(true)
      const response = await axiosClient.get('/whatsapp/auth-url')
      if (response.data.success) {
        // Redirect to Meta OAuth
        window.location.href = response.data.data.auth_url
      } else {
        showToast(response.data.message || 'Failed to initiate WhatsApp connection', 'error')
        setConnecting(false)


      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to initiate WhatsApp connection', 'error')
      setConnecting(false)
    }
  }

  const handleDisconnectClick = (accountId: number) => {
    setAccountToDisconnect(accountId)
    setDisconnectDialogOpen(true)
  }

  const handleDisconnect = async () => {
    if (!accountToDisconnect) return

    try {
      await axiosClient.delete(`/whatsapp/accounts/${accountToDisconnect}`)
      showToast('WhatsApp account disconnected', 'success')
      setDisconnectDialogOpen(false)
      setAccountToDisconnect(null)
      loadWhatsAppAccounts()
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to disconnect', 'error')
    }
  }

  // ────────────────────────────────────────────────
  // NEW: Call this when HubSpot disconnect happens
  // (You need to implement disconnect logic in HubSpotLoginButton)
  // ────────────────────────────────────────────────
  const handleHubSpotDisconnectSuccess = () => {
    showToast("HubSpot disconnected successfully", "success")
    fetchHubSpotStatus() // ← refresh status → UI updates
  }

  const isWhatsAppConnected = whatsappAccounts.some(acc => acc.status === 'connected')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect EngageIQ with your CRM, Marketing Automation, and Communication tools
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="crm">CRM Systems</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Automation</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>



          <TabsContent value="crm" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* HubSpot Card – improved */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        HubSpot CRM
                        {hubspotConnected && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {hubspotConnected ? "Connected" : "Not connected"}
                      </CardDescription>
                    </div>
                    <Switch checked={hubspotConnected} disabled />
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm font-medium">Features:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Contacts sync</Badge>
                    <Badge variant="secondary">Deal sync</Badge>
                    <Badge variant="secondary">Workflows</Badge>
                  </div>

                  {hubspotConnected && hubspotExpiry && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Token expires in ~{Math.round(hubspotExpiry / 3600)} hours
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <HubSpotLoginButton
                    connected={hubspotConnected}
                    onDisconnectSuccess={handleHubSpotDisconnectSuccess} // ← new prop
                  />
                </CardFooter>
              </Card>


  {/* Salesforce */}
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">
            Salesforce
          </CardTitle>
          <CardDescription>REST API</CardDescription>
        </div>
        <Switch />
      </div>
    </CardHeader>

    <CardContent>
      <p className="text-sm font-medium">Features:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary" className="text-xs">Contact sync</Badge>
        <Badge variant="secondary" className="text-xs">Campaign attribution</Badge>
      </div>
    </CardContent>

    <CardFooter>
      <Button size="sm" className="w-full">
        <Plug className="h-4 w-4 mr-2" />
        Connect
      </Button>
    </CardFooter>
  </Card>


  {/* Zoho CRM */}
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            Zoho CRM
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardTitle>
          <CardDescription>API</CardDescription>
        </div>
        <Switch checked />
      </div>
    </CardHeader>

    <CardContent>
      <p className="text-sm font-medium">Features:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary" className="text-xs">Lead push</Badge>
        <Badge variant="secondary" className="text-xs">Contact mapping</Badge>
        <Badge variant="secondary" className="text-xs">Field sync</Badge>
      </div>
    </CardContent>

    <CardFooter>
      <Button variant="outline" size="sm" className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        Configure
      </Button>
    </CardFooter>
  </Card>

</div>

            

            {/* CRM Integration Features */}
            <Card>
              <CardHeader>
                <CardTitle>CRM Integration Features</CardTitle>
                <CardDescription>What you get with CRM integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    "Real-time lead push from EngageIQ",
                    "Sync product/event/booth metadata",
                    "Map EngageIQ fields to CRM fields",
                    "Automatic deduplication",
                    "Tag-based routing",
                    "AI-score sync to CRM",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Automation */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Mailchimp", features: ["Email lists", "Auto-tags", "Campaigns"], connected: true },
                { name: "Klaviyo", features: ["E-commerce flows", "Segmentation"], connected: false },
                { name: "ActiveCampaign", features: ["Email/SMS automations", "Lead scoring"], connected: false },
                { name: "Marketo", features: ["Enterprise marketing ops", "Lead programs"], connected: false },
                { name: "Brevo (Sendinblue)", features: ["Transactional emails", "Campaign sync"], connected: true },
                { name: "ConvertKit", features: ["Creator-based campaigns"], connected: false },
                { name: "GetResponse", features: ["Automation workflows", "Funnels"], connected: false },
                { name: "Customer.io", features: ["Event-driven communication"], connected: false },
              ].map((integration, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {integration.name}
                          {integration.connected && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </CardTitle>
                      </div>
                      <Switch checked={integration.connected} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.features.map((feature, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {integration.connected ? (
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full">
                        <Plug className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Communication Platforms */}
          <TabsContent value="communication" className="space-y-6">
            {/* WhatsApp Account Card - Full Width */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      WhatsApp Cloud API
                      {isWhatsAppConnected && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Automated messages & campaigns via WhatsApp Business API
                    </CardDescription>
                  </div>
                  <Switch checked={isWhatsAppConnected} disabled />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : whatsappAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {whatsappAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{account.phone_number}</p>
                            <Badge
                              variant={
                                account.status === 'connected' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {account.status}
                            </Badge>
                          </div>
                          {account.business_account_name && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {account.business_account_name}
                            </p>
                          )}
                          {account.created_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Connected {new Date(account.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnectClick(account.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No WhatsApp accounts connected. Click "Connect WhatsApp" to get started.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isWhatsAppConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleConnectWhatsApp}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plug className="h-4 w-4 mr-2" />
                        Add Another Account
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleConnectWhatsApp}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plug className="h-4 w-4 mr-2" />
                        Connect WhatsApp
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Other Communication Integrations */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "SMS Gateways", purpose: "Transactional notifications", connected: true },
                { name: "Email SMTP Providers", purpose: "Email delivery automation", connected: true },
                { name: "Meta Pixel", purpose: "Retargeting", connected: false },
                { name: "Google Analytics 4", purpose: "Page tracking & conversions", connected: true },
              ].map((integration, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {integration.name}
                          {integration.connected && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">{integration.purpose}</CardDescription>
                      </div>
                      <Switch checked={integration.connected} />
                    </div>
                  </CardHeader>
                  <CardFooter>
                    {integration.connected ? (
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full">
                        <Plug className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Disconnect Confirmation Dialog */}
        <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect WhatsApp Account?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disconnect this WhatsApp account? You won't be able to send
                WhatsApp messages through workflows until you reconnect an account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAccountToDisconnect(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDisconnect}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}

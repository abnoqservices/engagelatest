"use client"

import * as React from "react"
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

interface WhatsAppAccount {
  id: number
  phone_number: string
  status: 'connected' | 'disconnected' | 'expired'
  business_account_name?: string
  created_at?: string
}

export default function IntegrationsPage() {
  const [whatsappAccounts, setWhatsappAccounts] = React.useState<WhatsAppAccount[]>([])
  const [loading, setLoading] = React.useState(false)
  const [connecting, setConnecting] = React.useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = React.useState(false)
  const [accountToDisconnect, setAccountToDisconnect] = React.useState<number | null>(null)
  
  React.useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1954879162132993",
        cookie: true,
        xfbml: true,
        version: "v24.0", // Keep updated — check latest at developers.facebook.com
      });
    };

    (function (d: any, s: any, id: any) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      d.getElementsByTagName(s)[0].parentNode.insertBefore(js, null);
    })(document, "script", "facebook-jssdk");

    loadWhatsAppAccounts()
    
    // Check for OAuth/callback success/error (you can keep or remove depending on future flow)
    const urlParams = new URLSearchParams(window.location.search)
    const whatsappStatus = urlParams.get('whatsapp')
    if (whatsappStatus === 'connected') {
      showToast('WhatsApp account connected successfully!', 'success')
      window.history.replaceState({}, '', '/integrations')
      loadWhatsAppAccounts()
    } else if (whatsappStatus === 'error') {
      const errorMessage = urlParams.get('message') || 'Failed to connect WhatsApp account'
      showToast(errorMessage, 'error')
      window.history.replaceState({}, '', '/integrations')
    }
  }, [])

  const loadWhatsAppAccounts = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/whatsapp/accounts')
      if (response.data.success) {
        setWhatsappAccounts(response.data.data || [])
      }
    } catch (error: any) {
      console.error('Failed to load WhatsApp accounts:', error)
      if (error.response?.status !== 401) {
        showToast('Failed to load WhatsApp accounts', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConnectWhatsApp = () => {
    if (!window.FB) {
      showToast("Facebook SDK not loaded. Please refresh the page.", "error")
      return
    }
  
    setConnecting(true)
  
    window.FB.login(
      function (response: any) {
        setConnecting(false)
  
        if (response.authResponse) {
          console.log("Facebook Access Token:", response.authResponse.accessToken)
          showToast("Facebook login successful — you now need to onboard phone number in Meta dashboard", "success")
          
          // === IMPORTANT ===
          // You can send this short-lived token to backend to exchange for long-lived / debug
          // But Embedded Signup is NOT available → user must onboard manually:
          //
          // 1. Go to: https://business.facebook.com/wa/manage/home
          // 2. Add phone number → follow steps
          // 3. Get Phone Number ID + Permanent Token
          // 4. Send them to your backend via a form or API
          //
          // After that your backend can use Cloud API normally
          
          // Optional: send token to backend anyway (for debugging or other scopes)
          // axiosClient.post('/whatsapp/store-token', { token: response.authResponse.accessToken })
        } else {
          showToast("Login cancelled or failed", "error")
        }
      },
      {
        scope: "business_management,whatsapp_business_management,whatsapp_business_messaging",
        return_scopes: true,
        // IMPORTANT: Removed extras / feature → prevents the BSP/TP error
      }
    )
  }

  const handleDisconnectClick = (accountId: number) => {
    setAccountToDisconnect(accountId)
    setDisconnectDialogOpen(true)
  }

  const handleDisconnect = async () => {
    if (!accountToDisconnect) return

    try {
      await axiosClient.delete(`/whatsapp/accounts/${accountToDisconnect}`)
      showToast('WhatsApp account disconnected successfully', 'success')
      setDisconnectDialogOpen(false)
      setAccountToDisconnect(null)
      loadWhatsAppAccounts()
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to disconnect account', 'error')
    }
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

        <Tabs defaultValue="communication" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crm">CRM Systems</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Automation</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          {/* CRM Integrations – unchanged */}
          <TabsContent value="crm" className="space-y-6">
            {/* ... your existing CRM cards and features card ... */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "HubSpot CRM", type: "API + Webhook", features: ["Contacts sync", "Deal sync", "Workflows"], connected: true },
                { name: "Salesforce", type: "REST API", features: ["Contact sync", "Campaign attribution"], connected: false },
                { name: "Zoho CRM", type: "API", features: ["Lead push", "Contact mapping", "Field sync"], connected: true },
                { name: "Pipedrive", type: "API", features: ["Lead sync", "Activity log push"], connected: false },
                { name: "Freshsales Suite", type: "API", features: ["Smart lead routing", "Pipeline updates"], connected: false },
                { name: "Microsoft Dynamics 365", type: "API", features: ["Enterprise lead sync"], connected: false },
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
                        <CardDescription>{integration.type}</CardDescription>
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

          {/* Marketing Automation – unchanged */}
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
                  <div className="py-6 text-center space-y-4">
                    <p className="text-muted-foreground">
                      No WhatsApp accounts connected yet.
                    </p>
                    <div className="text-sm text-muted-foreground max-w-lg mx-auto">
                      <strong>Quick start (no BSP needed):</strong><br />
                      1. Go to <a href="https://business.facebook.com/wa/manage/home" target="_blank" className="underline">Meta WhatsApp Manager</a><br />
                      2. Add & verify your business phone number<br />
                      3. Get Phone Number ID + Permanent Token<br />
                      4. Add them in your dashboard / send to backend
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
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
                      {isWhatsAppConnected ? "Add Another Account / Re-authenticate" : "Connect WhatsApp"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Other Communication Integrations – unchanged */}
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
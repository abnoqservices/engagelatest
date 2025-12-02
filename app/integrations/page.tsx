import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2, Settings, Plug } from 'lucide-react'

export default function IntegrationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect EngageIQ with your CRM, Marketing Automation, and Communication tools
          </p>
        </div>

        <Tabs defaultValue="crm" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crm">CRM Systems</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Automation</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          {/* CRM Integrations */}
          <TabsContent value="crm" className="space-y-6">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "WhatsApp Cloud API", purpose: "Automated messages & campaigns", connected: false },
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
      </div>
    </DashboardLayout>
  )
}

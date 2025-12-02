"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Play, Pause, Edit, Copy, Trash2, MoreVertical } from 'lucide-react'
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const workflows = {
  draft: [
    {
      id: "1",
      name: "Welcome Email Sequence",
      trigger: "New Lead",
      actions: 3,
      lastEdited: "2 hours ago",
    },
  ],
  active: [
    {
      id: "2",
      name: "Post-Event Follow-up",
      trigger: "Event Attended",
      actions: 5,
      runs: 234,
      lastRun: "5 mins ago",
    },
    {
      id: "3",
      name: "Product Interest Nurture",
      trigger: "QR Code Scanned",
      actions: 4,
      runs: 1056,
      lastRun: "1 hour ago",
    },
  ],
  paused: [
    {
      id: "4",
      name: "VIP Customer Rewards",
      trigger: "Lead Score > 80",
      actions: 6,
      runs: 89,
      lastRun: "2 days ago",
    },
  ],
  archived: [],
}

const statusColors = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-700",
}

export default function WorkflowsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflow Automation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Automate your customer engagement workflows
            </p>
          </div>
          <Link href="/workflows/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </Link>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-6 lg:grid-cols-4">
          {(Object.keys(workflows) as Array<keyof typeof workflows>).map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold capitalize">{status}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {workflows[status].length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {workflows[status].map((workflow) => (
                  <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium leading-tight">
                          <Link href={`/workflows/${workflow.id}`} className="hover:text-primary">
                            {workflow.name}
                          </Link>
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/workflows/${workflow.id}/edit`}>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            {status === "active" && (
                              <DropdownMenuItem>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            {status === "paused" && (
                              <DropdownMenuItem>
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="text-xs">
                        Trigger: {workflow.trigger}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{workflow.actions} actions</span>
                        {"runs" in workflow && (
                          <Badge variant="secondary" className="text-xs">
                            {workflow.runs} runs
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {"lastRun" in workflow ? `Last run: ${workflow.lastRun}` : `Edited: ${workflow.lastEdited}`}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {workflows[status].length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                    <p className="text-sm text-muted-foreground">No workflows</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Builder Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Builder</CardTitle>
            <CardDescription>Drag and drop actions to create automation flows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Click "Create Workflow" to start building your automation
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700">Trigger</div>
                <span>→</span>
                <div className="rounded-lg bg-purple-100 px-3 py-2 text-purple-700">Action</div>
                <span>→</span>
                <div className="rounded-lg bg-green-100 px-3 py-2 text-green-700">Action</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

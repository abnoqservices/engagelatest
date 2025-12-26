// app/dashboard/contacts/create-or-import/page.tsx
'use client'
import { DashboardLayout } from "@/components/dashboard/layout"
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, FileUp, Loader2, Plus, Upload, Users } from 'lucide-react'
import Papa from 'papaparse'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import axiosClient from '@/lib/axiosClient'
import { showToast } from '@/lib/showToast'

// ────────────────────────────────────────────────
// SHARED SCHEMA
// ────────────────────────────────────────────────
const contactSchema = z.object({
  first_name: z.string().max(255).optional().nullable(),
  last_name: z.string().max(255).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  phone: z.string().max(255).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  contact_type: z.enum(['manual', 'manual_bulk_import', 'ai_detection', 'visitor_capture', 'api']).optional(),
  contact_source: z.enum(['dashboard', 'csv_import', 'factors_ai', 'clearbit', 'website', 'product_lp', 'zapier']).optional(),
  identified_at: z.date().optional().nullable(),
  status: z.enum(['active', 'archived']).optional(),
  deduplicate: z.boolean().default(true),
  source_metadata_json: z.string().optional(),
})

type ContactForm = z.infer<typeof contactSchema>

// ────────────────────────────────────────────────
// MANUAL FORM DEFAULTS
// ────────────────────────────────────────────────
const manualDefault: ContactForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: '',
  contact_type: 'manual',
  contact_source: 'dashboard',
  identified_at: undefined,
  status: 'active',
  deduplicate: true,
  source_metadata_json: '',
}

// ────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ────────────────────────────────────────────────
export default function CreateOrImportContactsPage() {
  const router = useRouter()

  // ── Manual creation ─────────────────────────────
  const manualForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: manualDefault,
  })

  const [manualSubmitting, setManualSubmitting] = useState(false)

  const onManualSubmit = async (values: ContactForm) => {
    setManualSubmitting(true)
    const payload = preparePayload(values)

    try {
      const res = await axiosClient.post('/contacts', payload)
      showToast(res.data.message || 'Contact created', 'success')
      router.push(`/dashboard/contacts/${res.data.data.id}`)
    } catch (err: any) {
      handleApiError(err, manualForm.setError)
    } finally {
      setManualSubmitting(false)
    }
  }

  // ── Bulk import ─────────────────────────────────
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [importType, setImportType] = useState('manual_bulk_import')
  const [importSource, setImportSource] = useState('csv_import')
  const [importDeduplicate, setImportDeduplicate] = useState(true)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [importResult, setImportResult] = useState({ success: 0, skipped: 0, failed: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith('.csv')) {
      showToast('Please select a valid .csv file', 'error')
      return
    }

    setCsvFile(file)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length === 0) {
          showToast('CSV file is empty or invalid', 'error')
          return
        }
        setRows(result.data)
        showToast(`Loaded ${result.data.length} rows from CSV`, 'success')
      },
      error: () => showToast('Failed to parse CSV file', 'error'),
    })
  }

  const startBulkImport = async () => {
    if (!rows.length) {
      showToast('No contacts loaded from CSV', 'error')
      return
    }

    setImportProgress(0)
    setImportStatus('processing')
    setImportResult({ success: 0, skipped: 0, failed: 0 })

    let processed = 0
    const total = rows.length

    for (const row of rows) {
      const contact: any = {
        first_name: row.first_name || row['First Name'] || '',
        last_name: row.last_name || row['Last Name'] || '',
        email: row.email || row['Email'] || '',
        phone: row.phone || row['Phone'] || '',
        company: row.company || row['Company'] || '',
        contact_type: importType,
        contact_source: importSource,
        deduplicate: importDeduplicate,
        status: 'active',
        source_metadata: { 
          imported_file: csvFile?.name, 
          row_index: processed + 1,
          original_source: importSource
        }
      }

      const payload = preparePayload(contact as ContactForm)

      try {
        await axiosClient.post('/contacts', payload)
        setImportResult(prev => ({ ...prev, success: prev.success + 1 }))
      } catch (err: any) {
        if (err.response?.status === 409) {
          setImportResult(prev => ({ ...prev, skipped: prev.skipped + 1 }))
        } else {
          setImportResult(prev => ({ ...prev, failed: prev.failed + 1 }))
        }
      }

      processed++
      setImportProgress(Math.round((processed / total) * 100))
    }

    setImportStatus('done')
    showToast(
      `Import finished: ${importResult.success} added, ${importResult.skipped} skipped, ${importResult.failed} failed`,
      'success'
    )
  }

  // ── Shared helpers ──────────────────────────────
  const preparePayload = (values: ContactForm) => {
    const payload: any = {}
    if (values.first_name?.trim()) payload.first_name = values.first_name.trim()
    if (values.last_name?.trim()) payload.last_name = values.last_name.trim()
    if (values.email?.trim()) payload.email = values.email.trim()
    if (values.phone?.trim()) payload.phone = values.phone.trim()
    if (values.company?.trim()) payload.company = values.company.trim()
    if (values.contact_type) payload.contact_type = values.contact_type
    if (values.contact_source) payload.contact_source = values.contact_source
    if (values.status) payload.status = values.status
    payload.deduplicate = values.deduplicate

    if (values.identified_at) {
      payload.identified_at = format(values.identified_at, "yyyy-MM-dd'T'HH:mm:ssXXX")
    }

    if (values.source_metadata_json?.trim()) {
      try {
        payload.source_metadata = JSON.parse(values.source_metadata_json)
      } catch {
        throw new Error('Invalid JSON in source metadata')
      }
    }

    return payload
  }

  const handleApiError = (err: any, setError?: any) => {
    const res = err.response
    if (res?.status === 409) {
      showToast(`Duplicate found (ID: ${res.data.data?.duplicate_id || '?'})`, 'warning')
    } else if (res?.status === 422 && setError) {
      Object.entries(res.data.errors || {}).forEach(([key, msgs]: [string, any]) => {
        setError(key, { message: msgs.join(', ') })
      })
      showToast('Validation errors – check fields', 'error')
    } else {
      showToast(res?.data?.message || 'Request failed', 'error')
    }
  }

  return (
    <DashboardLayout>
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-2">Add Contacts</h1>
      <p className="text-muted-foreground mb-6">
        Create single contact manually or import multiple from CSV. Supports all contact types and sources.
      </p>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">
            <Plus className="mr-2 h-4 w-4" />
            Single Contact
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <FileUp className="mr-2 h-4 w-4" />
            Bulk Import (CSV)
          </TabsTrigger>
        </TabsList>

        {/* ── MANUAL CREATION ── */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>
                Add one contact with customizable type and source.
              </CardDescription>
            </CardHeader>

            <Form {...manualForm}>
              <form onSubmit={manualForm.handleSubmit(onManualSubmit)}>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <FormField control={manualForm.control} name="first_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="last_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="company" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4">
                    <FormField control={manualForm.control} name="contact_type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="manual_bulk_import">Manual Bulk Import</SelectItem>
                            <SelectItem value="ai_detection">AI Detection</SelectItem>
                            <SelectItem value="visitor_capture">Visitor Capture</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="contact_source" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dashboard">Dashboard</SelectItem>
                            <SelectItem value="csv_import">CSV Import</SelectItem>
                            <SelectItem value="factors_ai">Factors AI</SelectItem>
                            <SelectItem value="clearbit">Clearbit</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="product_lp">Product LP</SelectItem>
                            <SelectItem value="zapier">Zapier</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="identified_at" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identified At</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="deduplicate" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} id="dedup-manual" />
                        <FormLabel htmlFor="dedup-manual">Prevent duplicates</FormLabel>
                      </FormItem>
                    )} />

                    <FormField control={manualForm.control} name="source_metadata_json" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Metadata (JSON)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='{"key": "value"}' 
                            {...field} 
                            value={field.value ?? ''} 
                          />
                        </FormControl>
                        <FormDescription>Optional JSON metadata for the contact origin.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={manualSubmitting}>
                    {manualSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Contact
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* ── BULK IMPORT ── */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import from CSV</CardTitle>
              <CardDescription>
                Upload CSV file • Supports various types and sources for imported contacts.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Upload area */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvUpload}
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importStatus === 'processing'}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Select CSV File
                </Button>
                {csvFile && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Settings */}
              {rows.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <FormLabel>Type</FormLabel>
                      <Select value={importType} onValueChange={setImportType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual_bulk_import">Manual Bulk Import</SelectItem>
                          <SelectItem value="ai_detection">AI Detection</SelectItem>
                          <SelectItem value="visitor_capture">Visitor Capture</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <FormLabel>Source</FormLabel>
                      <Select value={importSource} onValueChange={setImportSource}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv_import">CSV Import</SelectItem>
                          <SelectItem value="factors_ai">Factors AI</SelectItem>
                          <SelectItem value="clearbit">Clearbit</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="product_lp">Product LP</SelectItem>
                          <SelectItem value="zapier">Zapier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dedup-bulk"
                          checked={importDeduplicate}
                          onCheckedChange={setImportDeduplicate}
                        />
                        <label htmlFor="dedup-bulk" className="text-sm font-medium">
                          Skip duplicates
                        </label>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={startBulkImport}
                        disabled={importStatus === 'processing'}
                        className="w-full"
                      >
                        {importStatus === 'processing' ? (
                          <>Processing…</>
                        ) : (
                          <>Start Import ({rows.length} contacts)</>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Progress */}
                  {importStatus !== 'idle' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Import progress</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} className="h-2" />
                      {importStatus === 'done' && (
                        <div className="text-sm mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">Result:</p>
                          <ul className="mt-1 space-y-1">
                            <li>Added: <strong>{importResult.success}</strong></li>
                            <li>Skipped (duplicates): <strong>{importResult.skipped}</strong></li>
                            <li>Failed: <strong>{importResult.failed}</strong></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  )
}
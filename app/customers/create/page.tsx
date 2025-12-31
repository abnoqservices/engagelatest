'use client'

import { DashboardLayout } from "@/components/dashboard/layout"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, FileUp, Loader2, Plus } from 'lucide-react'

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import axiosClient from '@/lib/axiosClient'
import { showToast } from '@/lib/showToast'

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────
interface CustomField {
  id: number
  key: string
  label: string
  type: string
  options: { choices?: string[] } | null
  is_required: boolean
  is_active: boolean
  order: number
}

// ────────────────────────────────────────────────
// SHARED SCHEMA (core fields)
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
  source_metadata_json: z.string().optional().nullable(),
})

type ContactForm = z.infer<typeof contactSchema>

// ────────────────────────────────────────────────
// DEFAULT VALUES - MANUAL
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
// BULK SCHEMA
// ────────────────────────────────────────────────
const bulkSchema = z.object({
  contact_type: z.enum([
    'manual',
    'manual_bulk_import',
    'ai_detection',
    'visitor_capture',
    'api',
  ]),
  contact_source: z.enum([
    'dashboard',
    'csv_import',
    'factors_ai',
    'clearbit',
    'website',
    'product_lp',
    'zapier',
  ]),
  csv_file: z
    .custom<File>((v) => v instanceof File, { message: 'Please select a CSV file' })
    .optional()
    .refine((file) => !file || file.name.endsWith('.csv'), {
      message: 'File must be a .csv',
    }),
})

type BulkFormValues = z.infer<typeof bulkSchema>

const bulkDefault: BulkFormValues = {
  contact_type: 'manual_bulk_import',
  contact_source: 'csv_import',
  csv_file: undefined,
}

// ────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────
export default function CreateOrImportContactsPage() {
  const router = useRouter()

  // Custom fields
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [customValues, setCustomValues] = useState<Record<string, any>>({})
  const [loadingCustomFields, setLoadingCustomFields] = useState(true)

  // ── Fetch custom fields ───────────────────────────────
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const res = await axiosClient.get('/contacts/custom-fields')
        if (res.data.success) {
          const active = res.data.data
            .filter((f: CustomField) => f.is_active)
            .sort((a: CustomField, b: CustomField) => a.order - b.order)
          setCustomFields(active)
        }
      } catch (err) {
        showToast('Could not load custom fields', 'error')
      } finally {
        setLoadingCustomFields(false)
      }
    }
    fetchCustomFields()
  }, [])

  // ── MANUAL FORM ───────────────────────────────────────
  const manualForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: manualDefault,
  })

  const [manualSubmitting, setManualSubmitting] = useState(false)

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
        showToast('Invalid JSON in source metadata', 'error')
      }
    }

    return payload
  }

  const handleApiError = (err: any, setError?: any) => {
    const res = err.response
    if (res?.status === 409) {
      showToast(`Duplicate contact found (ID: ${res.data.data?.duplicate_id || '?'})`, 'warning')
    } else if (res?.status === 422 && setError) {
      Object.entries(res.data.errors || {}).forEach(([key, msgs]: [string, any]) => {
        setError(key, { message: msgs.join(', ') })
      })
      showToast('Please check the form for validation errors', 'error')
    } else {
      showToast(res?.data?.message || 'Something went wrong', 'error')
    }
  }

  const onManualSubmit = async (values: ContactForm) => {
    setManualSubmitting(true)
    const payload = preparePayload(values)

    try {
      const createRes = await axiosClient.post('/contacts', payload)
      const contactId = createRes.data.data.id
      showToast('Contact created successfully', 'success')

      if (Object.keys(customValues).length > 0) {
        try {
          await axiosClient.put(`/contacts/${contactId}/custom-fields`, {
            fields: customValues,
          })
          showToast('Custom fields saved', 'success')
        } catch (cfErr: any) {
          showToast(
            cfErr.response?.data?.message || 'Some custom fields could not be saved',
            'warning'
          )
        }
      }

      router.push(`/dashboard/contacts/${contactId}`)
    } catch (err: any) {
      handleApiError(err, manualForm.setError)
    } finally {
      setManualSubmitting(false)
    }
  }

  // ── BULK FORM ─────────────────────────────────────────
  const bulkForm = useForm<BulkFormValues>({
    resolver: zodResolver(bulkSchema),
    defaultValues: bulkDefault,
  })

  const [bulkSubmitting, setBulkSubmitting] = useState(false)

  const onBulkSubmit = async (values: BulkFormValues) => {
    setBulkSubmitting(true)

    if (
      values.contact_type === 'manual_bulk_import' &&
      values.contact_source === 'csv_import' &&
      values.csv_file
    ) {
      try {
        const formData = new FormData()
        formData.append('file', values.csv_file)
        formData.append('contact_type', values.contact_type)
        formData.append('contact_source', values.contact_source)

        const res = await axiosClient.post('/contacts/import-csv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const imported = res.data?.data?.imported_count ?? res.data?.data?.count ?? 0
        showToast(`Successfully imported ${imported} contacts`, 'success')
        router.push('/dashboard/contacts')
      } catch (err: any) {
        handleApiError(err)
        showToast('Bulk import failed. Please check the file format.', 'error')
      }
    } else {
      showToast('Please select Bulk Import type, CSV source and upload a file', 'warning')
    }

    setBulkSubmitting(false)
  }

  // ── Custom field renderer ─────────────────────────────
  const renderCustomFieldInput = (field: CustomField) => {
    const key = field.key
    const value = customValues[key]

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <Input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value ?? ''}
            onChange={(e) => setCustomValues((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        )

      case 'textarea':
        return (
          <Textarea
            value={value ?? ''}
            onChange={(e) => setCustomValues((prev) => ({ ...prev, [key]: e.target.value }))}
            rows={3}
          />
        )

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !value && 'text-muted-foreground'
                )}
              >
                {value ? format(new Date(value), 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) =>
                  setCustomValues((prev) => ({
                    ...prev,
                    [key]: date ? date.toISOString() : null,
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case 'select':
        return (
          <Select
            value={value ?? ''}
            onValueChange={(val) => setCustomValues((prev) => ({ ...prev, [key]: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {(field.options?.choices || []).map((choice) => (
                <SelectItem key={choice} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'boolean':
        return (
          <div className="pt-2">
            <Switch
              checked={!!value}
              onCheckedChange={(checked) => setCustomValues((prev) => ({ ...prev, [key]: checked }))}
            />
          </div>
        )

      default:
        return <Input disabled placeholder={`Unsupported type: ${field.type}`} />
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <h1 className="text-3xl font-bold mb-2">Add New Contact</h1>
        <p className="text-muted-foreground mb-6">
          Enter details manually or import multiple contacts via CSV.
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

          {/* MANUAL TAB */}
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Contact Entry</CardTitle>
                <CardDescription>
                  Fill in the basic information and any custom fields below.
                </CardDescription>
              </CardHeader>

              <Form {...manualForm}>
                <form onSubmit={manualForm.handleSubmit(onManualSubmit)}>
                  <CardContent className="grid gap-8 md:grid-cols-2">
                    {/* Core fields */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-semibold">Basic Information</h3>

                      <FormField
                        control={manualForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="identified_at"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identified At</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? format(field.value, 'PPP') : <span>Pick date</span>}
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
                                    date > new Date() || date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="status"
                        render={({ field }) => (
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
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="deduplicate"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="deduplicate"
                            />
                            <FormLabel htmlFor="deduplicate" className="cursor-pointer">
                              Prevent duplicates
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={manualForm.control}
                        name="source_metadata_json"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Metadata (JSON – optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='{"campaign": "summer_2025", "utm_source": "newsletter"}'
                                {...field}
                                value={field.value ?? ''}
                                rows={2}
                              />
                            </FormControl>
                            <FormDescription>Advanced usage only</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Custom fields */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-semibold">Custom Fields</h3>

                      {loadingCustomFields ? (
                        <div className="py-6 text-center text-muted-foreground">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                          <p>Loading custom fields...</p>
                        </div>
                      ) : customFields.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                          <p>No custom fields have been created yet.</p>
                          <p className="text-sm mt-1">
                            You can add them in Settings → Custom Fields
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {customFields.map((cf) => (
                            <div key={cf.id} className="space-y-2">
                              <FormLabel className="flex items-center gap-1.5">
                                {cf.label}
                                {cf.is_required && (
                                  <span className="text-red-500 text-xs font-medium">*</span>
                                )}
                              </FormLabel>

                              {renderCustomFieldInput(cf)}

                              <p className="text-xs text-muted-foreground">
                                {cf.type}
                                {cf.options?.choices && ` • ${cf.options.choices.length} options`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={manualSubmitting || loadingCustomFields}
                      className="min-w-[140px]"
                    >
                      {manualSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Contact
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* BULK TAB */}
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import via CSV</CardTitle>
                <CardDescription>
                  Upload a CSV file to import multiple contacts at once.
                </CardDescription>
              </CardHeader>

              <Form {...bulkForm}>
                <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)}>
                  <CardContent className="space-y-6">
                    <FormField
                      control={bulkForm.control}
                      name="contact_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manual_bulk_import">Bulk Import</SelectItem>
                              {/* You can add others if needed */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bulkForm.control}
                      name="contact_source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="csv_import">CSV Import</SelectItem>
                              {/* You can add others if needed */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {bulkForm.watch('contact_type') === 'manual_bulk_import' &&
                      bulkForm.watch('contact_source') === 'csv_import' && (
                        <FormField
                          control={bulkForm.control}
                          name="csv_file"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Upload CSV File</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".csv"
                                  onChange={(e) => onChange(e.target.files?.[0])}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>
                                CSV should contain columns: first_name, last_name, email, phone, company, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    {(bulkForm.watch('contact_type') !== 'manual_bulk_import' ||
                      bulkForm.watch('contact_source') !== 'csv_import') && (
                      <p className="text-sm text-muted-foreground pt-4">
                        Select <strong>Bulk Import</strong> type and <strong>CSV Import</strong> source to enable file upload.
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={bulkSubmitting}
                      className="min-w-[140px]"
                    >
                      {bulkSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Import Contacts
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
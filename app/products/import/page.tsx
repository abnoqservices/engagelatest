'use client'

import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, ArrowRight, X } from 'lucide-react'
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const productFields = [
  { value: "name", label: "Product Name", required: true },
  { value: "sku", label: "SKU", required: true },
  { value: "description", label: "Description", required: false },
  { value: "price", label: "Price", required: true },
  { value: "category", label: "Category", required: true },
  { value: "tags", label: "Tags", required: false },
  { value: "stock", label: "Stock Quantity", required: false },
  { value: "weight", label: "Weight", required: false },
  { value: "dimensions", label: "Dimensions", required: false },
  { value: "brand", label: "Brand", required: false },
]

export default function BulkImportPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [showMapping, setShowMapping] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    
    // Parse CSV/Excel to get headers
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        setCsvHeaders(headers)
        
        // Auto-map fields with similar names
        const autoMapping: Record<string, string> = {}
        headers.forEach(header => {
          const normalized = header.toLowerCase()
          const match = productFields.find(f => 
            normalized.includes(f.value) || f.value.includes(normalized)
          )
          if (match) {
            autoMapping[header] = match.value
          }
        })
        setFieldMapping(autoMapping)
        
        // Parse preview data (first 5 rows)
        const preview = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const row: any = {}
          headers.forEach((header, i) => {
            row[header] = values[i] || ''
          })
          return row
        }).filter(row => Object.values(row).some(v => v))
        
        setPreviewData(preview)
        setShowMapping(true)
      }
    }
    reader.readAsText(file)
  }

  const handleMappingChange = (csvHeader: string, productField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvHeader]: productField
    }))
  }

  const handleImport = () => {
    console.log('[v0] Importing with mapping:', fieldMapping)
    // Import logic would go here
    alert(`Importing ${previewData.length} products with field mapping`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Import Products</h1>
          <p className="text-muted-foreground mt-2">
            Import multiple products at once using CSV or Excel files
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-base">Download Template</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download our CSV template with all required fields
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-base">Fill in Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add your product details including names, descriptions, prices, and categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-base">Upload File</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload your completed file and review the preview before importing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Supported formats: CSV, Excel (.xlsx, .xls)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">CSV or Excel files (max 10MB)</p>
              {uploadedFile && (
                <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{uploadedFile.name}</span>
                </div>
              )}
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls" 
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </CardContent>
        </Card>

        {showMapping && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Map Your Fields</CardTitle>
                <CardDescription>
                  Match your CSV/Excel columns to product fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center font-medium text-sm text-muted-foreground pb-3 border-b">
                    <div>Your Column</div>
                    <div></div>
                    <div>Maps To</div>
                  </div>
                  
                  {csvHeaders.map(header => (
                    <div key={header} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-lg border">
                        <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-sm">{header}</span>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      
                      <Select
                        value={fieldMapping[header] || ""}
                        onValueChange={(value) => handleMappingChange(header, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skip">Skip this column</SelectItem>
                          {productFields.map(field => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Required fields</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Make sure to map all required fields: {productFields.filter(f => f.required).map(f => f.label).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview Data</CardTitle>
                <CardDescription>
                  Review how your data will be imported (showing first 5 rows)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(fieldMapping).filter(h => fieldMapping[h] !== 'skip').map(header => (
                          <th key={header} className="text-left p-3 font-medium">
                            {productFields.find(f => f.value === fieldMapping[header])?.label || header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-slate-50">
                          {Object.keys(fieldMapping).filter(h => fieldMapping[h] !== 'skip').map(header => (
                            <td key={header} className="p-3">{row[header]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleImport} className="flex-1">
                    Import {previewData.length} Products
                  </Button>
                  <Button variant="outline" onClick={() => setShowMapping(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Import History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
            <CardDescription>View your import history and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { file: "products_batch_1.csv", date: "2025-01-15 14:30", status: "success", count: 125 },
                { file: "new_products.xlsx", date: "2025-01-10 09:15", status: "success", count: 48 },
                { file: "product_update.csv", date: "2025-01-05 16:45", status: "partial", count: 89 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.file}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.count} products</p>
                      {item.status === "success" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">Success</span>
                        </div>
                      )}
                      {item.status === "partial" && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">Partial</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

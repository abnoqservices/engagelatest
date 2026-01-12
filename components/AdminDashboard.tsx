import { useState, useEffect } from "react";
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Eye,
  Search,
  RefreshCw,
  Edit2,
  Save,
  X,
  Filter,
  Calendar,
  Download,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Tag,
  MessageSquare,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAllCards, deleteCard, updateCard, type CardData } from "@/lib/api";
import { INDUSTRY_FIELDS } from "@/lib/industry-fields";
import ExtractedDataCard from "./ExtractedDataCard";
import * as XLSX from "xlsx";

interface AdminDashboardProps {
  refreshTrigger?: number;
  onCardDeleted?: () => void;
}

const AdminDashboard = ({ refreshTrigger, onCardDeleted }: AdminDashboardProps) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const fetchCards = async () => {
    setLoading(true);
    try {
      const { data } = await getAllCards({ 
        search: search || undefined,
        city: cityFilter || undefined,
        pincode: pincodeFilter || undefined,
      });
      
      let filteredData = data;
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        filteredData = filteredData.filter(c => new Date(c.created_at) >= fromDate);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        filteredData = filteredData.filter(c => new Date(c.created_at) <= toDate);
      }
      
      setCards(filteredData);
    } catch (error) {
      toast({
        title: "Failed to load cards",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [refreshTrigger]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCards();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, cityFilter, pincodeFilter, dateFrom, dateTo]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCard(id);
      toast({ title: "Card deleted" });
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      fetchCards();
      onCardDeleted?.();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteCard(id)));
      toast({ title: `${selectedIds.size} cards deleted` });
      setSelectedIds(new Set());
      fetchCards();
      onCardDeleted?.();
    } catch (error) {
      toast({
        title: "Bulk delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCard) return;
    
    try {
      await updateCard(editingCard.id, {
        company_name: editingCard.company_name,
        person_name: editingCard.person_name,
        designation: editingCard.designation,
        email: editingCard.email,
        website: editingCard.website,
        full_address: editingCard.full_address,
        city: editingCard.city,
        pincode: editingCard.pincode,
        phone_numbers: editingCard.phone_numbers,
        industry_field: editingCard.industry_field,
        remarks: editingCard.remarks,
      });
      toast({ title: "Card updated successfully" });
      setEditingCard(null);
      fetchCards();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === cards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cards.map(c => c.id)));
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCityFilter("");
    setPincodeFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToExcel = async (exportAll: boolean) => {
    try {
      let dataToExport = cards;
      
      if (exportAll) {
        const { data } = await getAllCards({});
        dataToExport = data;
      }

      const excelData = dataToExport.map(card => ({
        'Company Name': card.company_name || '',
        'Person Name': card.person_name || '',
        'Designation': card.designation || '',
        'Phone Numbers': card.phone_numbers?.join(', ') || '',
        'Email': card.email || '',
        'Website': card.website || '',
        'Full Address': card.full_address || '',
        'City': card.city || '',
        'Pincode': card.pincode || '',
        'Industry / Field': card.industry_field || '',
        'Remarks': card.remarks || '',
        'LinkedIn': card.social_handles?.linkedin || '',
        'Instagram': card.social_handles?.instagram || '',
        'Facebook': card.social_handles?.facebook || '',
        'X (Twitter)': card.social_handles?.x || '',
        'YouTube': card.social_handles?.youtube || '',
        'Other Social': card.social_handles?.other || '',
        'Created At': card.created_at ? new Date(card.created_at).toLocaleString() : '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cards');

      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.max(key.length, ...excelData.map(row => String(row[key as keyof typeof row] || '').length))
      }));
      worksheet['!cols'] = colWidths;

      const fileName = exportAll 
        ? `all_cards_${new Date().toISOString().split('T')[0]}.xlsx`
        : `filtered_cards_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      XLSX.writeFile(workbook, fileName);
      
      toast({ 
        title: "Export successful", 
        description: `${dataToExport.length} cards exported to ${fileName}` 
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-elevated border-0 overflow-hidden">
      <CardHeader className="gradient-primary text-primary-foreground p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-heading">Cards Database</CardTitle>
              <p className="text-primary-foreground/70 text-sm">{cards.length} records found</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchCards}
            disabled={loading}
            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-4 gradient-card">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/50 bg-background"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl border-border/50">
                  <FileSpreadsheet className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => exportToExcel(false)} disabled={cards.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Filtered ({cards.length})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToExcel(true)}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export All Cards
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl border-border/50">
                  <Filter className="w-4 h-4" />
                  Filters
                  {(cityFilter || pincodeFilter || dateFrom || dateTo) && (
                    <Badge variant="secondary" className="ml-1 bg-primary/20 text-primary">Active</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-xl" align="end">
                <div className="space-y-4">
                  <h4 className="font-heading font-medium">Advanced Filters</h4>
                  <div>
                    <label className="text-sm text-muted-foreground">City</label>
                    <Input
                      placeholder="Filter by city"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Pincode</label>
                    <Input
                      placeholder="Filter by pincode"
                      value={pincodeFilter}
                      onChange={(e) => setPincodeFilter(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date Range</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="flex-1 rounded-lg"
                      />
                      <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="flex-1 rounded-lg"
                      />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full rounded-lg">
                    Clear Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {selectedIds.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Cards</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedIds.size} card(s)? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 rounded-lg">
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-primary-foreground" />
              </div>
              <p className="text-muted-foreground">Loading cards...</p>
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground">Start scanning to add cards to your database</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Button variant="ghost" size="sm" onClick={toggleSelectAll} className="p-0 h-auto">
                        {selectedIds.size === cards.length ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="min-w-[150px] font-heading">Person</TableHead>
                    <TableHead className="min-w-[150px] font-heading">Company</TableHead>
                    <TableHead className="min-w-[120px] font-heading">Designation</TableHead>
                    <TableHead className="min-w-[150px] font-heading">Contact</TableHead>
                    <TableHead className="min-w-[120px] font-heading">Industry</TableHead>
                    <TableHead className="min-w-[100px] font-heading">City</TableHead>
                    <TableHead className="min-w-[100px] font-heading">Date</TableHead>
                    <TableHead className="w-[120px] font-heading">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((card) => (
                    <TableRow key={card.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleSelect(card.id)} className="p-0 h-auto">
                          {selectedIds.has(card.id) ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {card.image_url ? (
                            <img
                              src={card.image_url}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover bg-muted ring-2 ring-border/50"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <span className="font-medium">{card.person_name || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{card.company_name || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{card.designation || '—'}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {card.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{card.email}</span>
                            </div>
                          )}
                          {card.phone_numbers?.[0] && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{card.phone_numbers[0]}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {card.industry_field ? (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                            {card.industry_field}
                          </Badge>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{card.city || '—'}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-medium">{formatDate(card.created_at)}</div>
                          <div className="text-muted-foreground">{formatTime(card.created_at)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedCard(card)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingCard({ ...card })} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Card</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(card.id)}
                                  className="bg-destructive hover:bg-destructive/90 rounded-lg"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      {/* View Card Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <ExtractedDataCard 
              data={{
                company_name: selectedCard.company_name,
                person_name: selectedCard.person_name,
                designation: selectedCard.designation,
                phone_numbers: selectedCard.phone_numbers,
                email: selectedCard.email,
                website: selectedCard.website,
                full_address: selectedCard.full_address,
                city: selectedCard.city,
                pincode: selectedCard.pincode,
                social_handles: selectedCard.social_handles,
                industry_field: selectedCard.industry_field,
                remarks: selectedCard.remarks,
              }} 
              previewImage={selectedCard.image_url}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Card</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Person Name</label>
                <Input
                  value={editingCard.person_name || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, person_name: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={editingCard.company_name || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, company_name: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Designation</label>
                <Input
                  value={editingCard.designation || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, designation: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={editingCard.email || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, email: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Numbers (comma-separated)</label>
                <Input
                  value={editingCard.phone_numbers?.join(', ') || ''}
                  onChange={(e) => setEditingCard({ 
                    ...editingCard, 
                    phone_numbers: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={editingCard.website || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, website: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editingCard.full_address || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, full_address: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={editingCard.city || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, city: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pincode</label>
                  <Input
                    value={editingCard.pincode || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, pincode: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Industry / Field
                </Label>
                <Select 
                  value={editingCard.industry_field || ""} 
                  onValueChange={(value) => setEditingCard({ ...editingCard, industry_field: value || null })}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select an industry..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl">
                    {INDUSTRY_FIELDS.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Remarks
                </Label>
                <Textarea
                  value={editingCard.remarks || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, remarks: e.target.value })}
                  placeholder="Add any notes about this contact..."
                  rows={3}
                  className="resize-none rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingCard(null)} className="rounded-lg">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="gradient-primary text-primary-foreground rounded-lg">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminDashboard;
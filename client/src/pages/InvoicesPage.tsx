import { useState } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign, Filter, X } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { InvoiceListSkeleton, StatsCardSkeleton } from '../components/ui/skeletons';

type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

const InvoicesPage = () => {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);

  const { data: invoicesData, isLoading } = trpc.clientPortal.getInvoices.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50,
    offset: 0,
  });

  const { data: invoiceDetail } = trpc.clientPortal.getInvoice.useQuery(
    { invoiceId: selectedInvoice! },
    { enabled: !!selectedInvoice }
  );

  // Extract invoices array from the response object
  const invoices = invoicesData?.invoices || [];

  const statusOptions: { value: InvoiceStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Invoices' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      paid: 'bg-green-500/20 text-green-400 border-green-500/30',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const handleDownloadPDF = (invoiceId: number) => {
    // Placeholder for PDF download functionality
    toast.info('PDF download feature coming soon!');
  };

  // Calculate stats from the invoices array
  const totalStats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
            <p className="text-gray-400">View and manage your invoices</p>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total</p>
                      <p className="text-2xl font-bold text-white">
                        ${(totalStats.total / 100).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Paid</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${(totalStats.paid / 100).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ${(totalStats.pending / 100).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-red-400">
                      ${(totalStats.overdue / 100).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  statusFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border-slate-800 text-gray-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Filter className="h-3 w-3 mr-2" />
                {option.label}
              </Button>
            ))}
          </div>

          {/* Invoices Table */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Invoice History</CardTitle>
              <CardDescription className="text-gray-400">
                All your invoices and payment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <InvoiceListSkeleton />
              ) : invoices && invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-gray-400">Invoice #</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Due Date</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow
                          key={invoice.id}
                          className="border-slate-800 hover:bg-slate-800/50"
                        >
                          <TableCell className="font-medium text-white">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            ${(invoice.amount / 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice.id)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadPDF(invoice.id)}
                                className="text-gray-400 hover:text-white hover:bg-slate-800"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No invoices found</h3>
                  <p className="text-gray-400">
                    {statusFilter !== 'all'
                      ? 'Try adjusting your filter'
                      : 'You don\'t have any invoices yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Detail Modal */}
          <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
              {invoiceDetail && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-white">Invoice Details</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {invoiceDetail.invoiceNumber}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Issue Date</p>
                        <p className="text-white font-medium">
                          {new Date(invoiceDetail.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Due Date</p>
                        <p className="text-white font-medium">
                          {new Date(invoiceDetail.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Amount</p>
                        <p className="text-2xl font-bold text-white">
                          ${(invoiceDetail.amount / 100).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <Badge className={getStatusColor(invoiceDetail.status)}>
                          {invoiceDetail.status}
                        </Badge>
                      </div>
                    </div>

                    {invoiceDetail.description && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Description</p>
                        <p className="text-white">{invoiceDetail.description}</p>
                      </div>
                    )}

                    {invoiceDetail.paidAt && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Paid On</p>
                        <p className="text-green-400 font-medium">
                          {new Date(invoiceDetail.paidAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedInvoice(null)}
                        className="flex-1 border-slate-700 text-gray-400 hover:bg-slate-800 hover:text-white"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => handleDownloadPDF(invoiceDetail.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default InvoicesPage;


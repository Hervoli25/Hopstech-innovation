import { useState } from 'react';
import { Plus, LifeBuoy, MessageCircle, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { trpc } from '../lib/trpc';
import { cn } from '../lib/utils';
import CreateTicketModal from '../components/dashboard/CreateTicketModal';
import TicketDetailModal from '../components/dashboard/TicketDetailModal';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

const SupportPage = () => {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const { data: tickets, isLoading } = trpc.clientPortal.getTickets.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50,
    offset: 0,
  });

  const statusOptions: { value: TicketStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Tickets' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
              <p className="text-gray-400">Get help from our support team</p>
            </div>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </div>

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
                {option.label}
              </Button>
            ))}
          </div>

          {/* Tickets List */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : tickets && tickets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {ticket.subject}
                          </h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(ticket.status)}
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          Ticket #{ticket.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {ticket.updatedAt && (
                        <span className="text-gray-500 text-xs">
                          Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <LifeBuoy className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No support tickets</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  {statusFilter !== 'all'
                    ? 'No tickets found with this status'
                    : 'You haven\'t created any support tickets yet'}
                </p>
                {statusFilter === 'all' && (
                  <Button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CreateTicketModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          open={!!selectedTicketId}
          onOpenChange={(open) => !open && setSelectedTicketId(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default SupportPage;


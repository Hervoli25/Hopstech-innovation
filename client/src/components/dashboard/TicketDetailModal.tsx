import { useState } from 'react';
import { X, Send, User, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface TicketDetailModalProps {
  ticketId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketDetailModal = ({ ticketId, open, onOpenChange }: TicketDetailModalProps) => {
  const [replyContent, setReplyContent] = useState('');

  const { data: ticket } = trpc.clientPortal.getTicket.useQuery(
    { ticketId },
    { enabled: !!ticketId }
  );

  const { data: messages } = trpc.clientPortal.getTicketMessages.useQuery(
    { ticketId },
    { enabled: !!ticketId }
  );

  const utils = trpc.useUtils();

  const replyMutation = trpc.clientPortal.replyToTicket.useMutation({
    onSuccess: () => {
      toast.success('Reply sent successfully!');
      setReplyContent('');
      utils.clientPortal.getTicketMessages.invalidate();
      utils.clientPortal.getTicket.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send reply');
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error('Please enter a message');
      return;
    }

    replyMutation.mutate({
      ticketId,
      message: replyContent.trim(),
    });
  };

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

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {ticket.subject}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <span className="text-sm text-gray-500">
                  Ticket #{ticket.id}
                </span>
              </div>
            </div>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            {ticket.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.isStaff ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.isStaff ? "bg-blue-500/20" : "bg-green-500/20"
                    )}>
                      <User className={cn(
                        "h-4 w-4",
                        message.isStaff ? "text-blue-400" : "text-green-400"
                      )} />
                    </div>
                    <div className={cn(
                      "flex-1 max-w-[80%]",
                      message.isStaff ? "" : "flex flex-col items-end"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {message.senderName || (message.isStaff ? 'Support Team' : 'You')}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className={cn(
                        "rounded-lg p-3",
                        message.isStaff
                          ? "bg-slate-800"
                          : "bg-blue-600/20 border border-blue-500/30"
                      )}>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-slate-800 pt-4 mt-4">
            <form onSubmit={handleReply} className="space-y-3">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                disabled={replyMutation.isPending || ticket.status === 'closed'}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 border-slate-700 text-gray-400 hover:bg-slate-800 hover:text-white"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={replyMutation.isPending || ticket.status === 'closed'}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailModal;


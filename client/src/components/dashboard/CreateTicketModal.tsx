import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import { ButtonSpinner } from '../ui/loading-spinner';

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTicketModal = ({ open, onOpenChange }: CreateTicketModalProps) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  const utils = trpc.useUtils();

  const createMutation = trpc.clientPortal.createTicket.useMutation({
    onSuccess: () => {
      toast.success('Support ticket created successfully!');
      utils.clientPortal.getTickets.invalidate();
      utils.clientPortal.getDashboardStats.invalidate();
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create ticket');
    },
  });

  const resetForm = () => {
    setSubject('');
    setDescription('');
    setPriority('medium');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    createMutation.mutate({
      subject: subject.trim(),
      description: description.trim(),
      priority,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Create Support Ticket
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Describe your issue and our team will get back to you as soon as possible
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">
              Subject <span className="text-red-400">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="low" className="text-white hover:bg-slate-700">
                  Low
                </SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-slate-700">
                  Medium
                </SelectItem>
                <SelectItem value="high" className="text-white hover:bg-slate-700">
                  High
                </SelectItem>
                <SelectItem value="urgent" className="text-white hover:bg-slate-700">
                  Urgent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your issue..."
              className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-700 text-gray-400 hover:bg-slate-800 hover:text-white"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <ButtonSpinner className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;


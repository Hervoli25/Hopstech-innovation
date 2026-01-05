import { useState } from 'react';
import { Pause, XCircle, Play, Archive, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

interface ProjectControlPanelProps {
  projectId: number;
  currentStatus: string;
  onStatusChangeRequested?: () => void;
}

const ProjectControlPanel = ({ projectId, currentStatus, onStatusChangeRequested }: ProjectControlPanelProps) => {
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [reason, setReason] = useState('');

  const utils = trpc.useUtils();

  const requestStatusChangeMutation = trpc.clientPortal.requestStatusChange.useMutation({
    onSuccess: () => {
      toast.success('Status change request submitted successfully');
      utils.clientPortal.getProject.invalidate({ projectId });
      utils.clientPortal.getStatusChangeRequests.invalidate({ projectId });
      setPauseDialogOpen(false);
      setCancelDialogOpen(false);
      setResumeDialogOpen(false);
      setReason('');
      onStatusChangeRequested?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit request');
    },
  });

  const { data: pendingRequests } = trpc.clientPortal.getStatusChangeRequests.useQuery({
    projectId,
    status: 'pending',
  });

  const hasPendingRequest = (pendingRequests?.length || 0) > 0;

  const handleRequest = (requestType: 'pause' | 'cancel' | 'resume' | 'archive') => {
    if (reason.trim().length < 10) {
      toast.error('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    requestStatusChangeMutation.mutate({
      projectId,
      requestType,
      reason: reason.trim(),
    });
  };

  const canPause = currentStatus === 'in_progress' || currentStatus === 'planning';
  const canCancel = currentStatus !== 'completed' && currentStatus !== 'archived';
  const canResume = currentStatus === 'on_hold';

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          Project Controls
        </CardTitle>
        <CardDescription className="text-gray-400">
          Request changes to your project status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPendingRequest && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              You have a pending status change request awaiting approval
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Pause Project */}
          <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-orange-500/30 hover:bg-orange-500/10 text-orange-400"
                disabled={!canPause || hasPendingRequest}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Request to Pause Project</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This will put your project on hold. Please provide a reason for this request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pause-reason" className="text-white">Reason</Label>
                  <Textarea
                    id="pause-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you need to pause this project..."
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">{reason.length}/10 characters minimum</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRequest('pause')}
                    disabled={requestStatusChangeMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {requestStatusChangeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Resume Project */}
          <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-green-500/30 hover:bg-green-500/10 text-green-400"
                disabled={!canResume || hasPendingRequest}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Request to Resume Project</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This will resume work on your paused project.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resume-reason" className="text-white">Reason</Label>
                  <Textarea
                    id="resume-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you're ready to resume..."
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setResumeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRequest('resume')}
                    disabled={requestStatusChangeMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {requestStatusChangeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Cancel Project */}
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400"
                disabled={!canCancel || hasPendingRequest}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Request to Cancel Project</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This is a serious request. Please provide detailed reasoning for project cancellation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">
                    ⚠️ Canceling a project may have financial and contractual implications. This request will be
                    carefully reviewed by our team.
                  </p>
                </div>
                <div>
                  <Label htmlFor="cancel-reason" className="text-white">Detailed Reason *</Label>
                  <Textarea
                    id="cancel-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a detailed explanation for canceling this project..."
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">{reason.length}/10 characters minimum</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRequest('cancel')}
                    disabled={requestStatusChangeMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {requestStatusChangeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Cancellation Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Requests Display */}
        {pendingRequests && pendingRequests.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-white">Pending Requests:</h4>
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {request.requestType.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{request.reason}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectControlPanel;


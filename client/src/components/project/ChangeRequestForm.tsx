import { useState } from 'react';
import { FileEdit, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

interface ChangeRequestFormProps {
  projectId: number;
}

const ChangeRequestForm = ({ projectId }: ChangeRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'scope' | 'timeline' | 'budget' | 'requirements' | 'other'>('scope');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [timelineImpact, setTimelineImpact] = useState('');
  const [budgetImpact, setBudgetImpact] = useState('');
  const [scopeImpact, setScopeImpact] = useState('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const utils = trpc.useUtils();

  const createMutation = trpc.clientPortal.createChangeRequest.useMutation({
    onSuccess: () => {
      toast.success('Change request submitted successfully');
      utils.clientPortal.getChangeRequests.invalidate({ projectId });
      resetForm();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit change request');
    },
  });

  const { data: changeRequests } = trpc.clientPortal.getChangeRequests.useQuery({ projectId });

  const resetForm = () => {
    setType('scope');
    setTitle('');
    setDescription('');
    setCurrentValue('');
    setProposedValue('');
    setTimelineImpact('');
    setBudgetImpact('');
    setScopeImpact('');
    setRiskLevel('medium');
  };

  const handleSubmit = () => {
    if (!title.trim() || description.trim().length < 10) {
      toast.error('Please provide a title and detailed description (at least 10 characters)');
      return;
    }

    createMutation.mutate({
      projectId,
      type,
      title: title.trim(),
      description: description.trim(),
      currentValue: currentValue.trim() || undefined,
      proposedValue: proposedValue.trim() || undefined,
      impactAssessment: {
        timelineImpact: timelineImpact.trim() || undefined,
        budgetImpact: budgetImpact ? parseFloat(budgetImpact) : undefined,
        scopeImpact: scopeImpact.trim() || undefined,
        riskLevel,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'implemented':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-blue-400" />
              Change Requests
            </CardTitle>
            <CardDescription className="text-gray-400">
              Request modifications to your project
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileEdit className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Submit Change Request</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Request changes to your project scope, timeline, budget, or requirements
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-white">Request Type</Label>
                  <Select value={type} onValueChange={(value: any) => setType(value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="scope">Scope Change</SelectItem>
                      <SelectItem value="timeline">Timeline Adjustment</SelectItem>
                      <SelectItem value="budget">Budget Modification</SelectItem>
                      <SelectItem value="requirements">Requirements Update</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of the change"
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the requested change..."
                    className="bg-slate-800 border-slate-700 text-white mt-2"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">{description.length}/10 characters minimum</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentValue" className="text-white">Current Value</Label>
                    <Input
                      id="currentValue"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      placeholder="What it is now"
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proposedValue" className="text-white">Proposed Value</Label>
                    <Input
                      id="proposedValue"
                      value={proposedValue}
                      onChange={(e) => setProposedValue(e.target.value)}
                      placeholder="What you want it to be"
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-medium text-white mb-3">Impact Assessment (Optional)</h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="timelineImpact" className="text-white">Timeline Impact</Label>
                      <Input
                        id="timelineImpact"
                        value={timelineImpact}
                        onChange={(e) => setTimelineImpact(e.target.value)}
                        placeholder="e.g., +2 weeks, No impact"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budgetImpact" className="text-white">Budget Impact ($)</Label>
                      <Input
                        id="budgetImpact"
                        type="number"
                        value={budgetImpact}
                        onChange={(e) => setBudgetImpact(e.target.value)}
                        placeholder="e.g., 500, -200"
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="scopeImpact" className="text-white">Scope Impact</Label>
                      <Textarea
                        id="scopeImpact"
                        value={scopeImpact}
                        onChange={(e) => setScopeImpact(e.target.value)}
                        placeholder="How this affects project scope..."
                        className="bg-slate-800 border-slate-700 text-white mt-2"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="riskLevel" className="text-white">Risk Level</Label>
                      <Select value={riskLevel} onValueChange={(value: any) => setRiskLevel(value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {changeRequests && changeRequests.length > 0 ? (
          <div className="space-y-3">
            {changeRequests.map((request) => (
              <div key={request.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{request.title}</h4>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Type: {request.type}</span>
                      <span>•</span>
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {request.impactAssessment && (
                  <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Impact Assessment</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {request.impactAssessment.timelineImpact && (
                        <div>
                          <span className="text-gray-500">Timeline:</span>
                          <span className="text-gray-300 ml-1">{request.impactAssessment.timelineImpact}</span>
                        </div>
                      )}
                      {request.impactAssessment.budgetImpact !== undefined && (
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="text-gray-300 ml-1">
                            ${Math.abs(request.impactAssessment.budgetImpact).toFixed(2)}
                            {request.impactAssessment.budgetImpact > 0 ? ' increase' : ' decrease'}
                          </span>
                        </div>
                      )}
                      {request.impactAssessment.riskLevel && (
                        <div>
                          <span className="text-gray-500">Risk:</span>
                          <Badge className={`ml-1 ${
                            request.impactAssessment.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                            request.impactAssessment.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {request.impactAssessment.riskLevel}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.adminNotes && (
                  <div className="mt-3 p-3 bg-blue-500/10 rounded border border-blue-500/30">
                    <p className="text-sm text-blue-300">
                      <strong>Admin Response:</strong> {request.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileEdit className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No change requests yet</p>
            <p className="text-sm mt-1">Click "New Request" to submit a change request</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeRequestForm;


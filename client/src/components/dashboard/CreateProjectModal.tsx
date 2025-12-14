import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProjectModal = ({ open, onOpenChange }: CreateProjectModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [customProjectType, setCustomProjectType] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const utils = trpc.useUtils();

  // Fetch project types from database
  const { data: projectTypes, isLoading: projectTypesLoading } = trpc.clientPortal.getProjectTypes.useQuery();

  const createMutation = trpc.clientPortal.createProject.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully!');
      utils.clientPortal.getProjects.invalidate();
      utils.clientPortal.getDashboardStats.invalidate();
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProjectType('');
    setCustomProjectType('');
    setPriority('medium');
    setBudget('');
    setStartDate('');
    setEndDate('');
    setTechnologies([]);
    setTechInput('');
  };

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }

    if (!description.trim() || description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    if (!projectType) {
      toast.error('Please select a project type');
      return;
    }

    if (projectType === 'custom' && !customProjectType.trim()) {
      toast.error('Please enter a custom project type');
      return;
    }

    const finalProjectType = projectType === 'custom' ? customProjectType.trim() : projectType;

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      projectType: finalProjectType,
      priority,
      budget: budget ? parseFloat(budget) * 100 : undefined, // Convert to cents
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      technologies,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Project</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., E-commerce Website Redesign"
              className="bg-slate-800 border-slate-700 text-white mt-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project goals, requirements, and expected outcomes..."
              className="bg-slate-800 border-slate-700 text-white mt-2 min-h-[120px]"
              required
            />
          </div>

          {/* Project Type */}
          <div>
            <Label htmlFor="projectType" className="text-white">
              Project Type <span className="text-red-500">*</span>
            </Label>
            <Select value={projectType} onValueChange={setProjectType} required>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {projectTypesLoading ? (
                  <SelectItem value="loading" disabled className="text-gray-400">
                    Loading...
                  </SelectItem>
                ) : (
                  <>
                    {projectTypes?.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.name}
                        className="text-white hover:bg-slate-700"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom" className="text-white hover:bg-slate-700">
                      Custom Project
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Project Type (conditional) */}
          {projectType === 'custom' && (
            <div>
              <Label htmlFor="customProjectType" className="text-white">
                Custom Project Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customProjectType"
                value={customProjectType}
                onChange={(e) => setCustomProjectType(e.target.value)}
                placeholder="Enter your custom project type"
                className="bg-slate-800 border-slate-700 text-white mt-2"
                required
              />
            </div>
          )}

          {/* Priority */}
          <div>
            <Label htmlFor="priority" className="text-white">
              Priority <span className="text-red-500">*</span>
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)} required>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-2">
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

          {/* Budget */}
          <div>
            <Label htmlFor="budget" className="text-white">
              Budget (USD)
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="5000.00"
                className="bg-slate-800 border-slate-700 text-white pl-8"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Optional - Enter your estimated budget</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-white">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white mt-2"
                min={startDate}
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Label htmlFor="technologies" className="text-white">
              Technologies
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="technologies"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
                placeholder="e.g., React, Node.js, PostgreSQL"
                className="bg-slate-800 border-slate-700 text-white flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTechnology}
                variant="outline"
                className="border-slate-700 text-gray-400 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 pr-1"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(tech)}
                      className="ml-2 hover:bg-blue-500/30 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="border-slate-700 text-gray-400 hover:bg-slate-800"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;


import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, MapPin, Save, Bell } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Skeleton } from '../components/ui/skeleton';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { data: profile, isLoading } = trpc.clientPortal.getProfile.useQuery();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    invoiceReminders: true,
    supportReplies: true,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        address: profile.address || '',
        bio: profile.bio || '',
      });
      setNotifications({
        emailNotifications: profile.emailNotifications ?? true,
        projectUpdates: profile.projectUpdates ?? true,
        invoiceReminders: profile.invoiceReminders ?? true,
        supportReplies: profile.supportReplies ?? true,
      });
    }
  }, [profile]);

  const updateProfileMutation = trpc.clientPortal.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      utils.clientPortal.getProfile.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfileMutation.mutate({
      ...formData,
      ...notifications,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <main className="flex-1 overflow-y-auto p-6">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Manage your account information and preferences</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Company
                        </Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                          placeholder="Your company name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="Your address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive email updates</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          handleNotificationChange('emailNotifications', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Project Updates</p>
                        <p className="text-sm text-gray-400">Get notified about project changes</p>
                      </div>
                      <Switch
                        checked={notifications.projectUpdates}
                        onCheckedChange={(checked) =>
                          handleNotificationChange('projectUpdates', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Invoice Reminders</p>
                        <p className="text-sm text-gray-400">Receive payment reminders</p>
                      </div>
                      <Switch
                        checked={notifications.invoiceReminders}
                        onCheckedChange={(checked) =>
                          handleNotificationChange('invoiceReminders', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Support Replies</p>
                        <p className="text-sm text-gray-400">Get notified of support responses</p>
                      </div>
                      <Switch
                        checked={notifications.supportReplies}
                        onCheckedChange={(checked) =>
                          handleNotificationChange('supportReplies', checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Account Type</p>
                      <p className="text-white font-medium">Client</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Member Since</p>
                      <p className="text-white font-medium">
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ProfilePage;


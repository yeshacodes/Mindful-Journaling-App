import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Toast } from '../components/Toast';
import { User, Bell, Moon, LogOut } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex@example.com');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaveProfile = () => {
    setShowToast(true);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="size-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="size-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reminder" className="text-base">Daily Reminder</Label>
                <p className="text-sm text-slate-500">Get reminded to journal each day</p>
              </div>
              <Switch
                id="daily-reminder"
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>
            {dailyReminder && (
              <div>
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="size-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-slate-500">Switch to dark theme (coming soon)</p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
            />
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Account</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="size-4 mr-2" />
              Log Out
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </Card>

        {/* Data */}
        <Card className="p-6 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Data Storage</h2>
          <p className="text-sm text-slate-600 mb-4">
            Your journal entries are stored locally in your browser. They are not synced to any server.
          </p>
          <Button variant="outline" size="sm">
            Export All Entries
          </Button>
        </Card>
      </div>

      {showToast && (
        <Toast message="Settings saved!" onClose={() => setShowToast(false)} />
      )}
    </AppLayout>
  );
}

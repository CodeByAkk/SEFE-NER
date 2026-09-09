import { useState } from 'react';
import {
  Users,
  Phone,
  MapPin,
  Clock,
  Send,
  FileText,
  Shield,
  Activity,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { StatusBadge } from '@/components/ui/Badge';
import { demoFieldOfficers, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';
import type { FieldOfficer } from '@/types';

export function FieldTeamPage() {
  const { user, showToast } = useApp();
  const districtOfficers = filterByDistrict(demoFieldOfficers, user);

  const [selectedOfficer, setSelectedOfficer] = useState<FieldOfficer | null>(null);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim() || !selectedOfficer) return;
    showToast(`Message sent to ${selectedOfficer.name}`, 'success');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Users className="w-4 h-4" /> Field Operations Command
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            {isDistrictOfficer(user) ? `${user?.district || 'District'} Field Officers` : 'Field Officer Management'}
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            {isDistrictOfficer(user)
              ? 'Manage and monitor field officers assigned to your district'
              : 'Field officer roster, zone assignments, and communication'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Active Officers</p>
              <p className="text-xl font-bold text-navy-100">
                {districtOfficers.filter((o) => o.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">On Task</p>
              <p className="text-xl font-bold text-navy-100">
                {districtOfficers.filter((o) => o.status === 'On Task').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Offline</p>
              <p className="text-xl font-bold text-navy-100">
                {districtOfficers.filter((o) => o.status === 'Offline').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districtOfficers.map((officer) => (
          <Card key={officer.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  {officer.avatar || officer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-navy-100 text-sm">{officer.name}</h3>
                  <p className="text-[11px] text-navy-400">{officer.email}</p>
                </div>
              </div>
              <StatusBadge status={officer.status} />
            </div>

            <div className="space-y-1.5 text-xs text-navy-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-navy-500" />
                <span>{officer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-navy-500" />
                <span>{officer.assignedZones.length} assigned zones</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-navy-500" />
                <span>{officer.reportsThisWeek} reports this week</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-navy-500" />
                <span>Last check-in: {new Date(officer.lastCheckIn).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedOfficer(officer)}
                className="flex-1 py-1.5 px-2 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold"
              >
                Send Message
              </button>
              <button
                onClick={() => showToast('Reassign zone feature coming soon', 'info')}
                className="flex-1 py-1.5 px-2 rounded bg-navy-800 hover:bg-navy-700 text-navy-200 border border-navy-700 text-[11px] font-semibold"
              >
                Reassign Zone
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Message Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-navy-100">Message {selectedOfficer.name}</h3>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter task or message..."
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

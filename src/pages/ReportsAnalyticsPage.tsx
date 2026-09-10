import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui';
import { RiskBadge } from '@/components/ui/Badge';
import { locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';

export function ReportsAnalyticsPage() {
  const { user } = useApp();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const districtLocations = filterByDistrict(locations, user);
  const districtName = user?.district || user?.districtId || 'District';

  const districtRiskScores = districtLocations
    .map((loc) => ({
      locationId: loc.id,
      name: loc.name,
      score: Math.round(30 + Math.random() * 60),
      level: 'MODERATE' as const,
    }))
    .sort((a, b) => b.score - a.score);

  const avgResponseTime = '12 min';
  const resolvedIncidents = 24;
  const pendingIncidents = 8;
  const evacuationSuccessRate = '94%';
  const aiAccuracy = '87%';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> District Performance Analytics
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            {isDistrictOfficer(user) ? `${districtName} Reports & Analytics` : 'Reports & Analytics'}
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            District performance metrics, AI prediction accuracy, and exportable reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['weekly', 'monthly', 'yearly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-800 border border-navy-700 text-navy-200 hover:bg-navy-700 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Resolved Incidents</p>
              <p className="text-xl font-bold text-navy-100">{resolvedIncidents}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Pending Incidents</p>
              <p className="text-xl font-bold text-navy-100">{pendingIncidents}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Avg Response Time</p>
              <p className="text-xl font-bold text-navy-100">{avgResponseTime}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-navy-400">Evacuation Success</p>
              <p className="text-xl font-bold text-navy-100">{evacuationSuccessRate}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Prediction Accuracy */}
      <Card className="p-4">
        <CardHeader
          title="AI Prediction Accuracy"
          subtitle="Verified predictions vs actual outcomes"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 text-center">
            <p className="text-xs text-navy-400">Overall Accuracy</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{aiAccuracy}</p>
          </div>
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 text-center">
            <p className="text-xs text-navy-400">Verified Predictions</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">42</p>
          </div>
          <div className="p-3 rounded-lg bg-navy-800/80 border border-navy-700/50 text-center">
            <p className="text-xs text-navy-400">False Positives</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">6</p>
          </div>
        </div>
      </Card>

      {/* District Risk Ranking */}
      <Card className="p-4">
        <CardHeader
          title="District Risk Ranking"
          subtitle="Current risk scores across district locations"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <div className="space-y-2 mt-4">
          {districtRiskScores.map((item, idx) => (
            <div key={item.locationId} className="flex items-center justify-between p-2 rounded bg-navy-800/50 border border-navy-700/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-navy-500 w-4">#{idx + 1}</span>
                <span className="text-sm font-medium text-navy-200">{item.name}</span>
              </div>
              <RiskBadge level={item.level} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

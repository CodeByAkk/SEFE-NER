import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  Filter,
  Search,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Skull,
  Users,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, KpiCard } from '@/components/ui';
import { RiskBadge } from '@/components/ui/Badge';
import {
  historicalLandslides,
  locations,
  monthlyLandslideData,
  districtLandslideData,
  yearlyRiskTrend,
  incidentSeverityData,
} from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import type { RiskLevel } from '@/types';

const SEVERITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

export function HistoricalAnalysisPage() {
  const { showToast } = useApp();
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const totalFatalities = historicalLandslides.reduce((acc, h) => acc + h.fatalities, 0);
  const totalAffected = historicalLandslides.reduce((acc, h) => acc + h.affectedPopulation, 0);

  const filteredHistory = historicalLandslides.filter((item) => {
    const matchesSeverity = severityFilter === 'All' || item.severity === severityFilter;
    const loc = locations.find((l) => l.id === item.locationId);
    const locName = loc ? `${loc.name} ${loc.district} ${loc.state}` : '';
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.includes(searchQuery);
    return matchesSeverity && matchesSearch;
  });

  const handleExportData = () => {
    showToast('Exporting Historical Landslide Dataset (CSV / PDF report downloaded)', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" /> Multi-Decadal Geological Archive
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            Historical Landslide Analysis & Pattern Recognition
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            Geospatial retrospective correlating monsoon precipitation cycles, slope failure frequencies, and vulnerability trajectories
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 border border-navy-700 text-navy-200 flex items-center gap-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-blue-400" /> Export Geological Dataset
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Cataloged Major Slides"
          value={historicalLandslides.length}
          color="blue"
          trend="2022–2025 Multi-Year Catalog"
          icon={<Calendar className="w-6 h-6" />}
        />
        <KpiCard
          label="Cumulative Fatalities"
          value={totalFatalities}
          color="red"
          trend="Highest in Gangtok & Shillong"
          icon={<Skull className="w-6 h-6" />}
        />
        <KpiCard
          label="Displaced Residents"
          value={totalAffected.toLocaleString()}
          color="orange"
          trend="Directly impacted by slope failure"
          icon={<Users className="w-6 h-6" />}
        />
        <KpiCard
          label="Peak Threat Season"
          value="June – August"
          color="yellow"
          trend="82% occurrences during SW Monsoon"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Monsoon Correlation */}
        <Card className="p-5">
          <CardHeader
            title="Monthly Landslide Occurrences vs Rainfall (mm)"
            subtitle="Demonstrating clear threshold surge when monthly precipitation exceeds 300mm"
            icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
          />
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLandslideData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="landslides" name="Landslides" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#3b82f6" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: 5-Year Progression Trend */}
        <Card className="p-5">
          <CardHeader
            title="Multi-Year Hazard Index & Total Incidents (2020–2025)"
            subtitle="Rising precipitation extremes correlating with increased annual slope instability"
            icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
          />
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyRiskTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" textAnchor="middle" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="risk" name="Regional Risk Index" stroke="#f97316" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="incidents" name="Recorded Incidents" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: District Breakdown */}
        <Card className="p-5">
          <CardHeader
            title="High-Frequency Landslide Hotspots by District"
            subtitle="East Sikkim, Aizawl, and East Khasi Hills lead regional hazard incidence"
            icon={<MapPin className="w-5 h-5 text-red-400" />}
          />
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtLandslideData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="district" type="category" stroke="#64748b" width={90} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="landslides" name="Landslides" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Severity Proportions */}
        <Card className="p-5">
          <CardHeader
            title="Historical Incident Severity Proportions"
            subtitle="Distribution of geotechnical failure magnitudes"
            icon={<Layers className="w-5 h-5 text-green-400" />}
          />
          <div className="h-64 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="severity"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${(((percent ?? 0)) * 100).toFixed(0)}%`}
                >
                  {incidentSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Historical Disasters Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {['All', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  severityFilter === sev
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
            <input
              type="text"
              placeholder="Search historical records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-800/90 text-navy-400 uppercase font-semibold border-b border-navy-700/60">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Sector & State</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Fatalities</th>
                  <th className="py-3 px-4">Affected Population</th>
                  <th className="py-3 px-4">Incident Summary & Root Geotechnical Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/50 text-navy-200">
                {filteredHistory.map((item) => {
                  const loc = locations.find((l) => l.id === item.locationId);
                  return (
                    <tr key={item.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-navy-300 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-navy-100">{loc?.name}</span>
                        <span className="text-[11px] text-navy-400 block">{loc?.state}</span>
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge level={item.severity} />
                      </td>
                      <td className="py-3 px-4">
                        {item.fatalities > 0 ? (
                          <span className="font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            {item.fatalities} Fatalities
                          </span>
                        ) : (
                          <span className="text-navy-500">Zero</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-navy-300 font-medium">
                        {item.affectedPopulation.toLocaleString()} citizens
                      </td>
                      <td className="py-3 px-4 text-navy-300 leading-relaxed max-w-md">
                        {item.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

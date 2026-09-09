import { useState } from 'react';
import {
  FileText,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  AlertTriangle,
  Upload,
  User,
  ShieldCheck,
  Send,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, Modal } from '@/components/ui';
import { RiskBadge, StatusBadge } from '@/components/ui/Badge';
import { incidentReports, locations } from '@/data/demoData';
import { useApp } from '@/context/AppContext';
import { filterByDistrict, isDistrictOfficer } from '@/context/AppContext';
import type { IncidentReport, IncidentType, RiskLevel } from '@/types';

export function IncidentReportsPage() {
  const { user, showToast } = useApp();
  const [reports, setReports] = useState<IncidentReport[]>(incidentReports);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [type, setType] = useState<IncidentType>('Landslide');
  const [locationId, setLocationId] = useState<string>(locations[0].id);
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [reporterName, setReporterName] = useState<string>(user?.name ?? 'Local Resident');
  const [hasImage, setHasImage] = useState<boolean>(false);

  const districtReports = filterByDistrict(reports, user);

  const filteredReports = districtReports.filter((report) => {
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    const matchesSearch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const escalateReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Escalated' as const } : r))
    );
    showToast(`Report #${id} escalated to Admin.`, 'warning');
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a description of the observed hazard.', 'error');
      return;
    }

    const loc = locations.find((l) => l.id === locationId) || locations[0];
    const newReport: IncidentReport = {
      id: 'inc-' + (reports.length + 1),
      type,
      locationId: loc.id,
      locationName: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      description,
      severity,
      reporterType: user?.role === 'FIELD_OFFICER' ? 'Field Officer' : 'Citizen',
      reporterName: reporterName || 'Anonymous Citizen',
      timestamp: new Date().toISOString(),
      hasImage,
      status: 'Pending',
    };

    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    setDescription('');

    showToast('Incident Report submitted successfully! Field units alerted.', 'success');
  };

  const updateReportStatus = (id: string, newStatus: 'Verified' | 'Resolved' | 'Rejected') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Report #${id} marked as ${newStatus}.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-navy-900 border border-navy-700/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" /> {isDistrictOfficer(user) ? 'District Incident Registry' : 'Crowdsourced Hazard Registry'}
          </div>
          <h1 className="text-2xl font-bold text-navy-100 mt-1">
            {isDistrictOfficer(user) ? `${user?.district || 'District'} Incident Reports` : 'Citizen & Field Incident Reports'}
          </h1>
          <p className="text-xs text-navy-400 mt-0.5">
            {isDistrictOfficer(user)
              ? 'Review, verify, and action field and citizen reports within your district'
              : 'Real-time incident dispatch, ground observations, photograph verifications, and geotechnical status tracking'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Submit Hazard Report
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {['All', 'Pending', 'Verified', 'Resolved', 'Escalated'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-navy-900 border border-navy-700/60 text-navy-400 hover:text-navy-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search reports or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-navy-100 placeholder-navy-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">
                    {report.id}
                  </span>
                  <h3 className="font-bold text-navy-100 text-sm">{report.type}</h3>
                  <p className="text-xs text-navy-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-400" /> {report.locationName}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <p className="text-xs text-navy-300 leading-relaxed">{report.description}</p>

              <div className="flex items-center gap-2 pt-1">
                <RiskBadge level={report.severity} size="sm" />
                {report.hasImage && (
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                    <Camera className="w-3 h-3" /> Photo Attached
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-navy-700/50 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-navy-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {report.reporterName} ({report.reporterType})
                </span>
                <span>{new Date(report.timestamp).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons for District Officer */}
              {report.status === 'Pending' && isDistrictOfficer(user) && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => updateReportStatus(report.id, 'Verified')}
                    className="flex-1 py-1.5 px-2 rounded bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'Rejected')}
                    className="flex-1 py-1.5 px-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                  <button
                    onClick={() => escalateReport(report.id)}
                    className="py-1.5 px-2 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                    title="Escalate to Admin"
                  >
                    <ArrowUpRight className="w-3 h-3" /> Escalate
                  </button>
                </div>
              )}

              {report.status === 'Pending' && !isDistrictOfficer(user) && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => updateReportStatus(report.id, 'Verified')}
                    className="flex-1 py-1.5 px-2 rounded bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Verify
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'Rejected')}
                    className="flex-1 py-1.5 px-2 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              )}

              {report.status === 'Verified' && (
                <button
                  onClick={() => updateReportStatus(report.id, 'Resolved')}
                  className="w-full py-1.5 px-2 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Mark Hazard Resolved
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Report Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report a Landslide or Ground Crack">
        <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Incident / Hazard Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IncidentType)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            >
              <option value="Landslide">Active Landslide</option>
              <option value="Crack">Slope / Ground Tension Crack</option>
              <option value="Soil Movement">Soil Creep / Subsidence</option>
              <option value="Rockfall">Rockfall on Road</option>
              <option value="Road Blockage">Highway Mud Blockage</option>
              <option value="Flooding">Flash Flood Slope Washout</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Location / District</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.district} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Estimated Severity</label>
            <div className="grid grid-cols-4 gap-2">
              {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-1.5 rounded-lg border text-center font-bold text-xs ${
                    severity === lvl
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-navy-900 text-navy-400 border-navy-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Detailed Description & Landmarks</label>
            <textarea
              rows={3}
              placeholder="Describe crack width, continuous soil movement, nearby dwellings, or highway blockage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100 placeholder-navy-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-navy-300 font-semibold">Reporter Name / Contact</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg p-2 text-navy-100"
            />
          </div>

          <div className="p-3 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              <span className="text-navy-300">Attach Field Photograph</span>
            </div>
            <label className="cursor-pointer px-2.5 py-1 rounded bg-navy-800 text-navy-200 border border-navy-700 text-xs hover:bg-navy-700">
              {hasImage ? 'Photo Selected ✓' : 'Choose File'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => setHasImage(true)}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-800 text-navy-300 hover:bg-navy-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Submit Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

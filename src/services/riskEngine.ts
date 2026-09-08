import type {
  RiskScore,
  RiskLevel,
  RiskFactor,
  Location,
} from '@/types';
import {
  riskScores,
  rainfallRecords,
  soilSensors,
  terrainData,
  historicalLandslides,
  incidentReports,
} from '@/data/demoData';

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#eab308';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#ef4444';
  }
}

export function getRiskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'MODERATE': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    case 'CRITICAL': return 'bg-red-500/10 text-red-400 border-red-500/30';
  }
}

export function getRiskSolidClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-500 text-white';
    case 'MODERATE': return 'bg-yellow-500 text-black';
    case 'HIGH': return 'bg-orange-500 text-white';
    case 'CRITICAL': return 'bg-red-500 text-white';
  }
}

interface RiskEngineInput {
  locationId: string;
  rainfall: number;
  rainfallForecast: number;
  soilMoisture: number;
  slope: number;
  elevation: number;
  terrainVulnerability: number;
  landCover: string;
  historicalFrequency: number;
  roadCuttingVulnerability: number;
  satelliteChangeIndicator: number;
  citizenReports: number;
  fieldOfficerReports: number;
}

export function calculateRiskScore(input: RiskEngineInput): RiskScore {
  const factors: RiskFactor[] = [];

  const rainfallContribution = Math.min(30, Math.round((input.rainfall / 200) * 30));
  factors.push({
    name: input.rainfall > 100 ? 'Heavy Rainfall' : input.rainfall > 50 ? 'Moderate Rainfall' : 'Light Rainfall',
    contribution: rainfallContribution,
    description: `${input.rainfall}mm in 24h${input.rainfallForecast > input.rainfall ? ', forecast increasing' : ''}`,
  });

  const moistureContribution = Math.min(25, Math.round((input.soilMoisture / 100) * 25));
  factors.push({
    name: 'Soil Moisture',
    contribution: moistureContribution,
    description: `${input.soilMoisture}% saturation${input.soilMoisture > 75 ? ', near field capacity' : ''}`,
  });

  const slopeContribution = Math.min(20, Math.round((input.slope / 45) * 20));
  factors.push({
    name: input.slope > 35 ? 'Steep Slope' : input.slope > 20 ? 'Moderate Slope' : 'Gentle Slope',
    contribution: slopeContribution,
    description: `${input.slope}° average slope angle`,
  });

  const historyContribution = Math.min(15, Math.round(input.historicalFrequency * 1.2));
  factors.push({
    name: 'Historical Events',
    contribution: historyContribution,
    description: `${input.historicalFrequency} prior landslides in zone`,
  });

  const terrainContribution = Math.round(input.terrainVulnerability * 0.1);
  factors.push({
    name: 'Terrain Vulnerability',
    contribution: terrainContribution,
    description: input.roadCuttingVulnerability > 50 ? 'High road-cutting exposure' : 'Moderate terrain exposure',
  });

  if (input.citizenReports > 0) {
    factors.push({
      name: 'Citizen Reports',
      contribution: Math.min(10, input.citizenReports * 3),
      description: `${input.citizenReports} citizen report(s) received`,
    });
  }

  if (input.fieldOfficerReports > 0) {
    factors.push({
      name: 'Field Officer Reports',
      contribution: Math.min(10, input.fieldOfficerReports * 4),
      description: `${input.fieldOfficerReports} field officer report(s) received`,
    });
  }

  const total = factors.reduce((sum, f) => sum + f.contribution, 0);
  const score = Math.min(100, total);
  const level = getRiskLevel(score);

  const recommendedActions: Record<RiskLevel, string> = {
    LOW: 'No action required, routine monitoring',
    MODERATE: 'Routine monitoring and field verification',
    HIGH: 'Field inspection and continuous monitoring',
    CRITICAL: 'Immediate field inspection and emergency preparedness',
  };

  const riskWindows: Record<RiskLevel, string> = {
    LOW: 'No immediate risk',
    MODERATE: 'Next 24–48 hours',
    HIGH: 'Next 12–24 hours',
    CRITICAL: 'Next 6–12 hours',
  };

  return {
    locationId: input.locationId,
    score,
    level,
    probability: score,
    factors,
    rainfall: input.rainfall,
    soilMoisture: input.soilMoisture,
    slope: input.slope,
    elevation: input.elevation,
    historicalLandslides: input.historicalFrequency,
    riskWindow: riskWindows[level],
    recommendedAction: recommendedActions[level],
    updatedAt: new Date().toISOString(),
  };
}

export function getRiskScoreForLocation(locationId: string): RiskScore | undefined {
  return riskScores.find((r) => r.locationId === locationId);
}

export function recalculateRiskWithReport(
  locationId: string,
  baseScore: RiskScore,
  reportSeverity: RiskLevel,
  imageSeverity?: number,
): RiskScore {
  const severityBoost: Record<RiskLevel, number> = {
    LOW: 3,
    MODERATE: 8,
    HIGH: 15,
    CRITICAL: 25,
  };

  let boost = severityBoost[reportSeverity];
  if (imageSeverity) {
    boost += Math.round((imageSeverity - 50) / 5);
  }

  const newScore = Math.min(100, baseScore.score + boost);
  const level = getRiskLevel(newScore);

  const factors = [...baseScore.factors];
  const existingReportFactor = factors.find((f) => f.name === 'Citizen Reports' || f.name === 'Field Officer Reports');
  if (existingReportFactor) {
    existingReportFactor.contribution += Math.round(boost / 2);
  } else {
    factors.push({
      name: 'Verified Report',
      contribution: Math.round(boost),
      description: `Field/citizen report with ${reportSeverity.toLowerCase()} severity`,
    });
  }

  return {
    ...baseScore,
    score: newScore,
    level,
    probability: newScore,
    factors,
    riskWindow: level === 'CRITICAL' ? 'Next 6–12 hours' : level === 'HIGH' ? 'Next 12–24 hours' : baseScore.riskWindow,
    recommendedAction: level === 'CRITICAL' ? 'Immediate field inspection and emergency preparedness' : level === 'HIGH' ? 'Field inspection and continuous monitoring' : baseScore.recommendedAction,
    updatedAt: new Date().toISOString(),
  };
}

export function getAllRiskScores(): RiskScore[] {
  return riskScores;
}

export function getRiskInputsForLocation(loc: Location): RiskEngineInput {
  const rainfall = rainfallRecords.find((r) => r.locationId === loc.id)?.twentyFourHour ?? 50;
  const sensor = soilSensors.find((s) => s.locationId === loc.id);
  const terrain = terrainData.find((t) => t.locationId === loc.id);
  const history = historicalLandslides.filter((h) => h.locationId === loc.id).length;
  const reports = incidentReports.filter((r) => r.locationId === loc.id);
  const citizenReports = reports.filter((r) => r.reporterType === 'Citizen').length;
  const fieldOfficerReports = reports.filter((r) => r.reporterType === 'Field Officer').length;

  return {
    locationId: loc.id,
    rainfall,
    rainfallForecast: Math.round(rainfall * 1.2),
    soilMoisture: sensor?.soilMoisture ?? 50,
    slope: terrain?.slope ?? 15,
    elevation: loc.elevation,
    terrainVulnerability: terrain?.terrainVulnerability ?? 40,
    landCover: terrain?.landCover ?? 'Mixed',
    historicalFrequency: history,
    roadCuttingVulnerability: terrain?.roadCuttingVulnerability ?? 30,
    satelliteChangeIndicator: terrain?.satelliteChangeIndicator ?? 20,
    citizenReports,
    fieldOfficerReports,
  };
}

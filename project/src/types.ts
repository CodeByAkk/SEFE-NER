export type Role = 'admin' | 'district_officer' | 'field_officer' | 'citizen';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type IncidentStatus =
  | 'reported'
  | 'under_review'
  | 'field_verification'
  | 'verified'
  | 'resolved'
  | 'false_alarm';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  state: string | null;
  district: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  created_at: string;
}

export interface Incident {
  id: string;
  reported_by: string | null;
  assigned_field_officer: string | null;
  district_officer_id: string | null;
  title: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  risk_level: RiskLevel | null;
  status: IncidentStatus | null;
  ai_probability: number | null;
  verified: boolean | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FieldReport {
  id: string;
  incident_id: string | null;
  field_officer_id: string | null;
  observations: string | null;
  risk_assessment: string | null;
  weather_conditions: string | null;
  ground_conditions: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface AlertItem {
  id: string;
  incident_id: string | null;
  title: string | null;
  message: string | null;
  severity: RiskLevel | null;
  target_district: string | null;
  created_by: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean | null;
}

export interface CitizenReport {
  id: string;
  citizen_id: string | null;
  incident_id: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  video_url: string | null;
  status: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string | null;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

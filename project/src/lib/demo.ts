export const NE_STATES = [
  'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'
];

export const NE_DISTRICTS: Record<string, string[]> = {
  'Arunachal Pradesh': ['Tawang', 'West Kameng', 'Papum Pare', 'Lower Subansiri', 'East Siang'],
  Assam: ['Kamrup Metro', 'Dima Hasao', 'Karbi Anglong', 'Cachar', 'Dibrugarh'],
  Manipur: ['Imphal West', 'Churachandpur', 'Ukhrul', 'Tamenglong', 'Senapati'],
  Meghalaya: ['East Khasi Hills', 'West Garo Hills', 'Ri-Bhoi', 'Jaintia Hills', 'South Garo Hills'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Mon'],
  Sikkim: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  Tripura: ['West Tripura', 'Gomati', 'Dhalai', 'Unakoti']
};

export function aiEstimateDemo(severity: string, hasPhoto: boolean): { risk: string; prob: number } {
  // Clearly-labelled heuristic demo: NOT scientifically accurate.
  let p = 35;
  if (severity === 'severe') p += 30;
  else if (severity === 'moderate') p += 15;
  if (hasPhoto) p += 5;
  p += Math.floor(Math.random() * 8);
  p = Math.min(97, Math.max(5, p));
  const risk = p >= 80 ? 'critical' : p >= 60 ? 'high' : p >= 35 ? 'moderate' : 'low';
  return { risk, prob: p };
}

export const DEMO_INCIDENTS = [
  { id: 'demo-1', title: 'Slope slip near NH-6, East Khasi Hills', district: 'East Khasi Hills', risk: 'critical', prob: 87, status: 'field_verification', updated: 'Today, 10:42 AM' },
  { id: 'demo-2', title: 'Cracks reported above village road, Dima Hasao', district: 'Dima Hasao', risk: 'high', prob: 72, status: 'under_review', updated: 'Today, 9:15 AM' },
  { id: 'demo-3', title: 'Debris flow after overnight rain, Aizawl', district: 'Aizawl', risk: 'moderate', prob: 48, status: 'reported', updated: 'Yesterday, 6:02 PM' }
];

export const DEMO_ALERTS = [
  { id: 'a1', title: 'CRITICAL LANDSLIDE RISK', district: 'East Khasi Hills', prob: 87, status: 'Field Verification Required', updated: 'Today, 10:42 AM' },
  { id: 'a2', title: 'HIGH RAINFALL ADVISORY', district: 'Dima Hasao', prob: 72, status: 'Monitoring', updated: 'Today, 9:15 AM' }
];

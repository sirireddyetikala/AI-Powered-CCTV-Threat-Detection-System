export interface ThreatDetection {
  startTime: number;
  endTime: number;
  threatType: string;
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL
  alertCategory: string; // CROWD, WEAPON, VIOLENCE, SUSPICIOUS
  description: string;
}

export interface AnalysisResponse {
  sceneType?: string;
  segments: ThreatDetection[];
  incidentSummary?: string; // AI-generated incident narrative
}

export enum AnalysisState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

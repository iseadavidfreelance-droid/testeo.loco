
export type CycleStatus = 'running' | 'completed' | 'failed';
export type PinStatus = 'active' | 'deleted';

export interface IngestionCycle {
  cycle_id: string;
  started_at: string;
  ended_at: string | null;
  status: CycleStatus;
  records_processed: number;
}

export interface ActivePin {
  pin_id: string;
  title: string;
  image_url: string;
  current_status: PinStatus;
  last_synced_at: string;
  created_at: string;
}

export interface PinMetricHistory {
  id: number;
  pin_id: string;
  cycle_id: string;
  recorded_at: string;
  impressions: number;
  saves: number;
  outbound_clicks: number;
  delta_impressions: number;
  delta_saves: number;
  delta_outbound_clicks: number; // Derived velocity metric
}

export interface SystemHealthData {
  latestCycle: IngestionCycle | null;
  bufferCount: number;
  isZombie: boolean;
  lastUpdated: Date;
}


import { createClient } from '@supabase/supabase-js';
import { ActivePin, PinMetricHistory } from '../types';

const supabaseUrl = 'https://placeholder-project.supabase.co';
const supabaseKey = 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getMockSystemHealth = async () => {
  const mockCycle: any = {
    cycle_id: '550e8400-e29b-41d4-a716-446655440000',
    started_at: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'running',
    records_processed: 1250,
  };
  const mockBufferCount = 842;
  return {
    cycle: mockCycle,
    bufferCount: mockBufferCount
  };
};

export const getMockActivePins = async (): Promise<ActivePin[]> => {
  const now = new Date();
  const oldDate = new Date(now.getTime() - (30 * 60 * 60 * 1000));
  const freshDate = new Date(now.getTime() - (2 * 60 * 60 * 1000));

  return [
    {
      pin_id: '1029384756',
      title: 'Minimalist Industrial Loft Design Inspiration',
      image_url: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=200&h=200&fit=crop',
      current_status: 'active',
      last_synced_at: freshDate.toISOString(),
      created_at: new Date().toISOString()
    },
    {
      pin_id: '9283746152',
      title: 'Healthy Meal Prep - 15 Minute Recipes',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop',
      current_status: 'active',
      last_synced_at: oldDate.toISOString(),
      created_at: new Date().toISOString()
    },
    {
      pin_id: '4756382910',
      title: 'Digital Nomad Setup 2024 - Ultra Portable',
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop',
      current_status: 'deleted',
      last_synced_at: freshDate.toISOString(),
      created_at: new Date().toISOString()
    },
    {
      pin_id: '5566778899',
      title: 'Scandinavian Forest Architecture Photography',
      image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&h=200&fit=crop',
      current_status: 'active',
      last_synced_at: oldDate.toISOString(),
      created_at: new Date().toISOString()
    }
  ];
};

export const getMockPinHistory = async (pinId: string): Promise<PinMetricHistory[]> => {
  const history: PinMetricHistory[] = [];
  const now = new Date();
  
  for (let i = 10; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // Every 4 hours
    history.push({
      id: 1000 + i,
      pin_id: pinId,
      cycle_id: `cycle-uuid-${i}`,
      recorded_at: date.toISOString(),
      impressions: 5000 + (10 - i) * 800,
      saves: 200 + (10 - i) * 30,
      outbound_clicks: 150 + (10 - i) * 20,
      delta_impressions: Math.floor(Math.random() * 1200),
      delta_saves: Math.floor(Math.random() * 50),
      delta_outbound_clicks: Math.floor(Math.random() * 80)
    });
  }
  
  return history;
};


import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Activity, AlertTriangle, Database, Clock, ChevronRight } from 'lucide-react';
import { IngestionCycle, SystemHealthData } from '../types';
import { getMockSystemHealth } from '../services/supabaseClient';

const SystemHealthWidget: React.FC = () => {
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, we would use:
      // const { data: cycles } = await supabase.from('ingestion_cycles').select('*').order('started_at', { ascending: false }).limit(1);
      // const { count } = await supabase.from('raw_buffer').select('*', { count: 'exact', head: true });
      
      const result = await getMockSystemHealth();
      const latestCycle = result.cycle as IngestionCycle;
      
      // Zombie detection logic: status 'running' and started more than 10 minutes ago
      const startTime = new Date(latestCycle.started_at).getTime();
      const now = Date.now();
      const diffMinutes = (now - startTime) / 60000;
      const isZombie = latestCycle.status === 'running' && diffMinutes > 10;

      setData({
        latestCycle,
        bufferCount: result.bufferCount,
        isZombie,
        lastUpdated: new Date()
      });
      setError(null);
    } catch (err) {
      setError('Error al consultar el estado del sistema.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, [fetchHealthData]);

  if (loading && !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse w-full max-w-md">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const cycle = data?.latestCycle;
  const isZombie = data?.isZombie;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-md transition-all duration-300 hover:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">System Health</h2>
        </div>
        <button 
          onClick={fetchHealthData}
          className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
          title="Refrescar"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Status Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase">Last Ingestion Cycle</span>
            {isZombie ? (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                CICLO ZOMBIE
              </span>
            ) : (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                cycle?.status === 'running' 
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                {cycle?.status?.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-mono">ID: {cycle?.cycle_id || 'N/A'}</span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-sm text-slate-200">
                  {cycle ? new Date(cycle.started_at).toLocaleString() : 'No cycles found'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-400 font-medium">Raw Buffer</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {data?.bufferCount.toLocaleString() || '0'}
            </div>
            <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  (data?.bufferCount || 0) > 1000 ? 'bg-red-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(((data?.bufferCount || 0) / 2000) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block tracking-tight">Capacidad Cuarentena</span>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400 font-medium">Processed</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {cycle?.records_processed.toLocaleString() || '0'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-emerald-500 font-bold">+12%</span>
              <span className="text-[10px] text-slate-500 tracking-tight">vs anterior</span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all border border-slate-700">
            Ver Logs de Auditoría
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          REAL-TIME FEED
        </div>
        <div>
          ULT. ACTUALIZACIÓN: {data?.lastUpdated.toLocaleTimeString() || 'N/A'}
        </div>
      </div>

      {/* Critical Alert Overlay for Zombie Cycles */}
      {isZombie && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
      )}
    </div>
  );
};

export default SystemHealthWidget;

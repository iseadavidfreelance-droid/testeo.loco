
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrendingUp, Info, Activity, AlertCircle } from 'lucide-react';
import { usePinterestMetrics } from '../hooks/usePinterestMetrics';

interface Props {
  pinId: string;
  title?: string;
}

const PinVelocityChart: React.FC<Props> = ({ pinId, title }) => {
  // Integramos el nuevo hook que consume Supabase
  const { pinData, metrics, loading, error } = usePinterestMetrics(pinId);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-slate-900/20 border border-slate-800 rounded-xl animate-pulse gap-3">
        <Activity className="w-6 h-6 text-indigo-500 animate-bounce" />
        <span className="text-slate-500 text-xs font-mono uppercase tracking-widest text-center px-6">
          Consultando Bóveda de Métricas...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-400 font-medium">{error}</p>
        <p className="text-[10px] text-slate-500 font-mono">Verifica la conexión con el nodo Supabase</p>
      </div>
    );
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getHours()}h ${date.getDate()}/${date.getMonth() + 1}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-tighter">
            Cycle ID: {entry.cycle_id}
          </p>
          <p className="text-xs font-bold text-white mb-1">
            {new Date(label).toLocaleString()}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-indigo-400">Δ Impressions:</span>
              <span className="text-xs font-mono text-white">+{entry.delta_impressions || 0}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-xs text-emerald-400">Δ Saves:</span>
              <span className="text-xs font-mono text-white">+{entry.delta_saves || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Reversamos para mostrar cronológicamente de izquierda a derecha en el eje X
  const chartData = [...metrics].reverse();

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingUp className="w-24 h-24 text-indigo-500" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Pin Velocity Analysis</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] text-indigo-400 font-mono">
          <Info className="w-3 h-3" />
          PIN_{pinId.slice(-4)}
        </div>
      </div>

      <p className="text-sm text-slate-400 truncate border-l-2 border-indigo-500 pl-3 py-1 bg-slate-900/40 rounded-r">
        {pinData?.title || title || 'Analizando metadatos...'}
      </p>

      {chartData.length > 0 ? (
        <div className="h-[280px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="recorded_at" 
                tickFormatter={formatXAxis} 
                stroke="#475569" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '20px' }}
              />
              <Bar 
                name="Δ Impressions" 
                dataKey="delta_impressions" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
              <Bar 
                name="Δ Saves" 
                dataKey="delta_saves" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={20} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[280px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-lg bg-slate-900/10">
          <Info className="w-8 h-8 text-slate-700 mb-2" />
          <p className="text-xs text-slate-500">Sin historial de métricas.</p>
          <p className="text-[10px] text-slate-600 mt-1">Este Pin es nuevo en el sistema y espera el próximo ciclo de ingesta.</p>
        </div>
      )}

      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 font-mono uppercase">Source: pin_metric_history (Append-Only)</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Impressions</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Saves</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinVelocityChart;

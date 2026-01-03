
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { ActivePin } from '../types';
import { getMockActivePins } from '../services/supabaseClient';

interface Props {
  onSelectPin: (pin: ActivePin) => void;
  selectedPinId?: string;
}

const ActivePinsGrid: React.FC<Props> = ({ onSelectPin, selectedPinId }) => {
  const [pins, setPins] = useState<ActivePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMockActivePins();
        setPins(data);
      } catch (err) {
        console.error('Error fetching pins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isStale = (dateStr: string) => {
    const syncTime = new Date(dateStr).getTime();
    const now = Date.now();
    return (now - syncTime) > (24 * 60 * 60 * 1000); // 24 hours
  };

  const filteredPins = pins.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.pin_id.includes(search)
  );

  if (loading) {
    return (
      <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800 p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm font-medium">Cargando inventario vivo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Table Header / Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por ID o título..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors border border-slate-700">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Imagen</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Título</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Última Sincronización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPins.map((pin) => {
                const stale = isStale(pin.last_synced_at);
                const isSelected = selectedPinId === pin.pin_id;
                return (
                  <tr 
                    key={pin.pin_id} 
                    onClick={() => onSelectPin(pin)}
                    className={`group cursor-pointer transition-all duration-200 ${isSelected ? 'bg-indigo-500/10' : 'hover:bg-indigo-500/5'} ${stale ? 'bg-amber-500/[0.03]' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className={`relative w-12 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center transition-colors shadow-inner ${isSelected ? 'border-indigo-500' : 'group-hover:border-indigo-500/50'}`}>
                        {pin.image_url ? (
                          <img 
                            src={pin.image_url} 
                            alt={pin.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = ''; 
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-700" />
                        )}
                        <div className={`absolute inset-0 bg-indigo-900/20 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold transition-colors truncate ${isSelected ? 'text-indigo-400' : 'text-slate-200 group-hover:text-indigo-400'}`}>
                          {pin.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {pin.pin_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        pin.current_status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {pin.current_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${stale ? 'text-amber-500' : isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>
                          {stale && <AlertCircle className="w-3.5 h-3.5" />}
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          {new Date(pin.last_synced_at).toLocaleDateString()}
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono mt-1 uppercase">
                          {stale ? 'STALE DATA' : 'SYNCED OK'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPins.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Search className="w-8 h-8 text-slate-700" />
            <p className="text-slate-500 text-sm">No se encontraron pins con esos criterios.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivePinsGrid;

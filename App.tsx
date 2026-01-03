
import React, { useState } from 'react';
import SystemHealthWidget from './components/SystemHealthWidget';
import ActivePinsGrid from './components/ActivePinsGrid';
import PinVelocityChart from './components/PinVelocityChart';
import { Shield, LayoutDashboard, Database, Activity, Package, LineChart } from 'lucide-react';
import { ActivePin } from './types';

const App: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<ActivePin | null>(null);

  const handleSelectPin = (pin: ActivePin) => {
    setSelectedPin(pin);
    // Smooth scroll to chart on mobile/small screens if needed
    if (window.innerWidth < 1280) {
      document.getElementById('velocity-analysis')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  ALFA-OS
                </h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Pinterest ELT Engine</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Integrations</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Audit Logs</a>
              <div className="h-6 w-[1px] bg-slate-800"></div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Engine</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-indigo-500 pl-6">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Operational Intelligence</h2>
              <p className="text-slate-400 mt-1 max-w-2xl text-sm sm:text-base">
                Monitoreo en tiempo real de la arquitectura ELT. Visualización de ciclos de ingesta, 
                detección de procesos estancados y estado de la cola de cuarentena.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all text-slate-300">
                Export Reports
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">
                Run Manual Cycle
              </button>
            </div>
          </div>

          {/* Top Section: Health, Performance & Selected Velocity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-1 space-y-8">
              <SystemHealthWidget />
              
              {/* Conditional rendering of the chart or a placeholder */}
              <div id="velocity-analysis">
                {selectedPin ? (
                  <PinVelocityChart pinId={selectedPin.pin_id} title={selectedPin.title} />
                ) : (
                  <div className="bg-slate-950 border border-slate-800 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 group hover:border-indigo-500/50 transition-colors">
                    <div className="p-4 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
                      <LineChart className="w-8 h-8 text-slate-700" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pin Velocity</h3>
                      <p className="text-xs text-slate-600 max-w-[200px]">
                        Selecciona un pin en el inventario para visualizar su velocidad de crecimiento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                      <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Ingestion Overview</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Success Rate', value: '98.4%', status: 'up' },
                      { label: 'Avg Cycle Time', value: '2.4m', status: 'down' },
                      { label: 'Active Pins', value: '42.8k', status: 'stable' }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-slate-800/50 pb-2">
                        <span className="text-xs text-slate-500 font-medium uppercase">{stat.label}</span>
                        <span className="text-sm font-mono font-bold text-slate-200">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                      <Database className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Capacity Analytics</h3>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-800" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-500" strokeWidth="3" strokeDasharray="42, 100" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-white font-mono">42%</span>
                        <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Buffer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Table inside the same column flow */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase">Inventario Vivo (active_pins)</h3>
                </div>
                <ActivePinsGrid onSelectPin={handleSelectPin} selectedPinId={selectedPin?.pin_id} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 py-12 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-slate-500">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">Alfa-OS Node #0012</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            &copy; 2024 Alfa-OS Pinterest Systems. Built for High-Performance ELT Workloads.
          </p>
          <div className="flex gap-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500/40"></div>
            <div className="h-2 w-2 rounded-full bg-emerald-500/70"></div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React from 'react';
import useStore from '../../store/useStore';

export default function HeatmapPanel() {
  // simple 3x3 grid mock implementation for zones
  const zones = ["Z1", "Z2", "Z3", "Z4", "Z5", "Z6"];
  
  const getColor = (zone) => {
      // randomly assign color representing congestion/pollution
      const num = parseInt(zone.replace("Z", ""));
      if (num % 3 === 0) return 'bg-red-500/80 border-red-400';
      if (num % 2 === 0) return 'bg-amber-500/80 border-amber-400';
      return 'bg-green-500/80 border-green-400';
  }

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
      <h3 className="text-md font-semibold mb-4 text-slate-200">Zone Status Heatmap</h3>
      <div className="grid grid-cols-3 gap-2 h-40">
         {zones.map(z => (
             <div key={z} className={`rounded-lg border flex flex-col items-center justify-center ${getColor(z)}`}>
                 <span className="font-bold text-slate-900">{z}</span>
                 <span className="text-[10px] text-slate-900">Traffic Status</span>
             </div>
         ))}
      </div>
    </div>
  );
}

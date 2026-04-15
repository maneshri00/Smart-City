import React, { useState } from 'react';
import { runSimulation } from '../../services/api';
import toast from 'react-hot-toast';

export default function ScenarioSimulator() {
  const [scenario, setScenario] = useState('ROAD_CLOSURE');
  const [severity, setSeverity] = useState(5);
  const [zoneId, setZoneId] = useState('Z1');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
      setLoading(true);
      try {
          const res = await runSimulation({ scenario, severity, zone_id: zoneId });
          setResult(res.data);
          toast.success("Simulation complete.");
      } catch(err) {
          toast.error("Simulation failed");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
       <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
           <h3 className="text-xl font-bold mb-6">Simulation Parameters</h3>
           
           <div className="space-y-5">
               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Scenario Type</label>
                   <select value={scenario} onChange={e=>setScenario(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white">
                       <option value="ROAD_CLOSURE">Major Road Closure</option>
                       <option value="TRAFFIC_SURGE">Traffic Surge (Event)</option>
                       <option value="POLLUTION_SPIKE">Industrial Pollution Spike</option>
                   </select>
               </div>
               
               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Severity ({severity}/10)</label>
                   <input 
                      type="range" min="1" max="10" value={severity} 
                      onChange={e=>setSeverity(parseInt(e.target.value))}
                      className="w-full accent-blue-500" 
                   />
               </div>

               <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Target Zone</label>
                   <select value={zoneId} onChange={e=>setZoneId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white">
                       {['Z1','Z2','Z3','Z4','Z5'].map(z => <option key={z} value={z}>{z}</option>)}
                   </select>
               </div>

               <button 
                  onClick={handleSimulate} disabled={loading}
                  className="w-full mt-4 p-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition shadow-lg shadow-indigo-600/30"
               >
                   {loading ? 'Running AI Models...' : 'Run Simulation'}
               </button>
           </div>
       </div>

       <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
           <h3 className="text-xl font-bold mb-6">Predicted Outcomes</h3>
           {!result ? (
               <div className="h-48 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                   Run a simulation to view outcomes
               </div>
           ) : (
               <div className="space-y-4 animate-fadeIn">
                   <div className="bg-red-950/40 border border-red-900/50 p-4 rounded-lg">
                       <p className="text-sm text-red-300 font-medium">Congestion Impact</p>
                       <p className="text-2xl font-bold text-red-400">+{result.predicted_congestion_increase}</p>
                   </div>
                   <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-lg">
                       <p className="text-sm text-amber-300 font-medium">AQI Degradation</p>
                       <p className="text-2xl font-bold text-amber-400">{result.predicted_aqi_change}</p>
                   </div>
                   <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                       <p className="text-sm text-slate-400 font-medium">AI Recommendations</p>
                       <ul className="mt-2 list-disc list-inside text-sm text-slate-300 space-y-1">
                           {result.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
                       </ul>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}

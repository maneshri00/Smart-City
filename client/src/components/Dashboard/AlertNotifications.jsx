import React from 'react';
import useStore from '../../store/useStore';
import { AlertCircle } from 'lucide-react';

export default function AlertNotifications() {
  const alerts = useStore(state => state.alerts);

  if (!alerts || alerts.length === 0) {
      return (
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <h3 className="text-md font-semibold mb-2 text-slate-200">Live Alerts</h3>
             <p className="text-slate-500 text-sm">No active alerts currently.</p>
          </div>
      );
  }

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h3 className="text-md font-semibold mb-3 text-slate-200">Live Alerts</h3>
      <div className="flex flex-col gap-2">
        {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-sm">
                <AlertCircle size={16} className="text-red-400 mt-0.5 whitespace-nowrap" />
                <span className="text-red-200">{alert}</span>
            </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../../store/useStore';

export default function LiveCharts() {
  const sensorData = useStore(state => state.sensorData);

  // Mock initial data if no websocket data
  const data = sensorData.length > 0 ? sensorData.map((d, i) => ({ time: new Date(d.timestamp).toLocaleTimeString(), aqi: d.aqi })) : 
  [
    { time: '10:00', aqi: 80 }, { time: '10:05', aqi: 85 }, { time: '10:10', aqi: 100 },
    { time: '10:15', aqi: 120 }, { time: '10:20', aqi: 110 }
  ];

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <h3 className="text-md font-semibold mb-4 text-slate-200">Live AQI Trend</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

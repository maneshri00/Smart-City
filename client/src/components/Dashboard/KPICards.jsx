import React from 'react';
import useStore from '../../store/useStore';
import { Activity, AlertTriangle, Car, Droplets } from 'lucide-react';

export default function KPICards() {
  const sensorData = useStore(state => state.sensorData);
  const environment = useStore(state => state.environment);
  const complaints = useStore(state => state.complaints);
  const trafficData = useStore(state => state.trafficData);

  const latestSensor = sensorData.length > 0 ? sensorData[sensorData.length - 1] : { aqi: 120, waterPh: 7.2 };
  const latestTraffic = trafficData.length > 0 ? trafficData[trafficData.length - 1] : { vehicleCount: 1540 };
  const activeComplaints = complaints.filter(c => c.status !== 'RESOLVED').length;

  const cards = [
    { title: "Live AQI", value: environment?.overall_aqi || latestSensor.aqi, icon: <Activity className="text-blue-400" size={24} />, trend: "+2", color: "border-blue-500" },
    { title: "Active Complaints", value: activeComplaints || 12, icon: <AlertTriangle className="text-amber-400" size={24} />, trend: "-1", color: "border-amber-500" },
    { title: "Total Traffic", value: latestTraffic.vehicleCount || 1050, icon: <Car className="text-red-400" size={24} />, trend: "+12%", color: "border-red-500" },
    { title: "Water Quality (pH)", value: environment?.water_ph || latestSensor.waterPh || 7.2, icon: <Droplets className="text-cyan-400" size={24} />, trend: "Optimal", color: "border-cyan-500" }
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((kpi, idx) => (
        <div key={idx} className={`bg-slate-800 p-5 rounded-xl border-l-4 ${kpi.color} shadow-lg flex items-center justify-between`}>
          <div>
            <p className="text-slate-400 text-sm font-medium">{kpi.title}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-100">{kpi.value}</h3>
            <span className="text-xs text-slate-500 mt-2 block">{kpi.trend} vs last hour</span>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            {kpi.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

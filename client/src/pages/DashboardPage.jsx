import React, { useEffect } from 'react';
import KPICards from '../components/Dashboard/KPICards';
import LiveCharts from '../components/Dashboard/LiveCharts';
import HeatmapPanel from '../components/Dashboard/HeatmapPanel';
import AlertNotifications from '../components/Dashboard/AlertNotifications';
import CesiumMapView from '../components/DigitalTwin/CesiumMapView';
import { fetchSensorData, fetchEnvironmentStatus } from '../services/api';
import useStore from '../store/useStore';
export default function DashboardPage() {
  const setSensorData = useStore(state => state.setSensorData);
  const setEnvironment = useStore(state => state.setEnvironment);

  useEffect(() => {
    // Initial fetch
    fetchSensorData().then(res => setSensorData(res.data)).catch(console.error);
    fetchEnvironmentStatus().then(res => setEnvironment(res.data)).catch(console.error);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="w-full">
        <KPICards />
      </div>
      
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-[500px]">
        {/* Main content - Map/3D */}
        <div className="col-span-8 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col relative shadow-xl">
           <CesiumMapView />
        </div>

        {/* Sidebar - Charts & Alerts */}
        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
           <AlertNotifications />
           <LiveCharts />
           <HeatmapPanel />
        </div>
      </div>
    </div>
  );
}

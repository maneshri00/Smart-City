import React from 'react';
import ComplaintAnalytics from '../components/Complaints/ComplaintAnalytics';

export default function AdminPage() {
  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Admin Analytics Dashboard</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex-1">
         <ComplaintAnalytics />
      </div>
    </div>
  );
}

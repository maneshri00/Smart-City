import React, { useState } from 'react';
import ComplaintForm from '../components/Complaints/ComplaintForm';
import ComplaintTracker from '../components/Complaints/ComplaintTracker';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex mb-6 bg-slate-800 rounded-lg p-1 w-max border border-slate-700">
        <button 
          className={`px-4 py-2 rounded-md font-medium text-sm transition ${activeTab === 'new' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('new')}
        >
          New Complaint
        </button>
        <button 
          className={`px-4 py-2 rounded-md font-medium text-sm transition ${activeTab === 'track' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setActiveTab('track')}
        >
          Track Status
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        {activeTab === 'new' ? <ComplaintForm /> : <ComplaintTracker />}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ComplaintTracker() {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const onSearch = async (e) => {
      e.preventDefault();
      if (!ticketId) return;
      setLoading(true);
      try {
          const res = await api.get(`/complaint-status/${ticketId}`);
          setStatusData(res.data);
      } catch(err) {
          toast.error("Ticket not found.");
          setStatusData(null);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div>
        <form onSubmit={onSearch} className="flex gap-3 mb-8">
            <input 
                type="text" 
                value={ticketId} 
                onChange={e => setTicketId(e.target.value)} 
                placeholder="Enter Ticket ID (UUID format)" 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono"
            />
            <button type="submit" disabled={loading} className="px-6 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition">
                {loading ? 'Searching...' : 'Track'}
            </button>
        </form>

        {statusData && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="text-xl font-bold">Current Status</h3>
                        <div className="mt-2 inline-block px-3 py-1 bg-blue-900/50 border border-blue-800 text-blue-300 rounded-full text-sm font-semibold">
                            {statusData.status}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Estimated Resolution Time</p>
                        <p className="font-bold text-lg">{statusData.estimated_resolution_hours} Hours</p>
                    </div>
                </div>

                <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                   {statusData.timeline.map((entry, idx) => (
                       <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-slate-900 bg-blue-500 z-10 mr-4"></div>
                          <div className="bg-slate-800 p-4 rounded-lg shadow w-full">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-sm text-blue-400">{entry.status}</span>
                                  <span className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-slate-300">{entry.notes}</p>
                              {entry.updatedBy && <p className="text-xs text-slate-500 mt-2">By: {entry.updatedBy}</p>}
                          </div>
                       </div>
                   ))}
                </div>
            </div>
        )}
    </div>
  );
}

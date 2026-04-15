import React, { useState } from 'react';

import { submitComplaint } from '../../services/api';
import toast from 'react-hot-toast';

export default function ComplaintForm() {
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  
  // Custom simple form state since react-hook-form could be overkill for a clean single file
  const [formData, setFormData] = useState({
      citizenName: '', email: '', phone: '', location: '', description: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // Send to API -> AI classifies -> Stores -> Returns ticket
          const res = await submitComplaint({
              ...formData,
              category: "OTHER", // Let AI overwrite
              priority: "LOW",   // Let AI overwrite
              status: "SUBMITTED"
          });
          setTicketId(res.data.id);
          toast.success("Complaint submitted successfully.");
      } catch (err) {
          toast.error("Failed to submit complaint.");
      } finally {
          setLoading(false);
      }
  };

  if (ticketId) {
      return (
          <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Complaint Submitted</h3>
              <p className="text-slate-300">Your Ticket ID is:</p>
              <div className="bg-slate-900 p-4 rounded-lg my-4 font-mono text-xl select-all border border-slate-700">
                  {ticketId}
              </div>
              <p className="text-sm text-slate-400 mb-6">AI is analyzing your request and routing it to the correct department.</p>
              <button onClick={() => setTicketId(null)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Submit Another</button>
          </div>
      );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input required name="citizenName" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input required type="email" name="email" onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
          </div>
      </div>
      <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Location / Zone</label>
          <input required name="location" onChange={handleChange} placeholder="e.g., Sector 5, Downtown" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white" />
      </div>
      <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Describe the Issue</label>
          <textarea required name="description" onChange={handleChange} rows="4" placeholder="Detailed description..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"></textarea>
      </div>
      <button disabled={loading} type="submit" className={`mt-2 p-3 rounded-lg font-bold transition ${loading ? 'bg-slate-600 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
          {loading ? 'Processing via AI...' : 'Submit Complaint'}
      </button>
    </form>
  );
}

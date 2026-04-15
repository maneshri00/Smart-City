import React from 'react';
import { Link } from 'react-router-dom';
import WelcomeText from '../landingPage/WelcomeText';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center mt-20">
      <div className="mb-10 min-h-[100px] flex items-center justify-center">
        {/* Integrating the user's custom landing page WelcomeText component */}
        <WelcomeText />
      </div>
      
      <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
        Real-time digital twin monitoring, AI-driven complaint resolution, and predictive environmental simulations for a smarter city.
      </p>
      
      <div className="flex justify-center flex-wrap gap-4 mt-12">
        <Link to="/login" className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl font-bold transition shadow-lg shadow-teal-500/30 text-lg">
          Authenticate & Enter System
        </Link>
        <Link to="/complaints" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition border border-slate-600 text-lg">
          Citizen Access (Report Issue)
        </Link>
      </div>
    </div>
  );
}

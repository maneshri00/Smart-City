import React from 'react';
import ScenarioSimulator from '../components/Simulation/ScenarioSimulator';

export default function SimulationPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8">City Scenario Simulation</h2>
      <p className="text-slate-400 mb-6">Run predictive simulations to see how different events impact traffic congestion and air quality.</p>
      
      <ScenarioSimulator />
    </div>
  );
}

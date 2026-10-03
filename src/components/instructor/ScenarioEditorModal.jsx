import React, { useState } from 'react';
import { X, Save, Radio } from 'lucide-react';
import { generateSeedString } from '../../engine/seedRNG';

export function ScenarioEditorModal({ initialScenario = null, onClose = () => {}, onSave = () => {} }) {
  const [formData, setFormData] = useState(initialScenario || {
    id: `SCENARIO-${Date.now().toString(36).toUpperCase()}`,
    seed: generateSeedString(),
    name: 'New Custom Tactical Scenario',
    location: 'Forward Strategic Outpost',
    description: 'Custom instructor scenario simulating emerging asymmetric drone incursions.',
    timeOfDay: 'dusk',
    weather: 'clear',
    terrain: 'urban',
    sensorState: 'degraded_radar',
    threatType: 'swarm',
    swarmSize: 4,
    duration: 60,
    defendedSite: {
      name: 'Sector Base Alpha',
      type: 'urban_command_center',
      radius: 15
    },
    threats: [
      {
        id: 'T-01',
        callsign: 'VIPER-01',
        modelType: 'hexacopter',
        threatCategory: 'hostile',
        role: 'SCOUT',
        initialPosition: [-60, 20, -30],
        velocity: [10, 0, 5],
        attackTriggerTime: 22,
        attackSpeed: 15
      },
      {
        id: 'T-02',
        callsign: 'VIPER-02',
        modelType: 'fixed_wing_loiter',
        threatCategory: 'hostile',
        role: 'ATTACKER',
        initialPosition: [-70, 25, -35],
        velocity: [12, 0, 6],
        attackTriggerTime: 18,
        attackSpeed: 18
      }
    ]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF1A1A]" />
            <h2 className="font-heading text-base font-bold text-white uppercase tracking-wider">
              {initialScenario ? 'Edit Tactical Scenario' : 'Create Custom Scripted Scenario'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Scenario Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-[#FF1A1A]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Location / Theater</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-[#FF1A1A]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 mb-1 uppercase font-bold">Mission Briefing Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white font-sans focus:outline-none focus:border-[#FF1A1A]"
            />
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Terrain</label>
              <select
                value={formData.terrain}
                onChange={e => setFormData({ ...formData, terrain: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              >
                <option value="urban">Urban</option>
                <option value="rural">Rural</option>
                <option value="coastal">Coastal</option>
                <option value="outpost">Desert Outpost</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Weather</label>
              <select
                value={formData.weather}
                onChange={e => setFormData({ ...formData, weather: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              >
                <option value="clear">Clear Sky</option>
                <option value="fog">Dense Fog</option>
                <option value="rain">Monsoon Rain</option>
                <option value="sandstorm">Sandstorm</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Time of Day</label>
              <select
                value={formData.timeOfDay}
                onChange={e => setFormData({ ...formData, timeOfDay: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              >
                <option value="day">Daylight</option>
                <option value="dusk">Dusk / Twilight</option>
                <option value="night">Night Thermal</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Sensor State</label>
              <select
                value={formData.sensorState}
                onChange={e => setFormData({ ...formData, sensorState: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              >
                <option value="nominal">Nominal Full</option>
                <option value="degraded_radar">Degraded Radar</option>
                <option value="degraded_eoir">Degraded EO/IR</option>
                <option value="jammed">Active EW Jammed</option>
              </select>
            </div>
          </div>

          {/* Swarm & Defended Site */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Threat Type</label>
              <select
                value={formData.threatType}
                onChange={e => setFormData({ ...formData, threatType: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              >
                <option value="single">Single Drone Incursion</option>
                <option value="swarm">Coordinated Swarm Pack</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Swarm Size ({formData.swarmSize})</label>
              <input
                type="range"
                min="1"
                max="16"
                value={formData.swarmSize}
                onChange={e => setFormData({ ...formData, swarmSize: parseInt(e.target.value) })}
                className="w-full accent-[#FF1A1A] mt-2"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 uppercase font-bold">Duration (Seconds)</label>
              <input
                type="number"
                min="30"
                max="180"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FF1A1A]"
              />
            </div>
          </div>

          {/* Seed Input */}
          <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#FF1A1A]/30 flex items-center justify-between">
            <div>
              <span className="text-gray-400 block uppercase text-[10px]">Deterministic Seed</span>
              <span className="text-[#FF1A1A] font-bold text-sm">{formData.seed}</span>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, seed: generateSeedString() })}
              className="px-2.5 py-1 rounded bg-[#121212] border border-white/10 hover:border-[#FF1A1A] text-white text-[11px]"
            >
              Re-Roll Seed
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#0A0A0A] border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold uppercase transition-colors shadow-red-glow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Scenario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


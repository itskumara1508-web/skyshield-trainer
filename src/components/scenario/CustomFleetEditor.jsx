import React from 'react';
import { Plus, Trash2, Copy, Shield, Crosshair, AlertTriangle, Radio } from 'lucide-react';

/**
 * CustomFleetEditor
 * Interactive Fleet Composition Table & Drone Spawner
 * SIH26247 DSSC / MoD Counter-Drone Simulation Platform
 */
export function CustomFleetEditor({ contacts = [], onChangeContacts = () => {} }) {
  const handleUpdateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // If bearing or distance changed, re-calculate position & velocity
    if (field === 'headingDeg' || field === 'distance' || field === 'speed') {
      const heading = field === 'headingDeg' ? parseFloat(value) : updated[index].headingDeg || 0;
      const dist = field === 'distance' ? parseFloat(value) : updated[index].distance || 200;
      const spd = field === 'speed' ? parseFloat(value) : updated[index].speed || 18;

      const rad = (heading * Math.PI) / 180;
      const x = Math.sin(rad) * dist;
      const z = Math.cos(rad) * dist;
      const alt = updated[index].altitude || 40;

      // Inward velocity towards [0, 0, 0]
      const toCenterDist = Math.sqrt(x * x + z * z) || 1;
      const vx = (-x / toCenterDist) * spd;
      const vz = (-z / toCenterDist) * spd;

      updated[index].position = [Number(x.toFixed(1)), alt, Number(z.toFixed(1))];
      updated[index].velocity = [Number(vx.toFixed(2)), 0, Number(vz.toFixed(2))];
    }

    onChangeContacts(updated);
  };

  const handleAddContact = (type = 'hostile', model = 'delta_wing') => {
    const count = contacts.length + 1;
    const heading = Math.round(Math.random() * 360);
    const dist = 220;
    const rad = (heading * Math.PI) / 180;
    const x = Math.sin(rad) * dist;
    const z = Math.cos(rad) * dist;
    const spd = 18;
    const alt = 45;

    const toCenterDist = Math.sqrt(x * x + z * z) || 1;
    const vx = (-x / toCenterDist) * spd;
    const vz = (-z / toCenterDist) * spd;

    const newContact = {
      id: `trk-custom-${Date.now()}-${count}`,
      callsign: `CUSTOM-UAV-${count.toString().padStart(2, '0')}`,
      type,
      role: type === 'hostile' ? 'attacker' : 'transit',
      behavior: type === 'hostile' ? 'attack' : 'recon',
      modelType: model,
      spawnTime: count * 2,
      position: [Number(x.toFixed(1)), alt, Number(z.toFixed(1))],
      velocity: [Number(vx.toFixed(2)), 0, Number(vz.toFixed(2))],
      speed: spd,
      altitude: alt,
      distance: dist,
      headingDeg: heading,
      radarCrossSection: model === 'delta_wing' ? 0.024 : model === 'fpv_kamikaze' ? 0.012 : 0.045,
      thermalSignature: 0.8,
      rfFrequency: '2.44 GHz',
    };

    onChangeContacts([...contacts, newContact]);
  };

  const handleRemoveContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    onChangeContacts(updated);
  };

  const handleDuplicate = (index) => {
    const target = contacts[index];
    const newContact = {
      ...target,
      id: `trk-copy-${Date.now()}`,
      callsign: `${target.callsign}-B`,
      spawnTime: (target.spawnTime || 0) + 2.5,
      position: [(target.position?.[0] || 100) + 20, target.altitude || 40, (target.position?.[2] || 100) + 20],
    };
    onChangeContacts([...contacts, newContact]);
  };

  return (
    <div className="space-y-4">
      {/* Fleet Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FF1A1A]" />
          <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">
            Airspace Fleet Manifest ({contacts.length} Contact{contacts.length === 1 ? '' : 's'})
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddContact('hostile', 'delta_wing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-mono text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Hostile Attacker</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddContact('benign', 'civilian_cargo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Benign Civilian</span>
          </button>
          <button
            type="button"
            onClick={() => handleAddContact('friendly', 'tactical_male')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Friendly Escort</span>
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {contacts.map((contact, index) => {
          const type = (contact.type || contact.threatCategory || 'hostile').toLowerCase();

          return (
            <div
              key={contact.id || index}
              className={`p-4 rounded-xl border font-mono text-xs transition-all ${
                type === 'hostile'
                  ? 'bg-[#140b0b] border-red-500/30 hover:border-red-500/50'
                  : type === 'friendly'
                  ? 'bg-[#0b140e] border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-[#0b1219] border-cyan-500/30 hover:border-cyan-500/50'
              }`}
            >
              {/* Row 1: Identity & Classification */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: type === 'hostile' ? '#EF4444' : type === 'friendly' ? '#22C55E' : '#38BDF8' }} />
                  <input
                    type="text"
                    value={contact.callsign}
                    onChange={(e) => handleUpdateContact(index, 'callsign', e.target.value.toUpperCase())}
                    className="font-bold text-white bg-transparent border-b border-white/20 focus:border-[#FF1A1A] focus:outline-none px-1 py-0.5 w-32 uppercase"
                  />
                  <span className="text-[10px] text-gray-400">#{(index + 1).toString().padStart(2, '0')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={type}
                    onChange={(e) => handleUpdateContact(index, 'type', e.target.value)}
                    className="bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1 text-xs font-bold"
                    style={{ color: type === 'hostile' ? '#EF4444' : type === 'friendly' ? '#22C55E' : '#38BDF8' }}
                  >
                    <option value="hostile">HOSTILE</option>
                    <option value="benign">BENIGN (Civilian)</option>
                    <option value="friendly">FRIENDLY</option>
                  </select>

                  <select
                    value={contact.modelType || 'delta_wing'}
                    onChange={(e) => handleUpdateContact(index, 'modelType', e.target.value)}
                    className="bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-1 text-gray-300 text-xs"
                  >
                    <option value="delta_wing">Shahed Delta-Wing</option>
                    <option value="fpv_kamikaze">Micro FPV Suicide Racer</option>
                    <option value="heavy_hexacopter">Heavy Hexacopter Bomber</option>
                    <option value="recon_quad">Commercial Quad IED</option>
                    <option value="tactical_male">Tactical MALE Recon</option>
                    <option value="tethered_sentry">Tethered Sentry</option>
                    <option value="civilian_cargo">Civilian Cargo/Medical</option>
                    <option value="swarm_decoy">Autonomous Radar Decoy</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(index)}
                    className="p-1.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white"
                    title="Clone Contact"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveContact(index)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Kinematic Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-[11px]">
                <div>
                  <label className="text-gray-400 block mb-1">BEARING (°)</label>
                  <input
                    type="number"
                    min="0"
                    max="359"
                    value={contact.headingDeg ?? 45}
                    onChange={(e) => handleUpdateContact(index, 'headingDeg', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">DISTANCE (M)</label>
                  <input
                    type="number"
                    min="100"
                    max="350"
                    value={contact.distance ?? Math.round(Math.hypot(contact.position?.[0] || 150, contact.position?.[2] || 150))}
                    onChange={(e) => handleUpdateContact(index, 'distance', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">ALTITUDE (M)</label>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={contact.altitude ?? 45}
                    onChange={(e) => handleUpdateContact(index, 'altitude', parseFloat(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">SPEED (M/S)</label>
                  <input
                    type="number"
                    min="8"
                    max="30"
                    value={contact.speed ?? 18}
                    onChange={(e) => handleUpdateContact(index, 'speed', parseFloat(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white"
                  />
                </div>
              </div>

              {/* Row 3: Role, Spawn Timing & RF Protocol */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-[11px]">
                <div>
                  <label className="text-gray-400 block mb-1">FLIGHT ROLE</label>
                  <select
                    value={contact.role || 'attacker'}
                    onChange={(e) => handleUpdateContact(index, 'role', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-gray-300"
                  >
                    <option value="attacker">Attacker (Direct Breach)</option>
                    <option value="scout">Scout (Perimeter Recon)</option>
                    <option value="decoy">Decoy (Radar Diversion)</option>
                    <option value="transit">Transit Corridor Flight</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">SPAWN DELAY (T+ SEC)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    value={contact.spawnTime ?? 0}
                    onChange={(e) => handleUpdateContact(index, 'spawnTime', parseFloat(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">RF PROTOCOL</label>
                  <input
                    type="text"
                    value={contact.rfFrequency || '2.44 GHz'}
                    onChange={(e) => handleUpdateContact(index, 'rfFrequency', e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded px-2 py-1 text-gray-300"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {contacts.length === 0 && (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-gray-400 font-mono text-xs">
            No contacts configured in this scenario. Click "+ Hostile Attacker" or "+ Benign Civilian" above to spawn threat tracks.
          </div>
        )}
      </div>
    </div>
  );
}

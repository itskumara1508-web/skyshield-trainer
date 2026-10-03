import React, { useState } from 'react';
import { X, Copy, Check, Download, Upload, AlertCircle, FileCode } from 'lucide-react';

/**
 * ScenarioJsonModal
 * Import & Export Tactical Scenarios as JSON Data Exchange
 * SIH26247 DSSC / MoD Counter-Drone Simulation Platform
 */
export function ScenarioJsonModal({ scenario, onImportScenario, onClose }) {
  const [activeTab, setActiveTab] = useState('export'); // 'export' | 'import'
  const [jsonInput, setJsonInput] = useState('');
  const [importError, setImportError] = useState(null);
  const [copied, setCopied] = useState(false);

  const scenarioJsonString = JSON.stringify(scenario, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(scenarioJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scenarioJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skyshield-scenario-${scenario.seed || 'custom'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    setImportError(null);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.name && !parsed.id) {
        throw new Error('Invalid scenario format: missing scenario name or id.');
      }
      if (!parsed.contacts && !parsed.threats) {
        throw new Error('Invalid scenario format: scenario must contain contacts or threats array.');
      }

      // Normalize imported scenario
      const normalized = {
        ...parsed,
        id: parsed.id || `scn-imported-${Date.now()}`,
        seed: parsed.seed || `IMPORT-${Math.floor(1000 + Math.random() * 9000)}`,
        environment: parsed.environment || { timeOfDay: 'day', weather: 'clear', terrain: 'urban' },
        sensorState: parsed.sensorState || { mode: 'full', radarHealth: 1.0, eoirHealth: 1.0, jammerActive: false },
        contacts: parsed.contacts || parsed.threats || [],
      };

      onImportScenario(normalized);
      onClose();
    } catch (err) {
      setImportError(err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonInput(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with Tab switcher */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B30000]/20 border border-[#FF1A1A]/40 flex items-center justify-center text-[#FF1A1A]">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Scenario Interoperability
              </span>
              <h3 className="font-heading text-sm font-bold text-white uppercase">
                JSON Data Exchange
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#121212] border border-white/10 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'export' ? 'bg-[#B30000] text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Export JSON
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'import' ? 'bg-[#B30000] text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Import JSON
              </button>
            </div>

            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-gray-300">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Scenario JSON Payload:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#B30000]/20 hover:bg-[#B30000]/30 border border-[#FF1A1A]/40 text-[#FF1A1A] font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={scenarioJsonString}
                className="w-full h-80 bg-[#070b0e] border border-white/10 rounded-xl p-3 font-mono text-[11px] text-gray-300 leading-relaxed resize-none focus:outline-none focus:border-[#FF1A1A]"
              />
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Paste Scenario JSON or upload file:</span>
                <label className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A0A0A] border border-white/10 hover:border-[#FF1A1A] text-white cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#FF1A1A]" />
                  <span>Upload .json File</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {importError && (
                <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <textarea
                placeholder='Paste scenario JSON here: { "name": "...", "contacts": [...] }'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-72 bg-[#070b0e] border border-white/10 rounded-xl p-3 font-mono text-[11px] text-gray-200 leading-relaxed resize-none focus:outline-none focus:border-[#FF1A1A]"
                required
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#B30000] hover:bg-[#FF1A1A] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-red-glow"
              >
                Validate & Load Imported Scenario
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

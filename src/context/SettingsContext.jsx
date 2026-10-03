/**
 * SkyShield Trainer - Global Settings Context
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 */

import React, { createContext, useContext, useState } from 'react';
import { DataLayer } from '../data/dataLayer';
import { DIFFICULTY_PRESETS } from '../engine/adaptiveDifficulty';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lowGraphics, setLowGraphics] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [adaptiveLevel, setAdaptiveLevel] = useState(2);
  const [activeTrainee, setActiveTraineeState] = useState(() => DataLayer.getActiveTrainee());

  const toggleSound = () => setSoundEnabled((prev) => !prev);
  const toggleLowGraphics = () => setLowGraphics((prev) => !prev);
  const toggleReduceMotion = () => setReduceMotion((prev) => !prev);

  const setActiveTrainee = (trainee) => {
    setActiveTraineeState(trainee);
    DataLayer.setActiveTrainee(trainee);
  };

  const difficultyConfig = {
    level: adaptiveLevel,
    preset: DIFFICULTY_PRESETS[adaptiveLevel] || DIFFICULTY_PRESETS[2],
    sensorState: adaptiveLevel >= 4 ? 'jammed' : adaptiveLevel === 3 ? 'degraded_radar' : 'nominal',
    weather: adaptiveLevel >= 4 ? 'sandstorm' : adaptiveLevel === 3 ? 'rain' : 'clear',
    swarmSize: (DIFFICULTY_PRESETS[adaptiveLevel] || DIFFICULTY_PRESETS[2]).swarmSize,
  };

  return (
    <SettingsContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        lowGraphics,
        toggleLowGraphics,
        reduceMotion,
        toggleReduceMotion,
        adaptiveLevel,
        setAdaptiveLevel,
        difficultyConfig,
        activeTrainee,
        setActiveTrainee,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;


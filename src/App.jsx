import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { PersistentBackgroundCanvas } from './components/3d/PersistentBackgroundCanvas';
import { LandingPage } from './pages/LandingPage';
import { ScenarioBuilderPage } from './pages/ScenarioBuilderPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ScoringPage } from './pages/ScoringPage';
import { AARPage } from './pages/AARPage';
import { InstructorPage } from './pages/InstructorPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { DronePage } from './pages/DronePage';
import { LoginModal } from './components/auth/LoginModal';
import { useSettings } from './context/SettingsContext';


export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const { lowGraphics } = useSettings();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative selection:bg-[#B30000] selection:text-white">
      {/* Persistent Subtle 3D Background */}
      <PersistentBackgroundCanvas lowGraphics={lowGraphics} />

      {/* Main Defense Header with Tricolor Stripe */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Military Authentication Modal */}
      <LoginModal />

      {/* Main Content Area */}
      <main className="relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            onStartTraining={() => setActiveTab('builder')}
            onViewDashboard={() => setActiveTab('dashboard')}
            onGoToLogin={() => setActiveTab('login')}
            onExploreDrones={() => setActiveTab('drone')}
            lowGraphics={lowGraphics}
          />

        )}

        {activeTab === 'dashboard' && (
          <OfficerDashboardPage
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={(target) => setActiveTab(target || 'dashboard')}
          />
        )}

        {activeTab === 'builder' && (
          <ScenarioBuilderPage
            onLaunchSimulation={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorPage
            onFinishToScoring={() => setActiveTab('scoring')}
          />
        )}

        {activeTab === 'scoring' && (
          <ScoringPage
            onGoToAAR={() => setActiveTab('aar')}
            onRetryScenario={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'aar' && (
          <AARPage
            onLaunchRemediationDrill={() => {
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'instructor' && (
          <InstructorPage />
        )}

        {activeTab === 'intel' && (
          <ThreatIntelPage />
        )}

        {activeTab === 'drone' && (
          <DronePage onLaunchSimulation={() => setActiveTab('simulator')} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}

      </main>
    </div>
  );
}

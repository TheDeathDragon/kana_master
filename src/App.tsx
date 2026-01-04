import React, { useState } from 'react';
import { Page, StudyMode, ExtraStudyType } from './types';
import { Home } from './pages/Home';
import { Study } from './pages/Study';
import { Settings } from './pages/Settings';
import './index.css';

type AppState =
  | { page: 'home' }
  | { page: 'study'; mode: StudyMode; extraType: ExtraStudyType }
  | { page: 'settings' };

function App(): React.ReactElement {
  const [state, setState] = useState<AppState>({ page: 'home' });
  const handleStartStudy = (mode: StudyMode, extraType: ExtraStudyType = 'normal'): void => {
    setState({ page: 'study', mode, extraType });
  };
  const handleNavigate = (page: 'settings'): void => {
    setState({ page });
  };
  const handleBackToHome = (): void => {
    setState({ page: 'home' });
  };
  switch (state.page) {
    case 'home':
      return (
        <Home
          onStartStudy={handleStartStudy}
          onNavigate={handleNavigate}
        />
      );
    case 'study':
      return (
        <Study
          mode={state.mode}
          extraType={state.extraType}
          onExit={handleBackToHome}
        />
      );
    case 'settings':
      return (
        <Settings
          onBack={handleBackToHome}
        />
      );
    default:
      return <Home onStartStudy={handleStartStudy} onNavigate={handleNavigate} />;
  }
}

export default App;

import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { TourProvider } from '@reactour/tour';
import Nav from './Nav';
import Bio from './Bio';
import { steps } from './Tour';
import '../assets/css/all.min.css';
import GeoMap from './GeoMap';
import MonitorView from './MonitorView';
import DocsView from './DocsView';
import Mobile from './Mobile';
import Description from './Description';

const App = () => {
  const redirect = useNavigate();
  const [step, setStep] = useState(0);

  const setCurrentStep = (step) => {
    const redirects = {
      0: '/map',
      1: '/map',
      2: '/monitor',
      3: '/system-design',
    };
    redirect(redirects[step]);
    setStep(step);
  };

  return (
    <TourProvider
      steps={steps}
      currentStep={step}
      setCurrentStep={setCurrentStep}
      beforeClose={() => redirect('/map')}
    >
      <div className="App h-screen block lg:flex">
        <Mobile />
        <aside
          className="hidden lg:block text-slate-800 border-r-2 border-slate-200 relative"
          style={{ width: '400px', minWidth: '400px' }}
        >
          <div
            className="absolute left-0 right-0 top-0"
            style={{ bottom: '100px' }}
          >
            <div
              className="absolute top-0 w-full p-4"
              style={{ bottom: '100px' }}
            >
              <Nav />
              <Description setStep={setStep} />
            </div>
          </div>
          <Bio />
        </aside>
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/map" />} />
            <Route path="/map" element={<GeoMap />} />
            <Route path="/monitor" element={<MonitorView />} />
            <Route path="/system-design" element={<DocsView />} />
          </Routes>
        </div>
      </div>
    </TourProvider>
  );
};

export default App;

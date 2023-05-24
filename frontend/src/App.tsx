import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { TourProvider } from '@reactour/tour';
import Nav from './Nav';
import Bio from './Bio';
import '../assets/css/all.min.css';
import GeoMap from './GeoMap';
import MonitorView from './MonitorView';
import TourStart from './TourStart';
import DocsView from './DocsView';

const steps = [
  {
    selector: "[data-tour='map']",
    content: (
      <>
        <p className="text-sm">
          The map visualizes the <strong>real-time state</strong> of the system.
          The server handles all calculations, including location updates,
          pick-ups, drop-offs, and customer requests. The client polls for the
          data in short intervals.
        </p>
        <p className="pt-2 text-sm">
          The road network is implemented as a <strong>graph</strong> using an
          adjacency matrix. <strong>Breadth-First Search</strong> is used to
          find the shortest paths.
        </p>
      </>
    ),
    highlightedSelectors: ["[data-tour='map']"],
  },
  {
    selector: "[data-tour='list']",
    content: (
      <p className="text-sm">
        Customers are matched to the nearest available drivers. To keep the
        simulation performant, expensive calculations such as this one are
        offloaded to <strong>parallel processes</strong>.
      </p>
    ),
    highlightedSelectors: ["[data-tour='list']"],
  },
  {
    selector: "[data-tour='monitor']",
    content: (
      <p className="text-sm">
        The system is fully containerized with <strong>Docker</strong> and
        observable using <strong>Prometheus</strong> and{' '}
        <strong>Grafana</strong>. This setup proved useful when diagnosing
        various memory issues and concurrency bugs.
      </p>
    ),
    highlightedSelectors: ["[data-tour='monitor']"],
  },
];

const App = () => {
  const redirect = useNavigate();
  const [step, setStep] = useState(0);

  const setCurrentStep = (step) => {
    const redirects = {
      0: '/map',
      1: '/map',
      2: '/monitor',
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
      <div className="App">
        <aside
          className=" border-r-2 border-slate-200 relative"
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
              <div className="relative h-full w-full">
                <div className="absolute pt-5 pb-5 border-t-2 w-full">
                  <TourStart setStep={setStep} />
                  <p className="text-sm pt-5">
                    <span className="font-mono bg-blue-50 text-blue-700 rounded px-1 py-0.5">
                      rides
                    </span>{' '}
                    is a full-stack simulation of a ride-hailing app such as{' '}
                    <span className="font-bold">Uber</span> or{' '}
                    <span className="font-bold">Bolt</span>.
                  </p>
                  <p className="text-sm mt-4">
                    This project is my take on building and visualizing a
                    scalable system. My motivation was to implement various
                    system design concepts, including{' '}
                    <span className="font-bold">containerization</span>,{' '}
                    <span className="font-bold">multiprocessing</span> and{' '}
                    <span className="font-bold">observability</span>.
                  </p>
                  {/* <p className="text-sm mt-4">
                    Other notable topics include the graph theory, deployment
                    pipelines, security and visual design.
                  </p> */}
                  <p className="text-sm mt-4">
                    This project took me approximately 300 hours of work. Read
                    about the journey of building it on
                    <a
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                      href="https://jurajmajerik.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      &nbsp;my blog
                    </a>
                    .
                  </p>
                </div>
              </div>
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

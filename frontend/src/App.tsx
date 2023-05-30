import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { TourProvider, useTour } from '@reactour/tour';
import Nav from './Nav';
import Bio from './Bio';
import Link from './Link';
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
          The map visualizes the real-time state of the system. The server
          handles all calculations, including location updates, pick-ups,
          drop-offs, and customer requests. The client polls for the data in
          short intervals.
        </p>
        <p className="pt-2 text-sm">
          The road network is implemented as a graph using an adjacency matrix.
          Breadth-First Search is used to find the shortest paths.
        </p>
        <p className="mt-4">
          <Link
            url="https://jurajmajerik.com/blog/draw-map/"
            text={'#12 Drawing a map'}
          />
          <br />
          <Link
            url="https://jurajmajerik.com/blog/moving-car/"
            text={'#23 Moving a car'}
          />
          <br />
          <Link
            url="https://jurajmajerik.com/blog/simulation-engine/"
            text={'#28 Simulation engine'}
          />
          <br />
        </p>
      </>
    ),
    highlightedSelectors: ["[data-tour='map']"],
  },
  {
    selector: "[data-tour='list']",
    content: (
      <>
        <p className="text-sm">
          Customers are matched to the nearest available drivers. To keep the
          simulation performant, expensive calculations such as this one are
          offloaded to parallel processes.
        </p>
        <p className="mt-4">
          <Link
            url="https://jurajmajerik.com/blog/parallel-processing-nodejs/"
            text={'#29 Multiprocessing in Node.js'}
          />
          <br />
          <Link
            url="https://jurajmajerik.com/blog/generating-destinations/"
            text={'#30 Generating destinations'}
          />
          <br />
          <Link
            url="https://jurajmajerik.com/blog/matching-drivers-customers/"
            text={'#31 Matching drivers with customers'}
          />
          <br />
        </p>
      </>
    ),
    highlightedSelectors: ["[data-tour='list']"],
  },
  {
    selector: "[data-tour='monitor']",
    content: (
      <>
        <p className="text-sm">
          The system is fully containerized with <strong>Docker</strong> and
          observable using <strong>Prometheus</strong> and{' '}
          <strong>Grafana</strong>. This setup proved useful when diagnosing
          various memory issues and concurrency bugs.
        </p>
        <p className="mt-4">
          <Link
            url="https://jurajmajerik.com/blog/monitoring-logging/"
            text={'#34 Monitoring & logging'}
          />
          <br />
        </p>
      </>
    ),
    highlightedSelectors: ["[data-tour='monitor']"],
  },
  {
    selector: "[data-tour='docs']",
    content: (
      <>
        <p className="text-sm">
          The documentation explains the architecture of the system and gives
          reasoning for the technical choices I've made.
        </p>
        <div className="mt-8 w-full text-center">
          <button
            className="m-auto text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            // @ts-ignore
            onClick={() => window.reactour.setIsOpen(0)}
          >
            Finish
          </button>
        </div>
      </>
    ),
    highlightedSelectors: ["[data-tour='docs']"],
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
      <div className="App">
        <aside
          className="text-slate-800 border-r-2 border-slate-200 relative"
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
                    concepts from the domain of system design, including{' '}
                    <span className="font-bold">containerization</span>,{' '}
                    <span className="font-bold">multiprocessing</span> and{' '}
                    <span className="font-bold">observability</span>.
                  </p>
                  {/* <p className="text-sm mt-4">
                    Other notable topics include the graph theory, deployment
                    pipelines, security and visual design.
                  </p> */}
                  <p className="text-sm mt-4">
                    This project took approximately 300 hours of work. Read
                    about the journey of building it on
                    <a
                      className="text-blue-600 hover:text-blue-700 transition-colors"
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

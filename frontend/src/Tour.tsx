import Link from './Link';
import { useTour } from '@reactour/tour';
import { useNavigate } from 'react-router-dom';

export const TourStart = ({ setStep }) => {
  const { setIsOpen } = useTour();
  // @ts-ignore
  window.reactour = { setIsOpen };
  const redirect = useNavigate();

  const startTour = () => {
    setStep(0);
    redirect('/map');
    setIsOpen(true);
  };

  return (
    <button
      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      onClick={startTour}
    >
      <div className="inline-flex" style={{ transform: 'translateY(2px)' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="20"
          width="20"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span className="ml-3">WALK THROUGH</span>
      </div>
    </button>
  );
};

export const steps = [
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
        {/* <p className="pt-2 text-sm">
          The road network is implemented as a graph using an adjacency matrix.
          Breadth-First Search is used to find the shortest paths.
        </p> */}
        <p className="pt-2 text-sm">
          The <em>grey</em> paths lead from the driver to the customer. The{' '}
          <em>black</em> paths lead to the final destinations.
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

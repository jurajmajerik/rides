import { Outlet } from 'react-router';
import Nav from './Nav';
import Bio from './Bio';
import '../assets/css/all.min.css';

const App = () => {
  return (
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
              <div
                className="absolute pt-5 pb-5 border-t-2 w-full"
                // style={{ top: '45%', transform: 'translateY(-45%)' }}
              >
                <p className="text-sm">
                  <span className="font-mono bg-blue-50 text-blue-700 rounded px-1 py-0.5">
                    rides
                  </span>{' '}
                  is a full-stack simulation of a ride-hailing app such as{' '}
                  <span className="font-bold">Uber</span> or{' '}
                  <span className="font-bold">Lyft</span>.
                </p>
                <p className="text-sm mt-4">
                  This project is my take on building and visualizing a scalable
                  system. My motivation was to implement various system design
                  concepts, including{' '}
                  <span className="font-bold">containerization</span>,{' '}
                  <span className="font-bold">multiprocessing</span> or{' '}
                  <span className="font-bold">monitoring</span>.
                </p>
                <p className="text-sm mt-4">
                  Other notable topics include the graph theory, deployment
                  pipelines, security and visual design.
                </p>
                <p className="text-sm mt-4">
                  So far, this project took me around 300 hours of work. Read
                  how I'm building it on
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
        <Outlet />
      </div>
    </div>
  );
};

export default App;

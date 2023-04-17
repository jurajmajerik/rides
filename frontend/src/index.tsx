import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GeoMap from './GeoMap';
import ErrorPage from './error-page';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import disableReactDevTools from './disableReactDevTools.js';

disableReactDevTools();

const MapView = () => (
  <div className="view-map">
    <GeoMap />
    <div className="description">
      <p className="mt-6 space-y-7 text-sm text-zinc-600 dark:text-zinc-400">
        <em>Rides</em>
        &nbsp;is my take on building and visualizing a scalable system. Read
        more at
        <a
          className="text-blue-500 hover:text-blue-600 transition-colors"
          href="https://jurajmajerik.com"
          target="_blank"
          rel="noreferrer"
        >
          &nbsp;jurajmajerik.com
        </a>
      </p>
    </div>
  </div>
);

const SystemDesignView = () => <h1>System Design View</h1>;

const MonitorView = () => (
  <div className="relative w-full h-full">
    <iframe
      src="https://rides.jurajmajerik.com/grafana/d/VHZrYwBVk/dashboard-1?orgId=1&refresh=5s&kiosk"
      className="
      w-full
      h-full
      "
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: async ({ request }) => {
      if (request.url.endsWith('/')) return redirect('/map');
      return null;
    },
    children: [
      {
        path: 'map',
        element: <MapView />,
      },
      {
        path: 'monitor',
        element: <MonitorView />,
      },
      // {
      //   path: 'system-design',
      //   element: <SystemDesignView />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

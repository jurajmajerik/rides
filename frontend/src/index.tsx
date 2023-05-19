import React from 'react';
import ReactDOM from 'react-dom/client';
import { TourProvider } from '@reactour/tour';
import './index.css';
import App from './App';
import GeoMap from './GeoMap';
import ErrorPage from './error-page';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import disableReactDevTools from './disableReactDevTools.js';

disableReactDevTools();

const SystemDesignView = () => <h1>System Design View</h1>;
const Docs = () => <h1>Docs View</h1>;

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

const steps = [
  {
    selector: '.first-step',
    content: 'This is my first step',
  },
  {
    selector: '.second-step',
    content: 'This is my second step',
    action: (elem) => {
      // return redirect('monitor');
    },
  },
  // ...
];

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
        element: <GeoMap />,
      },
      {
        path: 'monitor',
        element: <MonitorView />,
      },
      {
        path: 'docs',
        element: <Docs />,
      },
      // {
      //   path: 'system-design',
      //   element: <SystemDesignView />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <TourProvider steps={steps}>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  // </TourProvider>
);

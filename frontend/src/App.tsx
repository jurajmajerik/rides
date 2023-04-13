import GeoMap from './GeoMap';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';

const paths = {
  map: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
    />
  ),
  'system-design': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  ),
  monitor: (
    // <path
    //   strokeLinecap="round"
    //   strokeLinejoin="round"
    //   d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
    // />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
    />
  ),
};

const IconWrapper = ({ path }) => (
  <div className="mr-2" style={{ width: '20px', height: '20px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      style={{ width: '100%', height: '100%' }}
    >
      {paths[path]}
    </svg>
  </div>
);

const Menu = () => {
  const Li = ({ label, icon }) => (
    <li className="inline-flex w-full p-2 text-sm font-semibold hover:bg-blue-50 rounded-md cursor-pointer transition-all">
      {icon}
      {label}
    </li>
  );

  const config = [
    ['map', 'Map'],
    ['system-design', 'System Design'],
    ['monitor', 'Monitor'],
  ];

  const lis = config.map(([key, label]) => (
    <Li key={key} label={label} icon={<IconWrapper path={key} />} />
  ));

  return <ul className="p-2">{lis}</ul>;
};

const App = () => {
  return (
    <div className="App">
      <aside className="p-2">
        <Menu />
      </aside>
      <div className="content">
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
    </div>
  );
};

export default App;

import GeoMap from './GeoMap';

const Menu = () => {
  const Li = ({ label }) => (
    <li className="p-2 text-sm font-semibold hover:bg-blue-100 rounded-md cursor-pointer transition-all">
      {label}
    </li>
  );

  const lis = ['Map', 'System Design', 'Monitor', "What's Next?"].map(
    (label) => <Li label={label} />
  );

  return <ul className="p-2">{lis}</ul>;
};

const App = () => {
  return (
    <div className="App">
      {/* <aside className="">
        <Menu />
      </aside> */}
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

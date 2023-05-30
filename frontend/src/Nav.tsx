import { NavLink } from 'react-router-dom';

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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
    />
  ),
  blog: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  ),
};

const Icon = ({ type }) => (
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
      {paths[type]}
    </svg>
  </div>
);

const Nav = () => {
  const Li = ({ path, label }) => (
    <NavLink
      to={`/${path}`}
      className={({ isActive }) => {
        let className = 'inline-flex w-full rounded-md ';
        if (isActive) {
          className += 'bg-blue-50x text-blue-700';
        } else {
          className += 'text-slate-800';
        }
        return className;
      }}
    >
      <li
        id={path}
        className="inline-flex w-full p-2 text-sm font-semibold hover:text-blue-700 hover:bg-blue-50x cursor-pointer transition-all rounded-md"
      >
        <Icon type={path} />
        {label}
      </li>
    </NavLink>
  );

  const config = [
    ['map', 'Map'],
    ['monitor', 'Monitor'],
    ['system-design', 'System Design'],
  ];

  const lis = config.map(([key, label]) => (
    <Li key={key} path={key} label={label} />
  ));

  return (
    <ul className="mb-4">
      {lis}
      <a href="https://jurajmajerik.com/" target="_blank" rel="noreferrer">
        <li className="inline-flex w-full p-2 text-sm font-semibold hover:text-blue-700 hover:bg-blue-50x cursor-pointer transition-all rounded-md">
          <Icon type="blog" />
          Blog
        </li>
      </a>
    </ul>
  );
};
export default Nav;

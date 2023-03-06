const shapes = `
  <g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(4.199999999999999,4.199999999999999), scale(0.85)">
  <rect x="0" y="0" width="56.00" height="56.00" rx="28" fill="#ffffff" strokewidth="0"/>
  </g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.22400000000000003"/>
  <g id="SVGRepo_iconCarrier">
  <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"/>
  </g>
`;

const CustomerIcon = ({ x, y }: { x: number; y: number }) => (
  <svg
    style={{ position: 'relative', zIndex: 1 }}
    x={x}
    y={y}
    fill="#000000"
    width="20px"
    height="20px"
    viewBox="0 0 56.00 56.00"
    xmlns="http://www.w3.org/2000/svg"
    transform="matrix(1, 0, 0, 1, 0, 0)"
    dangerouslySetInnerHTML={{ __html: shapes }}
  />
);
export default CustomerIcon;

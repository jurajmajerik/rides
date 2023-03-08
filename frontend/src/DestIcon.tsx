const shapes = `
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Two-Tone" transform="translate(-649.000000, -1262.000000)">
      <g id="Communication" transform="translate(100.000000, 1162.000000)">
        <g id="Two-Tone-/-Communication-/-location_on" transform="translate(544.000000, 98.000000)">
          <g>
            <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
            <path
              d="M12,4 C9.24,4 7,6.24 7,9 C7,11.85 9.92,16.21 12,18.88 C14.11,16.19 17,11.88 17,9 C17,6.24 14.76,4 12,4 Z M12,11.5 C10.62,11.5 9.5,10.38 9.5,9 C9.5,7.62 10.62,6.5 12,6.5 C13.38,6.5 14.5,7.62 14.5,9 C14.5,10.38 13.38,11.5 12,11.5 Z"
              fill="#ffffff"></path>
            <path
              d="M12,2 C15.87,2 19,5.13 19,9 C19,14.25 12,22 12,22 C12,22 5,14.25 5,9 C5,5.13 8.13,2 12,2 Z M7,9 C7,11.85 9.92,16.21 12,18.88 C14.12,16.19 17,11.88 17,9 C17,6.24 14.76,4 12,4 C9.24,4 7,6.24 7,9 Z M12,11.5 C10.6192881,11.5 9.5,10.3807119 9.5,9 C9.5,7.61928813 10.6192881,6.5 12,6.5 C13.3807119,6.5 14.5,7.61928813 14.5,9 C14.5,10.3807119 13.3807119,11.5 12,11.5 Z"
              fill="#1D1D1D"></path>
          </g>
        </g>
      </g>
    </g>
  </g>
`;

const CustomerIcon = ({ x, y }: { x: number; y: number }) => (
  <svg
    style={{ position: 'relative', zIndex: 2 }}
    x={x}
    y={y}
    width="14px"
    height="20px"
    viewBox="0 0 14 20"
    transform="scale(1.5)"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    dangerouslySetInnerHTML={{ __html: shapes }}
  />
);
export default CustomerIcon;

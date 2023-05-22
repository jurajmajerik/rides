import { useTour } from '@reactour/tour';
import { useNavigate } from 'react-router-dom';

const TourStart = ({ setStep }) => {
  const { setIsOpen } = useTour();
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
        {/* <svg
          width="11px"
          height="14px"
          viewBox="0 0 11 14"
          style={{ transform: 'translateY(2px)' }}
        >
          <g
            id="Icons"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g id="Rounded" transform="translate(-753.000000, -955.000000)">
              <g id="AV" transform="translate(100.000000, 852.000000)">
                <g
                  id="-Round-/-AV-/-play_arrow"
                  transform="translate(646.000000, 98.000000)"
                >
                  <g>
                    <rect
                      id="Rectangle-Copy-50"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    ></rect>
                    <path
                      d="M7,6.82 L7,17.18 C7,17.97 7.87,18.45 8.54,18.02 L16.68,12.84 C17.3,12.45 17.3,11.55 16.68,11.15 L8.54,5.98 C7.87,5.55 7,6.03 7,6.82 Z"
                      id="🔹Icon-Color"
                      fill="#fff"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
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
export default TourStart;

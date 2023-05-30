import { useTour } from '@reactour/tour';
import { useNavigate } from 'react-router-dom';

const TourStart = ({ setStep }) => {
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
export default TourStart;

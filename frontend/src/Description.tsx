import { TourStart } from './Tour';

const Description = ({ setStep }) => (
  <div className="relative h-full w-full">
    <div className="absolute pt-5 pb-5 border-t-2 w-full">
      <TourStart setStep={setStep} />
      <p className="text-sm pt-5">
        <span className="font-mono bg-blue-50 text-blue-700 rounded px-1 py-0.5">
          rides
        </span>{' '}
        is a full-stack simulation of a ridesharing app.
      </p>
      <p className="text-sm mt-4">
        This project is my take on building and visualizing a scalable system.
        My motivation was to implement various concepts from the domain of
        system design, including{' '}
        <span className="font-bold">containerization</span>,{' '}
        <span className="font-bold">multiprocessing</span> and{' '}
        <span className="font-bold">observability</span>.
      </p>
      <p className="text-sm mt-4">
        This project took approximately 300 hours of work. Read about the
        journey of building it on
        <a
          className="text-blue-600 hover:text-blue-700 transition-colors"
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
);
export default Description;

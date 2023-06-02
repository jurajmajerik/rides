const Mobile = () => (
  <div className="block lg:hidden text-sm p-4 text-slate-700">
    <p className="text-sm pt-5">
      <span className="font-mono bg-blue-50 text-blue-700 rounded px-1 py-0.5">
        rides
      </span>{' '}
      is a full-stack simulation of a ridesharing app such as{' '}
      <span className="font-bold">Uber</span> or{' '}
      <span className="font-bold">Bolt</span>.
    </p>
    <p className="text-sm mt-4">
      This project is my take on building and visualizing a scalable system. My
      motivation was to implement various concepts from the domain of system
      design, including <span className="font-bold">containerization</span>,{' '}
      <span className="font-bold">multiprocessing</span> and{' '}
      <span className="font-bold">observability</span>.
    </p>
    <p className="text-sm mt-4">
      This project took approximately 300 hours of work. Read about the journey
      of building it on
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
    <div className="w-full inline-flex mt-14" style={{ height: '100px' }}>
      <div className="w-1/2">
        <img
          width="50px"
          height="50px"
          className="
          ml-auto
          rounded-full
          bg-zinc-100
          object-cover
          dark:bg-zinc-800
          border-2
          border-slate-200
          mr-7
        "
          src={require('../assets/images/bio.jpg')}
          alt="profile"
        />
      </div>
      <div className="w-1/2">
        <div style={{}}>
          <p className="font-semibold text-slate-800">Juraj Majerik</p>
          <div className=" text-slate-800 mt-1">
            <a
              href="https://twitter.com/JurajMajerik"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-twitter hover:text-slate-700" />
            </a>
            <a
              href="https://github.com/jurajmajerik"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-github ml-2 hover:text-slate-700" />
            </a>
            <a
              href="https://www.linkedin.com/in/jurajmajerik/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin ml-2 hover:text-slate-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <p className="p-3 mt-2 bg-blue-600 text-white rounded">
      A note to mobile users: this app is not yet optimized for small screens.
      To get the full experience, please view it on a large screen.
    </p>
  </div>
);
export default Mobile;

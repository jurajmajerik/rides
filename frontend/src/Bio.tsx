const Bio = () => (
  <div
    className="absolute left-0 right-0 bottom-0 flex w-full bg-white"
    style={{ height: '100px' }}
  >
    <div className="flex-1 ml-auto">
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
    <div className="flex-1">
      <div style={{ transform: 'translateX(-60px)' }}>
        <p className="text-center font-semibold text-slate-800">
          Juraj Majerik
        </p>
        <div className="text-center text-slate-800 mt-1">
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
);
export default Bio;

const Bio = () => (
  <div className="bio">
    <div className="bio-left">
      <img
        width="50px"
        height="50px"
        className="
        ml-4
        rounded-full
        bg-zinc-100
        object-cover
        dark:bg-zinc-800
        border-2
        border-slate-200
      "
        src={require('../assets/images/bio.jpg')}
        alt="profile"
      />
    </div>
    <div className="bio-right">
      <div className="text-center">
        <p className="font-semibold text-slate-800">Juraj Majerik</p>
        <div className="text-zinc-600 mt-1">
          <a
            href="https://twitter.com/JurajMajerik"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-twitter hover:text-zinc-700" />
          </a>
          <a
            href="https://github.com/jurajmajerik"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-github ml-2 hover:text-zinc-700" />
          </a>
          <a
            href="https://www.linkedin.com/in/jurajmajerik/"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-linkedin ml-2 hover:text-zinc-700" />
          </a>
        </div>
      </div>
    </div>
  </div>
);
export default Bio;

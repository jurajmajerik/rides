const Mobile = () => (
  <div className="block lg:hidden text-sm p-4 text-slate-700">
    <p>Dear mobile reader,</p>
    <p className="mt-4">
      You got me: this app is not yet responsive. To get the full experience,
      please view it on a large screen.
    </p>
    <div className="w-full inline-flex mt-10" style={{ height: '100px' }}>
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
  </div>
);
export default Mobile;

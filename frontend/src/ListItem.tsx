const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM8 13l-3.938.001A8.004 8.004 0 0 0 11 19.938V16a3 3 0 0 1-3-3zm11.938.001L16 13a3 3 0 0 1-3 3l.001 3.938a8.004 8.004 0 0 0 6.937-6.937zM14 12h-4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1zm-2-8a8.001 8.001 0 0 0-7.938 7H8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h3.938A8.001 8.001 0 0 0 12 4z"
      fill="#1e293b"
    />
  </svg>
);

const CustomerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="20"
    height="20"
    viewBox="0 0 100 100"
    enableBackground="new 0 0 100 100"
  >
    <path
      d="M50,23.333c-7.363,0-13.333,5.97-13.333,13.333C36.667,44.032,42.637,50,50,50s13.333-5.968,13.333-13.333
    C63.333,29.303,57.363,23.333,50,23.333z M50,43.333c-3.682,0-6.667-2.985-6.667-6.667S46.318,30,50,30s6.667,2.985,6.667,6.667
    S53.682,43.333,50,43.333z"
      fill="#1e293b"
    />
    <path
      d="M50,10c-22.093,0-40,17.909-40,40.001C10,72.09,27.907,90,50,90c22.09,0,40-17.91,40-39.999C90,27.909,72.09,10,50,10z
     M30,76.621V70c0-3.682,2.985-6.667,6.667-6.667h26.666C67.015,63.333,70,66.318,70,70v6.621c-5.576,4.196-12.487,6.712-20,6.712
    S35.573,80.817,30,76.621z M76.66,69.944c-0.029-7.334-5.983-13.277-13.327-13.277H36.667c-7.344,0-13.301,5.94-13.327,13.281
    c-4.173-5.566-6.673-12.458-6.673-19.947c0-18.411,14.922-33.335,33.333-33.335c18.408,0,33.333,14.924,33.333,33.335
    C83.333,57.49,80.833,64.382,76.66,69.944z"
      fill="#1e293b"
    />
  </svg>
);

const ListItem = ({ driverName, customerName }) => (
  <div className="w-full p-2 border-b-2 border-slate-200 text-slate-800 text-sm">
    <div className="flex">
      <div className="flex-1 p-1 border-1 border-slate-200 flex">
        <CustomerIcon />
        <div className="ml-2">{customerName.split(' ')[0]}</div>
      </div>
      <div className="flex-1 p-1 border-1 border-slate-200 flex">
        <Icon />
        <div className="ml-2">{driverName.split(' ')[0]}</div>
      </div>
    </div>
  </div>
);
export default ListItem;

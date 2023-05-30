import { SteeringWheelIcon, ListCustomerIcon } from './Icons';

const ListItem = ({
  driverId,
  customerId,
  driverName,
  customerName,
  progress,
  status,
}) => {
  const tagClasses = {
    pickup:
      'm-auto mt-3 w-24 rounded text-xs p-0.5 font-semibold bg-zinc-150 text-slate-700 text-center uppercase status-tag',
    enroute:
      'm-auto mt-3 w-24 rounded text-xs p-0.5 font-semibold bg-zinc-150 text-slate-700 text-center uppercase status-tag',
  };
  const statusClasses = {
    pickup: 'bg-cyan-500 inline-block mr-2',
    enroute: 'bg-emerald-500 inline-block mr-2',
  };

  return (
    <div className="w-full p-2 border-b-2 border-slate-200 text-slate-800 text-sm">
      <div className="flex mt-2">
        <div className="flex-1 p-1 mr-1 border-1 border-slate-200 flex justify-end">
          <div className="mr-2 font-semibold">{customerName.split(' ')[0]}</div>
          <ListCustomerIcon />
        </div>
        <div className="flex-1 p-1 ml-1 border-1 border-slate-200 flex">
          <SteeringWheelIcon />
          <div className="ml-2 font-semibold">{driverName.split(' ')[0]}</div>
        </div>
      </div>
      <div
        key={`${driverId}:${customerId}:${status}`}
        className={tagClasses[status]}
      >
        <span
          className={statusClasses[status]}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            transform: 'translateY(-1px)',
          }}
        ></span>
        <span>{status}</span>
      </div>
      <div className="m-2 mt-3 bg-gray-200 rounded-full h-0.5 dark:bg-gray-700">
        <div
          key={`${driverId}:${customerId}:${status}`}
          className="bg-slate-800 h-0.5 rounded-full"
          style={{
            width: `${progress}%`,
            transition: 'width 1.2s ease-in-out',
          }}
        ></div>
      </div>
    </div>
  );
};
export default ListItem;

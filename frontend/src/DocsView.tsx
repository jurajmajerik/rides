import ReactMarkdown from 'react-markdown';
const markdown1 = `
## System design
Rides simulates the basic flow of a ride-hailing app. It consists of three components:

- The __simulation engine__ (Node.js) generates a new state of the system and updates the database.
- The __database__ (PostgreSQL) persists the state.
- The **web server** (Go) exposes the state via a RESTful API to the client.

The system is running on a single machine with 2 GiB of memory.
`;

const markdown2 = `
At the center of the simulation are the Driver and Customer instances. These instances periodically make random decisions, within allowed constraints, and push their updated state to the database.

The simulation cycle is implemented by an infinite loop - every Driver and Customer runs its own cycle and makes decisions within allowed constraints. These decisions include, among others:
- Random spawn and deactivation.
- Advancement of the car on the map.
- Request for the optimal route.
- Request for the new destination.

There are multiple Driver and Customer instances running at the same time, within the same process. The simulation process is lightweight - its purpose is only to run the simulation loops and update the state.

To ensure the simulation stays performant and happens within the predefined interval, it is imperative that the main event loop is not blocked by more expensive calculations. Such calculations include:

- Generating destinations.
- Calculating the optimal route.
- Matching customers with drivers.

For this reason, these three computations are running as child processes. Each of these processes maintains a queue. Customer and Driver entities request data from these services as needed and wait for the response. They might complete several simulation cycles before the response arrives, at which point they receive the new data and start acting according to the new information.

### Route planner
At startup, the system generates a graph represented as an adjacency matrix. This matrix is generated from the set list of obstacles. While the backend uses this list to generate the matrix, the frontend uses it to render the map.
The route planner maintains its queue of route requests. When processing a request, it performs a breadth-first search to find the shortest route and sends it as a message to the main process. On receiving this message, the main process updates the respective Driver instance.

### Dispatcher
The dispatcher matches waiting customers with the nearest available drivers.
`;

const DocsView = () => {
  return (
    <div className="p-6 overflow-auto h-full docs">
      <ReactMarkdown children={markdown1} />
      <p className="pt-10 pb-10">
        <img
          className="m-auto"
          style={{ maxWidth: '800px' }}
          src={require('../assets/images/diagram-3.png')}
        />
      </p>
      <ReactMarkdown children={markdown2} />
    </div>
  );
};
export default DocsView;

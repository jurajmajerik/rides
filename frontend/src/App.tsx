import { Outlet } from 'react-router';
import Nav from './Nav';
import Bio from './Bio';
import '../assets/css/all.min.css';

const App = () => {
  return (
    <div className="App">
      <aside
        className="p-2 border-r-2 border-slate-200 relative"
        style={{ width: '400px' }}
      >
        <Nav />
        <Bio />
      </aside>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default App;

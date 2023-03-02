import React from 'react';
import Map from './Map';

const App = () => {
  return (
    <div className='App'>
      <Map />
      <div className='description'>
        <p>Rides is my attempt at building and visualizing a distributed system. Read more at <a href='https://jurajmajerik.com' target='_blank' rel='noreferrer'>jurajmajerik.com</a></p>
        {/* <p>Read about the step-by-step design process on my blog.</p> */}
      </div>
    </div>
  );
}

export default App;

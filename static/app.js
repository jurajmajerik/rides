const body = document.getElementById('main');

const gridSize = 500;

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('width', gridSize);
svg.setAttribute('height', gridSize);
svg.setAttribute('style', 'border:solid 0.5px lightgray;');

const gridCount = 27; // # squares in each direction
const squareSize = gridSize / gridCount;

const coords = {};

for (let x = 0; x < gridCount; x += 1) {
  for (let y = 0; y < gridCount; y += 1) {
    coords[`${x}:${y}`] = true;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', squareSize);
    rect.setAttribute('height', squareSize);
    rect.setAttribute('x', x * squareSize);
    rect.setAttribute('y', y * squareSize);
    // rect.setAttribute('stroke', 'black');
    // rect.setAttribute('stroke-width', 0.1);
    rect.setAttribute('fill', 'white');

    rect.addEventListener('click', () => {
      console.log(x, y);
    });
    
    svg.appendChild(rect);
  } 
}

const drawObstacle = (xStart, xEnd, yStart, yEnd, color) => {
  let x = xStart;
  while (x <= xEnd) {
    let y = yStart;
    while (y <= yEnd) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', squareSize);
      rect.setAttribute('height', squareSize);
      rect.setAttribute('x', x * squareSize);
      rect.setAttribute('y', y * squareSize);
      // rect.setAttribute('stroke', 'black');
      // rect.setAttribute('stroke-width', 0.1);
      rect.setAttribute('fill', color || '#d77a61');
      rect.setAttribute('stroke', color || '#d77a61');
      
      svg.appendChild(rect);
  
      y += 1;
    }
    x += 1;
  }
};

obstacles.forEach(args => {
  drawObstacle(...args);
});

body.appendChild(svg);

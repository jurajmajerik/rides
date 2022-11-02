// Graph generation

// Generate all coordinate combinations
// Each combination should hold information whether road or obstacle
// -- store when drawing the chart
// We start at 00, store the node, keep in memory ("previous" = node)
// We are at 01
//     if node type == road, store node, "previous" = node
//     if node type == obstacle, don't store node, "previous" = null


// Look, this is a 4-direction node; so at each coord, check: up[x, y + 1], right[x+1, y], down[x, y+1], left[x-1, y]
// If node found, you wanna attach that node to the current node; but what if the node doesn't exist yet?
// If it doesn't exist, create it and attach it to the current node
// If it exists, just attach it to the current node

// In the beginning, you will get coordinates: 50, 50
// Generate all coords combinations
// Iterate through coord combinations, to the above block at every combination
// Nodes are stored in an array as objects


// Graph operations

// We wanna be able to access the map at any point
// hashmap - large and expensive to build, entry quick
// array - easy to build, slow entry

const nodes = {
  '0:0': {}
};

const currentCoords = '0:0';
let counter = 0;

for (let x = 0; x < gridCount; x += 1) {
  for (let y = 0; y < gridCount; y += 1) {
    counter +=1;
    const coords = `${x}:${y}`;
    if (!mapPoints[coords]) continue; // obstacle, skip

    if (!nodes[coords]) nodes[coords] = {};
    const node = nodes[coords] || {};

    // Check if neighbours exist or not a boundary
    const upCoords = `${x}:${y - 1}`;
    if (y > 0 && gridSize && mapPoints[upCoords]) {
      if (!nodes[upCoords]) {
        nodes[upCoords] = { [coords]: node };
      }
      const neighbor = nodes[upCoords];
      node[upCoords] = neighbor;
    }
    
    const rightCoords = `${x + 1}:${y}`;
    if (x < gridCount - 1 && mapPoints[rightCoords]) {
      if (!nodes[rightCoords]) {
        nodes[rightCoords] = { [coords]: node };
      }
      const neighbor = nodes[rightCoords];
      node[rightCoords] = neighbor;
    }
    
    const downCoords = `${x}:${y + 1}`;
    if (y < gridCount - 1 && mapPoints[downCoords]) {
      if (!nodes[downCoords]) {
        nodes[downCoords] = { [coords]: node };
      }
      const neighbor = nodes[downCoords];
      node[downCoords] = neighbor;
    }

    const leftCoords = `${x - 1}:${y}`;
    if (x > 0 && mapPoints[leftCoords]) {
      if (!nodes[leftCoords]) {
        nodes[leftCoords] = { [coords]: node };
      }
      const neighbor = nodes[leftCoords];
      node[leftCoords] = neighbor;
    }
  } 
}

const wait = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 20);
  });
};

// const visited = [];
// const searchNode = async (coords) => {
//   const node = nodes[coords];
//   visited.push(node);
//   const rect = roadElems[coords];
//   rect.setAttribute('fill', 'gray');
//   for (let [coords, neighbor] of Object.entries(node)) {
//     if (visited.includes(neighbor)) continue;
//     await wait();
//     searchNode(coords);
//   }
// };
// searchNode('12:24');


const finish = '18:26'
const queue = [
  ['0:0'],
];
const paths = [];

let previous = null;
let shortest = Infinity;

counter = 0;
while (queue.length) {
  counter += 1;
// while (queue.length) {
  const queueItem = queue.shift();
  const coords = queueItem[queueItem.length - 1];
  const node = nodes[coords];

  for (let [neighborCoords, neighbor] of Object.entries(node)) {
    if (neighborCoords === previous) continue; // can't go back
    if (queueItem.includes(neighborCoords)) continue; // 
    if (neighborCoords === finish) {
      const completePath = queueItem.concat(neighborCoords);
      paths.push(completePath);
      if (completePath.length < shortest) shortest = completePath.length;
    }
    const newItem = queueItem.concat(neighborCoords);
    if (newItem.length <= shortest) queue.push(newItem);
  }  

  previous = coords; 
}
console.log(paths);

const path = paths[0];
console.log(path);

const drawPath = async (path) => {
  for (const coords of path) {
    await wait();
    const rect = roadElems[coords];
    rect.setAttribute('fill', 'gray');
  }
};
drawPath(path);

// // Find path
// const findPath = (start, finish) => {
//   const paths = [
//     [start],
//   ];
//   const previous = null;
//   const current = nodes[start];

//   for (let [coords, neighbor] of Object.entries(node)) {
//     if (coords === previous) continue; // can't go back

//   }

//   // If we reach the same point (a cycle), we should return

// };
// findPath('0:0', '6:3');


// What should Dijkstra return to us?
// Directions at every node
// Directions are specified with coordinates
// >0:0, >1:0, >2:2, >3:0, >4:0, >5:0, ⌄5:1, ⌄5:2
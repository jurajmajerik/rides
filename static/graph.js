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

console.log(obstacles);

const node00 = {
  '10': node10,
  '01': node01,
};
const node10 = {};
const node01 = {};

const nodes = [node00, node10, node01];

const nodes = {
  '00': [node10, node01],
  '10': [node00],
  '01': [node00],
};



class Graph {

}


import { getRoadNodes, wait, getRandomInt, decide, getGraph } from './utils.js';

const graph = getGraph();

import v8 from 'v8';

// Your dynamic data structure

// Serialize the data structure to a string
const serializedData = v8.serialize(graph);

// Get the size of the serialized data in bytes
const dataSize = Buffer.byteLength(serializedData, 'utf8');

// Get the heap memory statistics
const heapStats = v8.getHeapStatistics();

console.log(`Size of data structure: ${dataSize} bytes`);
console.log(`Heap size limit: ${heapStats.heap_size_limit} bytes`);
console.log(`Heap used: ${heapStats.used_heap_size} bytes`);
console.log(`Heap used: ${(heapStats.used_heap_size*100/heapStats.heap_size_limit).toFixed(2)} %`);
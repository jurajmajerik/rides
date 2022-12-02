const nodes = { '0:0': {} };

const main = async () => {
  const visited = {};

  const highlightVisited = async (coords) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1);
    });
    const rect = points[coords];
    rect.setAttribute('fill', '#b0b0b0');
  };

  const build = async ({ x, y }) => {
    visited[`${x}:${y}`] = true;
    const currentNode = nodes[`${x}:${y}`];

    await highlightVisited(`${x}:${y}`);
  
    const neighbours = [
      [x, y - 1],
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
    ];
  
    for (const [x, y] of neighbours) {
      const coords = `${x}:${y}`;
      if (points[coords]) {
        nodes[coords] = nodes[coords] || {};
        currentNode[coords] = nodes[coords];
        if (!visited[coords]) await build({ x, y });
      }
    }
  };
  await build({ x: 0, y: 0 });
};
main();

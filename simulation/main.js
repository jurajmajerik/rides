const { Client } = require('pg');

const wait = (t) => new Promise((res) => {
  setTimeout(() => {
    res();
  }, t);
});

const paths = {
  first: [
    [8,17],
    [8,16],
    [8,15],
    [8,14],
    [7,14],
    [6,14],
    [6,13],
    [6,12],
    [6,11],
    [6,10],
    [6,9],
    [6,8],
    [6,7],
    [6,6],
    [7,6],
    [8,6],
    [9,6],
    [10,6],
    [11,6],
    [12,6],
    [12,7],
    [12,8],
    [12,9],
    [12,10],
    [12,11],
    [12,12],
    [12,13],
    [12,14],
    [13,14],
    [14,14],
    [15,14],
    [16,14],
    [16,13],
  ],
  second: [
    [16,12],
    [16,11],
    [17,11],
    [18,11],
    [19,11],
    [20,11],
    [21,11],
    [22,11],
    [23,11],
    [24,11],
    [25,11],
    [26,11],
    [26,12],
    [26,13],
    [26,14],
    [26,15],
    [26,16],
    [26,17],
    [26,18],
    [26,19],
    [26,20],
    [26,21],
    [26,22],
    [25,22],
    [24,22],
    [23,22],
    [22,22],
    [21,22],
    [20,22],
    [20,23],
    [20,24],
    [19,24],
    [18,24],
    [17,24],
    [16,24],
    [15,24],
    [14,24],
    [13,24],
    [12,24],
    [11,24],
    [10,24],
    [9,24],
    [8,24],
    [8,23],
    [8,22],
    [8,21],
    [8,20],
    [8,19],
    [8,18],
  ]
};

const main = async () => {
  await wait (2000);
  const client = new Client({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'mysecretpassword',
  });

  client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  });

  let path = 'first';
  let i = 0;
  while (true) {
    const [x, y] = paths[path][i];
    await client.query(
      `
      INSERT INTO rides (car_id, location, path) 
      VALUES ('car1', '${x}:${y}', '${JSON.stringify(paths[path])}')
      ON CONFLICT (car_id) 
      DO UPDATE SET location = EXCLUDED.location, path = EXCLUDED.path;
      `
    );

    if (i === paths[path].length - 1) {
      path = path === 'first' ? 'second' : 'first';
      i = 0;
    } else {
      i++;
    }
    await wait(300);
  }
};
main();

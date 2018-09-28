const mysql = require("mysql");

exports.handler = (event, context, callback) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.connect(function(err) {
    if (err) {
      callback(err);
    }
  });

  connection.query("SELECT COUNT(*) AS count FROM thatsweb", (err, results) => {
    if (err) {
      callback(err);
    }

    const { count } = results[0];

    // TODO: probably a better way...
    let query = "SELECT uuid FROM thatsweb ORDER BY (id * RAND())";

    if (count > 20) {
      query += " LIMIT 20;";
    }

    connection.query(query, (err, results) => {
      if (err) {
        callback(err);
      }

      function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      connection.end(() =>
        callback(null, {
          memes: shuffle(results.map(({ uuid }) => uuid))
        })
      );
    });
  });
};

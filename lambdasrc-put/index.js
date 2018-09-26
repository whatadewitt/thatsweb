const AWS = require("aws-sdk");
const mysql = require("mysql");
const gm = require("gm").subClass({ imageMagick: true }); // Enable ImageMagick integration.

const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
  const key = event.Records
    ? event.Records[0].s3.object.key
    : process.env.TEST_IMAGE;

  const inputParams = {
    Bucket: process.env.TRIGGER_BUCKET,
    Key: key
  };

  // download image from s3 that triggered the lambda event
  return s3.getObject(inputParams, (err, data) => {
    if (err) {
      callback(err);
    }
    const input = data.Body;

    // composite the meme image on top of the uploaded image
    gm(input, "input.png")
      .composite("./thatsweb.png")
      .stream("png", (err, stdout, stderr) => {
        let buf = new Buffer("");

        stdout.on("data", data => {
          buf = Buffer.concat([buf, data]);
        });

        stdout.on("end", data => {
          // upload the meme to s3
          const destinationParams = {
            Bucket: process.env.DESTINATION_BUCKET,
            Key: key,
            Body: buf,
            ContentType: "image/png"
          };

          s3.putObject(destinationParams, (err, res) => {
            if (err) {
              callback(err);
            }

            // write the record to dynamo
            const regexPattern = /uploads\/(\w+)\.png/g;
            const recordId = regexPattern.exec(key);

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

            const record = {
              uuid: recordId[1],
              ip: event.Records
                ? event.Records[0].requestParameters.sourceIPAddress
                : "testing-ip"
            };

            connection.query("INSERT into thatsweb SET ?", record, err => {
              if (err) {
                callback(err);
              }

              connection.end(() => callback());
            });
          });
        });
      });
  });
};

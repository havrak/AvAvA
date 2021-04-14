const https = require("http");

//const route = "/api/instances/199";
const route = "/api/projects/72";

const options = {
  hostname: "localhost",
  port: 5000,
  path: route,
  method: "DELETE",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();

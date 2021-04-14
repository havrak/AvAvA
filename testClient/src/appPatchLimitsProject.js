const https = require("http");

const route = "/api/projects/82";
const data = JSON.stringify({
  name: "cool coo2l",
  limits: {
    RAM: 2,
    CPU: 2,
    disk: 2,
    internet: {
      download: 20,
      upload: 20,
    },
  },
});
const options = {
  hostname: "localhost",
  port: 5000,
  path: route,
  method: "PATCH",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": data.length,
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

req.write(data);
req.end();

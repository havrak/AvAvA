const https = require("http");

const route = "/api/projects";
const data = JSON.stringify({
  name: "Project 3",
  limits: {
    RAM: null,
    CPU: null,
    disk: null,
    internet: {
      download: null,
      upload: null,
    },
  },
});
const options = {
  hostname: "localhost",
  port: 5000,
  path: route,
  method: "POST",
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

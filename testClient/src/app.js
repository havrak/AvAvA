const https = require("http");

const route = "/project";

const data = JSON.stringify({
  name: "string",
  customLimits: {
    RAM: 0,
    CPU: 0,
    disk: 0,
    network: {
      upload: 0,
      download: 0,
    },
  },
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: route,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
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

const https = require("http");

const route = "/api/instances";
const data = JSON.stringify({
  name: "otesanek2",
  rootPassword: "string",
  projectId: 69,
  templateId: 2,
  applicationsToInstall: [],
  limits: {
    RAM: 1409286144,
    CPU: 1837500000,
    disk: 4294967296,
    internet: {
      download: 400000,
      upload: 400000,
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

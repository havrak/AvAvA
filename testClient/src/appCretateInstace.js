const https = require("http");

const route = "/api/instances";
const data = JSON.stringify({
  name: "bubak",
  rootPassword: "string",
  projectId: 82,
  templateId: 2,
  applicationsToInstall: [],
  limits: {
    RAM: 14,
    CPU: 18,
    disk: 0,
    internet: {
      download: 40,
      upload: 40,
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

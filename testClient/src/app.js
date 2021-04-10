const https = require("http");

const route = "/instances";

const data = JSON.stringify({
  name: "belzebub",
  rootPassword: "string",
  projectId: 18,
  templateId: 2,
  applicationsToInstall: [6, 7, 10],
  limits: {
    RAM: 1073741824,
    CPU: 10,
    disk: 8368709120,
    internet: {
      download: 10000,
      upload: 10000,
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

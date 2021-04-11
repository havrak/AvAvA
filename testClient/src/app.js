const https = require("http");

const route = "/api/instances";
// const data = JSON.stringify({
//   name: "string",
//   limits: {
//     RAM: 0,
//     CPU: 0,
//     disk: 0,
//     internet: {
//       download: 0,
//       upload: 0,
//     },
//   },
// });
const data = JSON.stringify({
  name: "dindu",
  rootPassword: "string",
  projectId: 19,
  templateId: 2,
  applicationsToInstall: [],
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

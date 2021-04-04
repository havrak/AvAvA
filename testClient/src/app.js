const https = require("http");

const route = "/instances";

const data = JSON.stringify({
  name: "testContainer",
  projectId: 18,
  autostart: true,
  templateId: 2,
  stateful: true,
  applicationsToInstall: [
    {
      id: 1,
      name: "git",
      description: "bezne pouzivany verzovaci system",
      icon: "string",
    },
    {
      id: 2,
      name: "vim",
      description: "description",
      icon: "string",
    },
    {
      id: 3,
      name: "ranger",
      description: "description",
      icon: "string",
    },
  ],
  connectToInternet: true,
  customLimits: {
    RAM: 0,
    CPU: 0,
    disk: 5368709120,
    internet: {
      download: 0,
      upload: 0,
    },
  },
});

// const data = JSON.stringify({
//   name: "testProjects",
//   customLimits: {
//     RAM: 2147483648,
//     CPU: 10,
//     disk: 10737418240,
//     network: {
//       upload: 100000000,
//       download: 100000000,
//     },
//   },
// });

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

const https = require("http");

const route = "/api/projects/69";
const data = JSON.stringify({
  name: "LiMItY NeMuZOu bYT nUloVe",
  limits: {
    RAM: 1610612931,
    CPU: 2200000000,
    disk: 8589934692,
    internet: {
      download: 800020,
      upload: 800020,
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

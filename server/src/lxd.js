import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/*
let crt, key;
fs.readFile("../config/lxcclient.crt", "utf8", (err, data) => {
  if (err) throw err;
  crt = data;
  console.log("Crt: " + data);
});
fs.readFile("../config/lxcclient.key", "utf8", (err, data) => {
  if (err) throw err;
  key = data;
  console.log("Key: " + key);
});
*/
let options = {
  method: "GET",
  hostname: "127.0.0.1",
  port: 8443,
  path: "/1.0",
  json: true,
  key: fs.readFileSync(path.resolve(__dirname, "../config/lxcclient.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../config/lxcclient.crt")),
  //  resolveWithFullResponse: true,
  rejectUnauthorized: false,
};

let request = https.request(options, (res) => {
  console.log(res.statusCode);
  res.on("data", (data) => {
    console.log("LXD: " + data);
  });
});

export { request };

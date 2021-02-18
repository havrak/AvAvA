import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let options = {
  method: "GET",
  hostname: "127.0.0.1",
  port: 8443,
  path: "/1.0",
  json: true,
  key: fs.readFileSync(path.resolve(__dirname, "../../config/lxcclient.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../../config/lxcclient.crt")),
  //  resolveWithFullResponse: true,
  rejectUnauthorized: false,
};
//Promise.all
export function test() {
  getInstances().then((d) => {
    getInstance(d[0].substring(15))
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  });
}

function mkRequest(opts) {
  return new Promise((resolve, err) => {
    https.get(opts, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        body = JSON.parse(body.toString());
        res.statusCode < 400 ? resolve(body.metadata) : err(body);
      });
    });
  });
}

export function getInstances() {
  options.path = "/1.0/instances";
  return mkRequest(options);
}

export function getInstance(id) {
  options.path = "/1.0/instances/" + id;
  return mkRequest(options);
}

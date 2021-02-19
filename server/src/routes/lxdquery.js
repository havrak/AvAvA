import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import * as RS from "../models/ResourceState.js";
import Instance from "../models/Instance.js";
import Template from "../models/Template.js";
import OperationState from "../models/OperationState.js";
import Snapshot from "../models/Snapshot.js";
import os from "os";
const key = fs.readFileSync(
  path.resolve(__dirname, "../../config/lxcclient.key")
);
const crt = fs.readFileSync(
  path.resolve(__dirname, "../../config/lxcclient.crt")
);

function mkOpts(path) {
  return {
    method: "GET",
    hostname: "127.0.0.1",
    port: 8443,
    path: path,
    json: true,
    key: key,
    cert: crt,
    //  resolveWithFullResponse: true,
    rejectUnauthorized: false,
  };
}

function mkRequest(opts) {
  return new Promise((resolve, err) =>
    https.get(opts, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        body = JSON.parse(body.toString());
        res.statusCode < 400 ? resolve(body.metadata) : err(body);
      });
    })
  );
}

export async function test() {
  let instance = await getInstances();
  instance = await getInstance(instance[0].substring("15"));
  //console.log(instance);
  //console.log((await getSnapshots(instance.id))[0]);
  //console.log((await getState(instance.id)).CPU.percentConsumed);
}

// may need userID, not sure what it's supposed to do
export async function getOverallState() {
  //foreach getInstances() getState(id)
}

export async function getInstances() {
  return mkRequest(mkOpts("/1.0/instances"));
}

// Returns Instance object, filled in Template.image,
// id, persistent, timestamp, OperationState.
export async function getInstance(id) {
  let data = await mkRequest(mkOpts("/1.0/instances/" + id));
  let instance = new Instance(id);
  instance.OperationState = new OperationState(data.status, data.status_code);
  instance.timestamp = new Date(data.created_at).getTime();
  instance.persistent = data.type == "persistent";
  instance.template = new Template();
  if (data.config["image.os"] !== undefined) {
    instance.template.image.os = data.config["image.os"];
    instance.template.image.version = data.config["image.version"];
    instance.template.image.description = data.config["image.description"];
  }
  return instance;
}

export async function getState(id) {
  let limit;
  mkRequest(mkOpts("/1.0/instances/" + id)).then(
    (d) =>
      (limit =
        d.config.limits === undefined || d.config.limits.cpu === undefined
          ? 0
          : d.config.limits.cpu)
  );
  let data = await mkRequest(mkOpts("/1.0/instances/" + id + "/state"));
  let rs;
  //use the time efficiently and while the measurement waits
  //for another measure, we put all available data in its place
  await new Promise((resolve) => {
    rs = new RS.ResourceState();
    rs.OperationState = new OperationState(data.status, data.status_code);
    rs.CPU.consumedTime = data.cpu.usage;
    rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
    rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
    if (data.disk.root !== undefined) {
      let used = new RS.UserDiskSpace();
      //used.usage = data.disk.root.usage; //must be divided by users
      //https://discuss.linuxcontainers.org/t/how-to-check-lxd-container-size-and-how-much-space-they-are-tacking/4770/3
      rs.disk.currentlyCosumedMemory.push(used);
    }
    Object.keys(data.network).forEach((key) => {
      let lxdn = data.network[key];
      let network = new RS.Network();
      network.networkName = key;
      network.addresses = lxdn.addresses;
      network.counters.bytesRecieved = lxdn.bytes_recieved;
      network.counters.bytesSent = lxdn.bytes_sent;
      network.counters.packetsRecieved = lxdn.packets_recieved;
      network.counters.packetsSent = lxdn.packets_sent;
      network.hwaddr = lxdn.hwaddr;
      network.hostName = lxdn.host_name;
      network.mtu = lxdn.mtu;
      network.state = lxdn.state;
      network.type = lxdn.type;
      rs.networks.push(network);
    });
    rs.numberOfProcesses = data.processes;
    setTimeout(resolve, 1000);
  }, 1000);
  let dataNew = await mkRequest(mkOpts("/1.0/instances/" + id + "/state"));
  rs.CPU.percentConsumed =
    (dataNew.cpu.usage - data.cpu.usage) /
    10000000 /
    (limit < 1 ? os.cpus().length - 6 : limit);
  return rs;
}

// Returns array of snapshot objects for the given container.
export async function getSnapshots(id) {
  let snaps = await mkRequest(mkOpts("/1.0/instances/" + id + "/snapshots"));
  let prefix = ("/1.0/instances/" + id + "/snapshots/").length;
  let snapshots = new Array();
  for (let i = 0; i < snaps.length; i++) {
    snapshots.push(await getSnapshot(id, snaps[i].substring(prefix)));
  }
  return snapshots;
}

export async function getSnapshot(id, sid) {
  let data = await mkRequest(
    mkOpts("/1.0/instances/" + id + "/snapshots/" + sid)
  );
  return new Snapshot(
    sid,
    data.name,
    new Date(data.created_at).getTime(),
    data.stateful
  );
}

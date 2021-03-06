import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import * as RS from "../models/ResourceState.js";
import Instance from "../models/Instance.js";
import Template from "../models/Template.js";
import Image from "../models/Image.js";
import OperationState from "../models/OperationState.js";
import Snapshot from "../models/Snapshot.js";
import os from "os";
const key = fs.readFileSync(
  path.resolve(__dirname, "../../config/lxcclient.key")
);
const crt = fs.readFileSync(
  path.resolve(__dirname, "../../config/lxcclient.crt")
);

function mkOpts(path, method) {
  return {
    method: method || "GET",
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

function mkRequest(path, method, data) {
  let opts = mkOpts(path, method);
  console.log({ path: path, method: method, data: data });
  if (data !== undefined) {
    data = JSON.stringify(data);
    opts.headers = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    };
  }
  return new Promise((resolve) => {
    let req = https.request(opts, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (d) => (body += d));
      res.on("end", () =>
        res.statusCode < 300
          ? resolve(JSON.parse(body).metadata)
          : resolve(JSON.parse(body))
      );
    });
    if (data !== undefined) req.write(data);
    req.end();
  });
}

export async function test() {
  /*(await mkRequest(`/1.0/instances/test/backups`)).forEach((b) =>
		deleteBackup(b)
	);*/
  /*exportInstance("test", (res) =>
			res.pipe(fs.createWriteStream("testBack.tar.gz"))
	);*/
  /*console.log(
		await importBackup("testImport", fs.createReadStream("testBack.tar.gz"))
	);*/
  //console.log(await stopInstance("test"));
  //console.log(await getState(instances[0].id));
  //await stopInstance("test");
  //await startInstance("testImport");
  //getInstances();
  // console.log(await createSnapshot("test", "snap1", false));
}

// may need userID, not sure what it's supposed to do
export async function getOverallState() {
  //foreach getInstances() getState(id)
}

export async function getInstances() {
  let routes = await mkRequest("/1.0/instances");
  let instances = new Array();
  for (let i = 0; i < routes.length; i++) {
    instances.push(await getInstance(routes[i].substring("15")));
  }
  return instances;
}

export async function createInstance(data) {
  return await getOperation(
    (await mkRequest(`/1.0/instances`, "POST", data)).id
  );
}

// Returns Instance object, filled in Template.image,
// id, persistent, timestamp, OperationState.
export async function getInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`);
  console.log(res);
  let instance = new Instance(id);
  instance.OperationState = new OperationState(res.status, res.status_code);
  instance.timestamp = new Date(res.created_at).getTime();
  instance.persistent = res.type == "persistent";
  instance.stateful = res.stateful;
  instance.template = new Template();
  if (res.config["image.os"] !== undefined) {
    instance.template.image = new Image(
      res.config["image.os"],
      res.config["image.version"],
      res.config["image.description"]
    );
  }
  return instance;
}

export async function deleteInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`, "DELETE");
  if (res.error_code !== undefined)
    return new OperationState(res.error, res.error_code);
  res = await mkRequest(`/1.0/operations/${res.id}/wait`);
  return new OperationState(res.status, res.status_code);
}

export async function getState(id) {
  let limit;
  mkRequest(`/1.0/instances/${id}`).then(
    (d) =>
      (limit =
        d.config.limits === undefined || d.config.limits.cpu === undefined
          ? 0
          : d.config.limits.cpu)
  );
  let data = await mkRequest(`/1.0/instances/${id}/state`);
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
  let dataNew = await mkRequest(`/1.0/instances/${id}/state`);
  rs.CPU.percentConsumed =
    (dataNew.cpu.usage - data.cpu.usage) /
    10000000 /
    (limit < 1 ? os.cpus().length - 6 : limit);
  return rs;
}

// Returns array of snapshot objects for the given container.
export async function getSnapshots(id) {
  let snaps = await mkRequest(`/1.0/instances/${id}/snapshots`);
  let prefix = `/1.0/instances/${id}/snapshots/`.length;
  let snapshots = new Array();
  for (let i = 0; i < snaps.length; i++) {
    snapshots.push(await getSnapshot(id, snaps[i].substring(prefix)));
  }
  return snapshots;
}

export async function createSnapshot(id, name, stateful) {
  let res = await mkRequest(`/1.0/instances/${id}/snapshots`, "POST", {
    name: name,
    stateful: stateful,
  });
  res = await mkRequest(`/1.0/operations/${res.id}/wait`);
  if (res.status_code == 200) return getSnapshot(id, name);
  else return new OperationState(res.error, res.error_code);
}

export async function getSnapshot(id, name) {
  let data = await mkRequest(`/1.0/instances/${id}/snapshots/${name}`);
  return new Snapshot(name, new Date(data.created_at).getTime(), data.stateful);
}

export async function deleteSnapshot(id, name) {
  let res = await mkRequest(`/1.0/instances/${id}/snapshots/${name}`, "DELETE");
  if (res.error_code !== undefined)
    return new OperationState(res.error, res.error_code);
  return await getOperation(res.id);
}

// the fileHandler is used to handle the response containing the backup file .tar.gz.
export async function exportInstance(id, fileHandler) {
  let res = await mkRequest(`/1.0/instances/${id}/backups`);
  let name =
    "b" +
    (res.length == 0
      ? 1
      : parseInt(
          res[res.length - 1].substring(`/1.0/instances/${id}/backups/b`.length)
        ) + 1);
  let expiry = new Date();
  expiry.setHours(expiry.getHours() + 5);
  res = await mkRequest(`/1.0/instances/${id}/backups`, "POST", {
    name: name,
    expires_at: expiry,
    instance_only: true,
    optimized_storage: true,
    //    compression_algorithm: "xz",
  });
  res = await getOperation(res.id);
  if (res.statusCode == 200) {
    let req = https.request(
      mkOpts(`/1.0/instances/${id}/backups/${name}/export`),
      (res) => {
        fileHandler(res);
        res.on("close", () => deleteBackup(id, name));
      }
    );
    req.end();
    return req;
  } else return res;
}

export async function deleteBackup(id, bid) {
  let res = await mkRequest(
    bid === undefined ? id : `/1.0/instances/${id}/backups/${bid}`,
    "DELETE"
  );
  return await getOperation(res.id);
}

// Returns backup restore operation id
export async function importInstance(id, stream) {
  let opts = mkOpts("/1.0/instances", "POST");
  opts.headers = {
    "Content-Type": "application/octet-stream",
    "X-LXD-name": id,
  };
  return new Promise((resolve) => {
    let req = https.request(opts, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        body = JSON.parse(body);
        res.statusCode < 300 ? resolve(body.metadata.id) : resolve(body);
      });
    });
    stream.pipe(req);
    stream.on("finish", () => req.end());
  });
}

export async function startInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`, "PUT", {
    action: "start",
    timeout: 60,
  });
  return await getOperation(res.id);
}

export async function stopInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`, "PUT", {
    action: "stop",
    timeout: 60,
  });
  return await getOperation(res.id);
}

export async function freezeInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`, "PUT", {
    action: "freeze",
    timeout: 60,
  });
  return await getOperation(res.id);
}

export async function unfreezeInstance(id) {
  let res = await mkRequest(`/1.0/instances/${id}`, "PUT", {
    action: "unfreeze",
    timeout: 60,
  });
  return await getOperation(res.id);
}

export async function getOperation(id) {
  let res = await mkRequest(`/1.0/operations/${id}/wait`);
  console.log({
    desc: res.description,
    code: res.status_code,
    err: res.err,
    resources: res.resources,
  });
  return new OperationState(res.status, res.status_code);
}

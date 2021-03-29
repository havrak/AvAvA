import https from "https";
import fs from "fs";
import path from "path";
import querystring from "querystring";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import * as CS from "../models/ContainerResourceState.js";
import * as NS from "../models/NetworkState.js";
import Container from "../models/Container.js";
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
		if (method == "GET") {
			opts.path += "?" + querystring.stringify(data);
			opts.headers = { "Content-Type": "application/x-www-form-urlencoded" };
		} else {
			data = JSON.stringify(data);
			opts.headers = {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(data),
			};
		}
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
		if (data !== undefined && method != "GET") req.write(data);
		req.end();
	});
}

export async function test() {
	/*(await mkRequest(`/1.0/instances/test/backups`)).forEach((b) =>
		deleteBackup(b)
	);*/
	/*exportInstance(
			"c1",
			(res) => res.pipe(fs.createWriteStream("testBack.tar.gz")),
			"p2"
	);*/
	/*console.log(
		await importInstance(
			"testImport",
			fs.createReadStream("testBack.tar.gz"),
			"default"
		)
	);*/
	// console.log(await execInstance("c1", "p2", "df -H"));
	// console.log(await startInstance("createTest", "p2"));
	// console.log(await getInstance("createTest", "p2"));
	// console.log(await deleteBackup("c1", "b4", "p2"));
	// console.log(await getInstance("c1", "p2"));
	// console.log(await getState("c1", "p2"));
	// console.log(await getInstances("p2"));
	// console.log(await getSnapshots("c1", "p2"));
	// console.log(await createSnapshot("c1", "snap2", false, "p2"));
	/*	createInstance({
		name: "createTest",
		architecture: "x86_64",
		profiles: ["default"],
		ephemeral: true,
		config: { "limits.cpu": "2" },
		type: "container",
		source: {
			type: "image",
			protocol: "simplestreams",
			server: "https://cloud-images.ubuntu.com/daily",
			alias: "20.04",
		},
		project: "default",
	}).then((res) => console.log(res));*/
}

export async function getInstances(project) {
	let routes = await mkRequest(`/1.0/instances?project=${project}`);
	let instances = new Array();
	for (let i = 0; i < routes.length; i++) {
		instances.push(await getInstance(routes[i].substring("15"), project));
	}
	return instances;
}

export function createInstance(data) {
	return mkRequest(
		`/1.0/instances?project=${data.project}`,
		"POST",
		data
	).then((res) => getOperation(res));
}

// Returns Instance object, filled in Template.image,
// id, persistent, timestamp, OperationState.
export function getInstance(id, project) {
	return mkRequest(`/1.0/instances/${id}?project=${project}`).then((res) => {
		console.log(res);
		let container = new Container(id);
		container.createdOn = new Date(res.created_at);
		container.lastStartedOn = new Date(res.last_used_at);
		container.stateful = res.stateful;
		container.template = new Template();
		if (res.config["image.os"] !== undefined) {
			container.template.image = new Image(
				res.config["image.os"],
				res.config["image.version"],
				res.config["image.description"]
			);
		}
		return getSnapshots(id, project).then((snap) => {
			container.snapshots = snap;
			return getState(id, project).then((state) => {
				container.state = state;
				return container;
			});
		});
	});
}

export function deleteInstance(id, project) {
	return mkRequest(
		`/1.0/instances/${id}?project=${project}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// Metoda vrací výstup zadaného příkazu
export function execInstance(id, project, command) {
	return mkRequest(`/1.0/instances/${id}/exec?project=${project}`, "POST", {
		command: command.split(" "),
		"record-output": true,
		"wait-for-websocket": false,
		interactive: false,
	}).then((res) => {
		if (res.status_code == 103) {
			return mkRequest(`/1.0/operations/${res.id}/wait`).then(
				(res) =>
					new Promise((resolve) => {
						// toto vrací http request, ne jeho výsledek, zatím nevím, jak řešit
						https
							.request(
								mkOpts(
									`${
										res.metadata.output[
											res.metadata.return == 0 ? "1" : "2"
										]
									}?project=${project}`
								),
								(res) => {
									let body = "";
									//aktuálně nejsme schopni získat obsah souboru .log, takže výstup nikdy nebude
									res.setEncoding("utf8");
									res.on("data", (d) => (body += d));
									res.on("end", () => resolve(body));
									//res3.pipe(process.stdout);
								}
							)
							.end();
					})
			);
		} else return getOperation(res);
	});
}

async function getStateFromSource(instancedata, id, project) {
	let limit =
		instancedata.config.limits === undefined ||
		instancedata.contif.limits.cpu === undefined
			? 0
			: instancedata.config.limits.cpu;
	let data = await mkRequest(`/1.0/instances/${id}/state?project=${project}`);
	// console.log(JSON.stringify(data));
	let rs;
	//use the time efficiently and while the measurement waits
	//for another measure, we put all available data in its place
	await new Promise((resolve) => {
		rs = new CS.ContainerResourceState();
		rs.OperationState = new OperationState(data.status, data.status_code);
		rs.CPU.consumedTime = data.cpu.usage;
		rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
		rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
		if (data.disk.root !== undefined) {
			let used = new CS.UserDiskSpace();
			//used.usage = data.disk.root.usage; //must be divided by users
			//https://discuss.linuxcontainers.org/t/how-to-check-lxd-container-size-and-how-much-space-they-are-tacking/4770/3
			rs.disk.currentlyCosumedMemory.push(used);
		}
		if (data.network != undefined)
			Object.keys(data.network).forEach((key) => {
				let lxdn = data.network[key];
				let network = new NS.NetworkState(
					key,
					lxdn.addresses,
					lxdn.hwaddr,
					lxdn.host_name,
					lxdn.mtu,
					lxdn.state,
					lxdn.type
				);
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
				switch (key) {
					case "eth0":
						// network.limits = rs.internet.limits;
						rs.internet = network;
					case "lo":
						rs.loopback = network;
					default:
						rs.networks.push(network);
				}
			});
		rs.numberOfProcesses = data.processes;
		setTimeout(resolve, 1000);
	}, 1000);
	let dataNew = await mkRequest(
		`/1.0/instances/${id}/state?project=${project}`
	);
	rs.CPU.percentConsumed =
		(dataNew.cpu.usage - data.cpu.usage) /
		10000000 /
		(limit < 1 ? os.cpus().length - 6 : limit);
	return rs;
}

export function getState(id, project) {
	return mkRequest(`/1.0/instances/${id}?project=${project}`).then((d) =>
		getStateFromSource(d, id, project)
	);
}

// Returns array of snapshot objects for the given container.
export async function getSnapshots(id, project) {
	let snaps = await mkRequest(
		`/1.0/instances/${id}/snapshots?project=${project}`
	);
	let prefix = `/1.0/instances/${id}/snapshots/`.length;
	let suffix = `?project=${project}`.length;
	let snapshots = new Array();
	for (let i = 0; i < snaps.length; i++) {
		let name = snaps[i].substring(prefix);
		snapshots.push(
			await getSnapshot(id, name.substring(0, name.length - suffix), project)
		);
	}
	return snapshots;
}

export function createSnapshot(id, name, stateful, project) {
	return mkRequest(
		`/1.0/instances/${id}/snapshots?project=${project}`,
		"POST",
		{
			name: name,
			stateful: stateful,
		}
	).then((operation) =>
		getOperation(operation).then((res) => {
			if (res.statusCode == 200) return getSnapshot(id, name, project);
			else return res;
		})
	);
}

export function getSnapshot(id, name, project) {
	return mkRequest(
		`/1.0/instances/${id}/snapshots/${name}?project=${project}`
	).then(
		(data) => new Snapshot(name, undefined, data.created_at, data.stateful)
	);
}

export function deleteSnapshot(id, name, project) {
	return mkRequest(
		`/1.0/instances/${id}/snapshots/${name}?project=${project}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// the fileHandler is used to handle the response containing the backup file .tar.gz.
export async function exportInstance(id, fileHandler, project) {
	let res = await mkRequest(`/1.0/instances/${id}/backups?project=${project}`);
	let name =
		"b" +
		(res.length == 0
			? 1
			: parseInt(
					res[res.length - 1].substring(
						`/1.0/instances/${id}/backups/b`.length
					)
			  ) + 1);
	let expiry = new Date();
	expiry.setHours(expiry.getHours() + 5);
	res = await mkRequest(
		`/1.0/instances/${id}/backups?project=${project}`,
		"POST",
		{
			name: name,
			expires_at: expiry,
			instance_only: true,
			optimized_storage: true,
			//    compression_algorithm: "xz",
		}
	);
	res = await getOperation(res);
	console.log(res);
	if (res.statusCode == 200) {
		let req = https.request(
			mkOpts(
				`/1.0/instances/${id}/backups/${name}/export?project=${project}`
			),
			(res) => {
				console.log(res);
				fileHandler(res);
				res.on("close", () => deleteBackup(id, name, project));
			}
		);
		req.end();
		return req;
	} else return res;
}

export function deleteBackup(id, bid, project) {
	return mkRequest(
		bid === undefined
			? id
			: `/1.0/instances/${id}/backups/${bid}?project=${project}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// Returns backup restore operation id
export function importInstance(id, stream, project) {
	let opts = mkOpts(`/1.0/instances?project=${project}`, "POST");
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

export function startInstance(id, project) {
	return mkRequest(`/1.0/instances/${id}/state?project=${project}`, "PUT", {
		action: "start",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export function stopInstance(id, project) {
	return mkRequest(`/1.0/instances/${id}/state?project=${project}`, "PUT", {
		action: "stop",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export function freezeInstance(id, project) {
	return mkRequest(`/1.0/instances/${id}/state?project=${project}`, "PUT", {
		action: "freeze",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export function unfreezeInstance(id, project) {
	return mkRequest(`/1.0/instances/${id}/state?project=${project}`, "PUT", {
		action: "unfreeze",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export async function getOperation(operation) {
	if (operation.status_code <= 103) {
		operation = await mkRequest(`/1.0/operations/${operation.id}/wait`);
		console.log({
			desc: operation.description,
			code: operation.status_code,
			err: operation.error === undefined ? operation.err : operation.error,
			resources: operation.resources,
		});
	} else if (operation.error_code !== undefined) {
		console.log({
			desc: operation.description,
			code: operation.status_code,
			err: operation.error === undefined ? operation.err : operation.error,
			resources: operation.resources,
		});
		return new OperationState(operation.error, operation.error_code);
	}
	let os = new OperationState(operation.status, operation.status_code);
	os.id = operation.id;
	return os;
}

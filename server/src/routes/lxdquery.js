import https from "https";
import fs from "fs";
import path from "path";
import querystring from "querystring";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import ContainerResourceState from "../models/ContainerResourceState.js";
import * as NS from "../models/NetworkState.js";
import Container from "../models/Container.js";
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

const debug = true;

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
	if (debug) console.log({ path: path, method: method, data: data });
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

export async function getOperation(operation) {
	if (operation.status_code <= 103) {
		operation = await mkRequest(`/1.0/operations/${operation.id}/wait`);
		if (debug)
			console.log({
				desc: operation.description,
				code: operation.status_code,
				err:
					operation.error === undefined ? operation.err : operation.error,
				resources: operation.resources,
			});
	} else if (operation.error_code !== undefined) {
		if (debug)
			console.log({
				desc: operation.description,
				code: operation.status_code,
				err:
					operation.error === undefined ? operation.err : operation.error,
				resources: operation.resources,
			});
		return new OperationState(operation.error, operation.error_code);
	}
	return new OperationState(operation.status, operation.status_code);
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
	// console.log(await startInstance("createTest", "p2"));
	// console.log(await deleteBackup("c1", "b4", "p2"));
	// console.log(await getInstance("c1", "p2"));
	// console.log((await getState("c1", "p2")));
	// console.log(await execInstance("c2", "p2", "apt-get -yqq install neovim"));
	// let routes = await mkRequest(`/1.0/instances?project=p2`);
	// let instances = new Array();
	// routes.forEach((path) => {
	//	let i = new Container(path.substring(15));
	//	i.template = new Template();
	//	i.state = new ContainerResourceState();
	//	instances.push(i);
	// });
	// console.log(await getInstances(instances, "p2"));
	// console.log(await getSnapshots("c1", "p2"));
	// console.log(await createSnapshot("c1", "snap2", false, "p2"));
	/*console.log(await stopInstance("c2", "p2"));
	console.log(await deleteInstance("c2", "p2"));
	createInstance(
		{
			name: "c2",
			architecture: "x86_64",
			profiles: ["default"],
			ephemeral: false,
			config: { "limits.cpu": "2" },
			type: "container",
			source: {
				type: "image",
				protocol: "simplestreams",
				server: "https://cloud-images.ubuntu.com/daily",
				alias: "20.04",
			},
			project: "p2",
		},
		[
			["bash", "-c", "sleep 4 ; apt-get update"], //minimum time to get internet
			"apt-get -yqq install neovim", //pkg installation test
			["bash", "-c", "df -B 1 | awk '/\\/$/{print $4;exit}' > test"],//bash execution test
		]
	).then((res) => console.log(res));*/
}

export function getInstances(instances, project) {
	return new Promise((resolve) => {
		let done = 0;
		instances.forEach((i) =>
			getInstance(i, project).then((instance) => {
				done++;
				if (done == instances.length) resolve(instances);
			})
		);
	});
}

// The data for creation, including the parental project,
// optional commands to execute after start
export async function createInstance(data, commands) {
	let res = await getOperation(
		await mkRequest(`/1.0/instances?project=${data.project}`, "POST", data)
	);
	if (res.statusCode == 200) {
		await startInstance(data.name, data.project);
		for (let i = 0; i < commands.length; i++) {
			let stat = await execInstance(
				data.name,
				data.project,
				commands[i],
				false
			);
			if (stat.statusCode != 200) {
				res = stat;
			}
			if (debug) console.log(`createCmd: ${stat}`);
		}
	}
	return res;
}

// Fills in the given instance: Template.image,
// id, persistent, timestamp, OperationState.
export function getInstance(instance, project) {
	return mkRequest(`/1.0/instances/${instance.id}?project=${project}`).then(
		(res) => {
			instance.createdOn = new Date(res.created_at);
			instance.lastStartedOn = new Date(res.last_used_at);
			instance.stateful = res.stateful;
			if (res.config["image.os"] !== undefined) {
				instance.template.image = new Image(
					res.config["image.os"],
					res.config["image.version"],
					res.config["image.description"]
				);
			}
			return getSnapshots(instance.id, project).then((snap) => {
				instance.snapshots = snap;
				return getStateFromSource(instance.state, res, project).then(
					(state) => instance
				);
			});
		}
	);
}

export function deleteInstance(id, project) {
	return mkRequest(
		`/1.0/instances/${id}?project=${project}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// Metoda vrací výstup zadaného příkazu
export function execInstance(id, project, command, getOutput) {
	return mkRequest(`/1.0/instances/${id}/exec?project=${project}`, "POST", {
		command: Array.isArray(command) ? command : command.split(" "),
		"record-output": getOutput !== false,
		"wait-for-websocket": false,
		interactive: false,
	}).then((res) => {
		if (res.status_code == 103) {
			return mkRequest(`/1.0/operations/${res.id}/wait`).then((res) =>
				getOutput !== false
					? new Promise((resolve) =>
							https
								.request(
									mkOpts(
										`${
											res.metadata.output[
												res.metadata.return == 0 ? "1" : "2"
											]
										}?project=${project}`
									),
									(req) => {
										let body = "";
										req.setEncoding("utf8");
										req.on("data", (d) => (body += d));
										req.on("end", () =>
											resolve(
												new OperationState(
													body.trim(),
													res.metadata.return
												)
											)
										);
									}
								)
								.end()
					  )
					: new OperationState(
							res.status,
							res.metadata.return == 0 ? 200 : 400
					  )
			);
		} else return getOperation(res);
	});
}

async function getStateFromSource(rs, instancedata, project) {
	let limit =
		instancedata.config.limits === undefined ||
		instancedata.contif.limits.cpu === undefined
			? 0
			: instancedata.config.limits.cpu;
	let data = await mkRequest(
		`/1.0/instances/${instancedata.name}/state?project=${project}`
	);
	//use the time efficiently and while the measurement waits
	//for another measure, we put all available data in its place
	await new Promise((resolve) => {
		rs.OperationState = new OperationState(data.status, data.status_code);
		rs.CPU.consumedTime = data.cpu.usage;
		rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
		rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
		rs.disk.devices[0].name = "root";
		if (data.disk.root !== undefined) {
			rs.disk.devices[0].usage = data.disk.root.usage; //must be divided by users
			//https://discuss.linuxcontainers.org/t/how-to-check-lxd-container-size-and-how-much-space-they-are-tacking/4770/3
		} else {
			execInstance(instancedata.name, project, [
				"bash",
				"-c",
				"df -B 1 | awk '/\\/$/{print $4;exit}'",
			]).then((res) => (rs.disk.devices[0].usage = parseInt(res)));
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
		`/1.0/instances/${instancedata.name}/state?project=${project}`
	);
	rs.CPU.percentConsumed =
		(dataNew.cpu.usage - data.cpu.usage) /
		10000000 /
		(limit < 1 ? os.cpus().length - 6 : limit);
	return rs;
}

export function getState(state, id, project) {
	return mkRequest(
		`/1.0/instances/${id}?project=${project}`
	).then((instance) => getStateFromSource(state, instance, project));
}

// Returns array of snapshot objects for the given container.
export function getSnapshots(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/${id}/snapshots?project=${project}`).then(
			(snaps) => {
				let prefix = `/1.0/instances/${id}/snapshots/`.length;
				let suffix = `?project=${project}`.length;
				let snapshots = new Array();
				snaps.forEach((name) =>
					getSnapshot(
						id,
						name.substring(prefix, name.length - suffix),
						project
					).then((snap) => {
						snapshots.push(snap);
						if (snapshots.length == snaps.length) resolve(snapshots);
					})
				);
			}
		)
	);
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

function getSnapshot(id, name, project) {
	return mkRequest(
		`/1.0/instances/${id}/snapshots/${name}?project=${project}`
	).then((data) => new Snapshot(name, data.created_at, data.stateful));
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
	if (res.statusCode == 200) {
		let req = https.request(
			mkOpts(
				`/1.0/instances/${id}/backups/${name}/export?project=${project}`
			),
			(res) => {
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

export function createProject(data) {
	return mkRequest("/1.0/projects", "POST", data).then((res) =>
		getOperation(res)
	);
}

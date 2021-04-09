import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import mongodb from "mongodb";
let mdb;
new mongodb.MongoClient("mongodb://localhost:27017/lxd", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).connect((err, db) => (mdb = db));
import WebSocket from "ws";
import { connections } from "../services/websocket.js";
// import ContainerResourceState from "../models/ContainerResourceState.js";
import * as NS from "../models/NetworkState.js";
// import Container from "../models/Container.js";
// import Template from "../models/Template.js";
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

const debug = false;

function mkOpts(path, method) {
	return {
		method: method || "GET",
		hostname: "127.0.0.1",
		port: 8443,
		path: path,
		json: true,
		key: key,
		cert: crt,
		rejectUnauthorized: false,
	};
}

function mkRequest(path, method, data) {
	let opts = mkOpts(path, method);
	if (debug && !path.includes("operation"))
		console.log({ path: path, method: method, data: data });
	if (data) {
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
		if (data) req.write(data);
		req.end();
	});
}

export async function getOperation(operation) {
	if (!operation || (!operation.status_code && !operation.error_code))
		return new OperationState("Success", 200);
	if (operation.status_code < 200) {
		operation = await mkRequest(`/1.0/operations/${operation.id}/wait`);
		if (debug)
			console.log({
				status: operation.status,
				desc: operation.description,
				code: operation.status_code,
				resources: operation.resources,
			});
	}
	if (operation.error || operation.err) {
		console.log({
			error: operation.err ? operation.err : operation.error,
			code: operation.err ? operation.status_code : operation.error_code,
			desc: operation.description,
			resources: operation.resources,
		});
		return operation.error
			? new OperationState(operation.error, operation.error_code)
			: new OperationState(operation.err, operation.status_code);
	}
	return new OperationState(operation.status, operation.status_code);
}

export function getConsole(id, project) {
	return mkRequest(`/1.0/instances/${id}/exec?project=${project}`, "POST", {
		// command: "login -f -- root".split(" "),
		command: ["bash"],
		environment: {
			HOME: "/root",
			TERM: "xterm",
			USER: "root",
		},
		"wait-for-websocket": true,
		interactive: true,
	}).then((res) => {
		if (res.status_code != 103) return getOperation(res);
		let ws = new WebSocket(
			`wss://127.0.0.1:8443/1.0/operations/${res.id}/websocket?secret=${res.metadata.fds["0"]}`,
			{
				key: key,
				cert: crt,
				rejectUnauthorized: false,
			}
		);
		connections[`/${project}/${id}/${res.metadata.fds["0"]}`] = ws;
		ws.on("error", (error) =>
			console.log(`/${project}/${id}/console ERROR:  ${error}`)
		);
		return res.metadata.fds["0"];
	});
}

export async function test() {
	// console.log(await stopInstance("c1", "p1"));
	// console.log(await deleteInstance("c1", "p1"));
	// console.log(await startInstance("c1", "p1"));
	// process.stdin.resume();
	// getConsole("c1", "p1");
	// getConsole("c1", "p1", process.stdin, process.stdout);
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
	// console.log(await deleteBackup("c1", "b4", "p2"));
	/*let instance = new Container("createTest");
	instance.template = new Template();
	instance.state = new ContainerResourceState();
	console.log(await getInstance(instance, "p2"));*/
	/*let routes = await mkRequest(`/1.0/instances?project=p2`);
	let instances = new Array();
	routes.forEach((path) => {
		let i = new Container(path.substring(15));
		i.template = new Template();
		i.state = new ContainerResourceState();
		instances.push(i);
	});
	console.log(await getInstances(instances, "p2"));*/
	// console.log(await getSnapshots("c1", "p2"));
	// console.log(await startInstance("c2", "p2"));
	/*console.log(
		await createProject({
			name: "p1",
			config: {
				"features.images": "false",
				"features.profiles": "false",
			},
			description: "Test project p1.",
		})
	);*/
	/*console.log(
		await createInstance(
			{
				name: "c1",
				project: "p1",
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
			},
			[
				["bash", "-c", "sleep 5 ; apt-get update"], //minimum time to get internet
				["bash", "-c", "df -B 1 | awk '/\\/$/{print $4;exit}' > test"], //bash execution test
	// "apt-get -yqq install neovim", //pkg installation test
				["bash", "-c", "echo root:root | chpasswd"], //set password
			]
		)
	);*/
	/*console.log(await getState(new ContainerResourceState(), "c1", "p2"));
	console.log(await createSnapshot("c2", "snap2", false, "p2"));
	console.log(await execInstance("c1", "p2", "apt-get -yqq install neovim"));*/
}

export function getInstances(instances, project) {
	return new Promise((resolve) => {
		let done = 0;
		if (instances.length > 0)
			instances.forEach((i) =>
				getInstance(i, project).then((instance) => {
					done++;
					if (done == instances.length) resolve(instances);
				})
			);
		else resolve(instances);
	});
}

// The data for creation, including the parental project,
// optional commands to execute after start
export async function createInstance(data, commands) {
	let res = await getOperation(
		await mkRequest(`/1.0/instances?project=${data.project}`, "POST", data)
	);
	if (res.statusCode == 200) {
		res = await startInstance(data.name, data.project);
		if (res.statusCode != 200) {
			await deleteInstance(data.name, data.project);
			return res;
		}
		mdb.db("lxd")
			.collection(data.project)
			.insertOne({ _id: data.name, data: null }, () => {});
		let errcmd = 0;
		for (let i = 0; i < commands.length; i++) {
			let stat = await execInstance(
				data.name,
				data.project,
				commands[i],
				false
			);
			if (stat.statusCode != 200) errcmd++;
			if (debug)
				console.log({ createCmd: stat.statusCode, desc: stat.status });
		}
		if (errcmd > 0)
			res.status =
				`Unable to execute ${errcmd} initial command` +
				(errcmd > 1 ? "s." : ".");
	}
	return res;
}

// Fills in the given instance: Template.image,
// id, persistent, timestamp, OperationState.
export function getInstance(instance, project) {
	return mkRequest(`/1.0/instances/${instance.id}?project=${project}`).then(
		(res) => {
			if (res.error) return new OperationState(res.error, res.error_code);
			instance.createdOn = new Date(res.created_at);
			instance.lastStartedOn = new Date(res.last_used_at);
			instance.stateful = res.stateful;
			if (res.config["image.os"]) {
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
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/${id}?project=${project}`, "DELETE").then(
			(res) =>
				getOperation(res).then((res) =>
					mdb
						.db("lxd")
						.collection(project)
						.deleteOne({ _id: id }, (err, data) =>
							resolve(
								err ? new OperationState(JSON.stringify(err), 400) : res
							)
						)
				)
		)
	);
}

// Returns the result of the given command, if not opt out
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
							res.metadata.return == 0 ? res.status : res.description,
							res.metadata.return == 0 ? 200 : 400
					  )
			);
		} else return getOperation(res);
	});
}

async function getStateFromSource(rs, instancedata, project) {
	let limit =
		instancedata.config.limits === undefined ||
		instancedata.config.limits.cpu === undefined
			? 0
			: instancedata.config.limits.cpu;
	let data = await mkRequest(
		`/1.0/instances/${instancedata.name}/state?project=${project}`
	);
	//use the time efficiently and while the measurement waits
	//for another measure, we put all available data in its place
	await new Promise((resolve) => {
		rs.OperationState = new OperationState(data.status, data.status_code);
		rs.CPU.usedTime = data.cpu.usage;
		rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
		rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
		rs.disk.devices[0].name = "root";
		if (data.status_code != 102) {
			execInstance(instancedata.name, project, [
				"bash",
				"-c",
				"df -B 1 | awk '/\\/$/{print $4;exit}'",
			]).then((res) => (rs.disk.devices[0].usage = parseInt(res.status)));
			if (data.network)
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
					network.counters.download.bytesRecieved =
						lxdn.counters.bytes_received;
					network.counters.upload.bytesSent = lxdn.counters.bytes_sent;
					network.counters.download.packetsRecieved =
						lxdn.counters.packets_received;
					network.counters.upload.packetsSent = lxdn.counters.packets_sent;
					switch (key) {
						case "eth0":
							//TODO: DO NOT FORGET TO UNCOMMENT THIS BEFORE HANDING IN.
							// network.limits = rs.internet.limits;
							rs.internet = network;
							break;
						case "lo":
							rs.loopback = network;
							break;
						default:
							rs.networks.push(network);
					}
				});
			rs.numberOfProcesses = data.processes;
			setTimeout(resolve, 1000);
		} else {
			rs.numberOfProcesses = data.processes;
			resolve();
		}
	}, 1000);
	if (data.status_code != 102) {
		let dataNew = await mkRequest(
			`/1.0/instances/${instancedata.name}/state?project=${project}`
		);
		rs.CPU.percentConsumed =
			(dataNew.cpu.usage - data.cpu.usage) /
			10000000 /
			(limit < 1 ? os.cpus().length : limit);
		return rs;
	} else
		return new Promise((resolve) =>
			mdb
				.db("lxd")
				.collection(project)
				.findOne({ _id: instancedata.name }, (err, res) => {
					if (!err) {
						rs.CPU.usedTime = res.data.cpuTime;
						rs.disk.devices[0].usage = res.data.disk;
						//TODO: DO NOT FORGET TO UNCOMMENT THIS BEFORE HANDING IN.
						// res.networks.internet.limits = rs.internet.limits;
						rs.internet = res.data.networks.internet;
						rs.loopback = res.data.networks.loopback;
						rs.networks = res.data.networks.other;
					}
					rs.CPU.usage = 0;
					resolve(rs);
				})
		);
}

export function getState(state, id, project) {
	return mkRequest(`/1.0/instances/${id}?project=${project}`).then((res) => {
		return res.error || res.err
			? getOperation(res)
			: getStateFromSource(state, res, project);
	});
}

// Returns array of snapshot objects for the given container.
export function getSnapshots(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/${id}/snapshots?project=${project}`).then(
			(snaps) => {
				let prefix = `/1.0/instances/${id}/snapshots/`.length;
				let suffix = `?project=${project}`.length;
				let snapshots = new Array();
				if (snaps.length > 0)
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
				else resolve(snapshots);
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
	let data = { networks: { other: [] } };
	return new Promise((resolve) =>
		execInstance(id, project, [
			"bash",
			"-c",
			"df -B 1 | awk '/\\/$/{print $4;exit}'",
		]).then((res) => {
			if (res.statusCode != 0) {
				resolve(res);
				return;
			}
			data.disk = parseInt(res.status);
			mkRequest(`/1.0/instances/${id}/state?project=${project}`).then(
				(res) => {
					data.cpuTime = res.cpu.usage;
					Object.keys(res.network).forEach((key) => {
						let lxdn = res.network[key];
						let network = new NS.NetworkState(
							key,
							lxdn.addresses,
							lxdn.hwaddr,
							lxdn.host_name,
							lxdn.mtu,
							lxdn.state,
							lxdn.type
						);
						network.counters.download.bytesRecieved =
							lxdn.counters.bytes_received;
						network.counters.upload.bytesSent = lxdn.counters.bytes_sent;
						network.counters.download.packetsRecieved =
							lxdn.counters.packets_received;
						network.counters.upload.packetsSent =
							lxdn.counters.packets_sent;
						switch (key) {
							case "eth0":
								data.networks.internet = network;
								break;
							case "lo":
								data.networks.loopback = network;
								break;
							default:
								data.networks.other.push(network);
								break;
						}
					});
					mkRequest(
						`/1.0/instances/${id}/state?project=${project}`,
						"PUT",
						{
							action: "stop",
							timeout: 60,
						}
					).then((res) =>
						getOperation(res).then((res) => {
							if (!res.error) {
								let proj = mdb.db("lxd").collection(project);
								proj.updateOne(
									{ _id: id },
									{ $set: { data: data } },
									(err, result) => {
										if (err)
											res = new OperationState(err.toString(), 400);
										if (result.result.n == 0)
											console.log(
												`mdb: ${id} in ${project} not initialized!`
											);
										resolve(res);
									}
								);
							} else resolve(getOperation(res));
						})
					);
				}
			);
		})
	);
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
	return new Promise((resolve) =>
		mkRequest("/1.0/projects", "POST", data).then((res) => {
			if (!res || !res.error)
				mdb.db("lxd").createCollection(data.name, (err, result) => {
					if (err) res = { error: err.toString(), error_code: 400 };
					resolve(getOperation(res));
				});
			else resolve(new OperationState(res.error, res.error_code));
		})
	);
}

export function deleteProject(id) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/projects/${id}`, "DELETE").then((res) => {
			if (!res || !res.error)
				mdb.db("lxd")
					.collection(id)
					.drop((err, result) => {
						if (err) res = { error: err.toString(), eror_code: 400 };
						resolve(getOperation(res));
					});
			else resolve(getOperation(res));
		})
	);
}

export function shutdownMongo() {
	return mdb.close();
}

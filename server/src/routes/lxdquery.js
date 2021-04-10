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
const key = fs.readFileSync(
	path.resolve(__dirname, "../../config/lxcclient.key")
);
const crt = fs.readFileSync(
	path.resolve(__dirname, "../../config/lxcclient.crt")
);

const debug = false;

function mkOpts(path, method = "GET") {
	return {
		method: method,
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
				resolve(JSON.parse(body).metadata || JSON.parse(body))
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
			error: operation.err || operation.error,
			code: operation.status_code || operation.error_code,
			desc: operation.description,
			resources: operation.resources,
		});
		return new OperationState(
			operation.err || operation.error,
			operation.status_code || operation.error_code
		);
	}
	return new OperationState(operation.status, operation.status_code);
}

export async function test() {
	console.log(await stopInstance(1, 1));
	// console.log(await deleteInstance("73", "1"));
	console.log(await startInstance(1, 1));
	/*(await mkRequest(`/1.0/instances/test/backups`)).forEach((b) =>
		deleteBackup("test", "default", b)
	);*/
	/*exportInstance(
			1,
			1,
			(res) => res.pipe(fs.createWriteStream("testBack.tar.gz"))
	);*/
	/*console.log(
		await importInstance(
			1,
			1,
			fs.createReadStream("testBack.tar.gz")
		)
	);*/
	/*let routes = await mkRequest(`/1.0/instances?project=p1`);
	let instances = new Array();
	routes.forEach((path) => {
		let i = new Container(path.substring(15));
		i.template = new Template();
		i.state = new ContainerResourceState();
		i.state.networks.internet = new NetworkState();
		instances.push(i);
	});
	console.log(await getInstances(instances, 1));*/
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
				name: "c72",
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
				// "sleep 5; apt-get update", //minimum time to get internet
				"sleep 5; apt-get update && apt-get -yyq install git neovim nginx",
				"df -B 1 | awk '/\\/$/{print $4;exit}' > test", //bash execution test
				// "apt-get -yqq install neovim", //pkg installation test
				"echo root:root | chpasswd", //set password
			]
		)
	);*/
	// console.log(await createSnapshot(1, 1, "snap2", false));
	/*console.log(
		await postFileToInstance(1, 1, "../app.js", "/root/test.js")
	);*/
}

export function getInstances(instances) {
	return new Promise((resolve) => {
		let done = 0;
		if (instances.length > 0)
			instances.forEach((i) =>
				getInstance(i).then((instance) => {
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
	let id = data.name;
	data.name = `c${id}`;
	let res = await getOperation(
		await mkRequest(`/1.0/instances?project=p${data.project}`, "POST", data)
	);
	if (res.statusCode == 200) {
		res = await startInstance(id, data.project);
		if (res.statusCode != 200) {
			await deleteInstance(id, data.project);
			return res;
		}
		mdb.db("lxd")
			.collection(data.project)
			.insertOne({ _id: data.name, data: null }, () => {});
		let errcmd = 0;
		for (let i = 0; i < commands.length; i++) {
			let stat = await execInstance(id, data.project, commands[i], false);
			if (stat.statusCode != 200) errcmd++;
			if (debug || stat.statusCode != 200)
				console.log({
					createCmd: commands[i],
					status: stat.statusCode,
					desc: stat.status,
				});
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
export function getInstance(instance) {
	return mkRequest(
		`/1.0/instances/c${instance.id}?project=p${instance.projectId}`
	).then((res) => {
		if (res.error) return getOperation(res);
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
		return getSnapshots(instance.id, instance.projectId).then((snap) => {
			instance.snapshots = snap;
			return getState(instance.id, instance.projectId, instance.state).then(
				(state) => instance
			);
		});
	});
}

export function deleteInstance(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/c${id}?project=p${project}`, "DELETE").then(
			(res) =>
				getOperation(res).then((res) =>
					mdb
						.db("lxd")
						.collection(`p${project}`)
						.deleteOne({ _id: `c${id}` }, (err, data) =>
							resolve(
								err ? new OperationState(JSON.stringify(err), 400) : res
							)
						)
				)
		)
	);
}

export function getConsole(id, project) {
	return mkRequest(`/1.0/instances/c${id}/exec?project=p${project}`, "POST", {
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
		let terminal = `/${project}/${id}/${res.metadata.fds["0"]}`;
		let control = `/${project}/${id}/${res.metadata.fds.control}`;
		let ws = new WebSocket(
			`wss://127.0.0.1:8443/1.0/operations/${res.id}/websocket?secret=${res.metadata.fds["0"]}`,
			{
				key: key,
				cert: crt,
				rejectUnauthorized: false,
			}
		);
		connections.set(terminal, { ws: ws, control: control });
		ws.on("error", (error) =>
			console.log(`/p${project}/c${id}/console ERROR:  ${error}`)
		);
		ws = new WebSocket(
			`wss://127.0.0.1:8443/1.0/operations/${res.id}/websocket?secret=${res.metadata.fds.control}`,
			{
				key: key,
				cert: crt,
				rejectUnauthorized: false,
			}
		);
		connections.set(control, { ws: ws, terminal: terminal });
		ws.on("error", (error) =>
			console.log(`/p${project}/c${id}/consoleControl ERROR:  ${error}`)
		);
		return res.metadata.fds;
	});
}

// Returns the result of the given command, if not opt out, always inside OperationState
export function execInstance(id, project, command, getOutput) {
	return mkRequest(`/1.0/instances/c${id}/exec?project=p${project}`, "POST", {
		// command: Array.isArray(command) ? command : command.split(" "),
		command: ["sh", "-c", command],
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
										}?project=p${project}`
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

//uses piper to write a file to given path inside specified instance
function postToInstance(id, project, piper, dstPath, headers) {
	let opts = mkOpts(
		`/1.0/instances/c${id}/files?project=p${project}&path=${dstPath}`,
		"POST"
	);
	opts.headers = headers;
	opts.headers["Content-Type"] = "application/octet-stream";
	return new Promise((resolve) => {
		let req = https.request(opts, (res) => {
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (d) => (body += d));
			res.on("end", () => {
				body = JSON.parse(body);
				if (!body.status_code)
					console.log(
						`c${id} in p${project}; path=${dstPath} postToInstance: ${body}`
					);
				resolve(body.status_code || body.error_code);
			});
		});
		piper(req);
	});
}

export function postFileToInstance(id, project, srcPath, dstPath) {
	let stream = fs.createReadStream(path.resolve(__dirname, srcPath));
	return postToInstance(
		id,
		project,
		(req) => {
			stream.pipe(req);
			stream.on("finish", () => req.end());
		},
		dstPath,
		{
			"X-LXD-mode": 311,
			"X-LXD-type": "file",
			"X-LXD-write": "overwrite",
		}
	);
}

export function postResponseToInstance(id, project, response, dstPath) {
	return postToInstance(
		id,
		project,
		(req) => {
			response.pipe(req);
			response.on("close", () => req.end());
		},
		dstPath,
		{
			"X-LXD-mode": 755,
			"X-LXD-type": "file",
			"X-LXD-write": "overwrite",
		}
	);
}

export async function getState(id, project, rs) {
	let data = await mkRequest(
		`/1.0/instances/c${id}/state?project=p${project}`
	);
	if (!data.status_code) return getOperation(data);
	//use the time efficiently and while the measurement waits
	//for another measure, we put all available data in its place
	await new Promise((resolve) => {
		rs.OperationState = new OperationState(data.status, data.status_code);
		rs.CPU.usedTime = data.cpu.usage;
		rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
		rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
		rs.disk.devices[0].name = "root";
		if (data.status_code != 102) {
			execInstance(
				id,
				project,
				"df -B 1 | awk '/\\/$/{print $4;exit}'"
			).then((res) => (rs.disk.devices[0].usage = parseInt(res.status)));
			rs.numberOfProcesses = data.processes;
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
							network.limits = rs.internet.limits;
							rs.internet = network;
							break;
						case "lo":
							rs.loopback = network;
							break;
						default:
							rs.networks.push(network);
					}
				});
			setTimeout(resolve, 1000);
		} else resolve();
	}, 1000);
	if (data.status_code != 102) {
		let dataNew = await mkRequest(
			`/1.0/instances/c${id}/state?project=p${project}`
		);
		rs.CPU.usage = (dataNew.cpu.usage - data.cpu.usage) / 10 / 2800; // ~2800MHz is the processor speed
		return rs;
	} else
		return new Promise((resolve) =>
			mdb
				.db("lxd")
				.collection(`p${project}`)
				.findOne({ _id: `c${id}` }, (err, res) => {
					if (!err) {
						rs.CPU.usedTime = res.data.cpuTime;
						rs.disk.devices[0].usage = res.data.disk;
						res.networks.internet.limits = rs.internet.limits;
						rs.internet = res.data.networks.internet;
						rs.loopback = res.data.networks.loopback;
						rs.networks = res.data.networks.other;
					}
					rs.CPU.usage = 0;
					resolve(rs);
				})
		);
}

// Returns array of snapshot objects for the given container.
export function getSnapshots(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/c${id}/snapshots?project=p${project}`).then(
			(snaps) => {
				let prefix = `/1.0/instances/c${id}/snapshots/`.length;
				let suffix = `?project=p${project}`.length;
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

export function createSnapshot(instanceID, projectID, name, stateful) {
	return mkRequest(
		`/1.0/instances/c${instanceID}/snapshots?project=p${projectID}`,
		"POST",
		{
			name: name,
			stateful: stateful,
		}
	).then((operation) =>
		getOperation(operation).then((res) => {
			if (res.statusCode == 200)
				return getSnapshot(instanceID, projectID, name);
			else return res;
		})
	);
}

function getSnapshot(instanceID, projectID, snapshotID) {
	return mkRequest(
		`/1.0/instances/c${instanceID}/snapshots/${snapshotID}?project=p${projectID}`
	).then((data) => new Snapshot(snapshotID, data.created_at, data.stateful));
}

export function deleteSnapshot(instanceID, projectID, snapshotID) {
	return mkRequest(
		`/1.0/instances/c${instanceID}/snapshots/${snapshotID}?project=p${projectID}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// the fileHandler is used to handle the response containing the backup file .tar.gz.
export async function exportInstance(id, project, fileHandler) {
	let res = await mkRequest(
		`/1.0/instances/c${id}/backups?project=p${project}`
	);
	let name =
		"b" +
		(res.length == 0
			? 1
			: parseInt(
					res[res.length - 1].substring(
						`/1.0/instances/c${id}/backups/b`.length
					)
			  ) + 1);
	let expiry = new Date();
	expiry.setHours(expiry.getHours() + 5);
	res = await mkRequest(
		`/1.0/instances/c${id}/backups?project=p${project}`,
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
				`/1.0/instances/c${id}/backups/b${name}/export?project=p${project}`
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

export function deleteBackup(instanceID, projectID, backupID) {
	return mkRequest(
		backupID === undefined
			? instanceID
			: `/1.0/instances/c${instanceID}/backups/b${backupID}?project=p${projectID}`,
		"DELETE"
	).then((res) => getOperation(res));
}

// Returns backup restore operation id
export function importInstance(id, project, stream) {
	let opts = mkOpts(`/1.0/instances?project=p${project}`, "POST");
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
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "start",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export function stopInstance(id, project) {
	let data = { networks: { other: [] } };
	return new Promise((resolve) =>
		execInstance(id, project, "df -B 1 | awk '/\\/$/{print $4;exit}'").then(
			(res) => {
				if (res.statusCode != 0) {
					resolve(res);
					return;
				}
				data.disk = parseInt(res.status);
				mkRequest(`/1.0/instances/c${id}/state?project=p${project}`).then(
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
							network.counters.upload.bytesSent =
								lxdn.counters.bytes_sent;
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
							`/1.0/instances/c${id}/state?project=p${project}`,
							"PUT",
							{
								action: "stop",
								timeout: 60,
							}
						).then((res) =>
							getOperation(res).then((res) => {
								if (!res.error) {
									let proj = mdb.db("lxd").collection(`p${project}`);
									proj.updateOne(
										{ _id: `c${id}` },
										{ $set: { data: data } },
										(err, result) => {
											if (err)
												res = new OperationState(
													err.toString(),
													400
												);
											if (result.result.n == 0)
												console.log(
													`mdb: c${id} in p${project} not initialized!`
												);
											resolve(res);
										}
									);
								} else resolve(getOperation(res));
							})
						);
					}
				);
			}
		)
	);
}

export function freezeInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "freeze",
		timeout: 60,
	}).then((res) => getOperation(res));
}

export function unfreezeInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
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
		mkRequest(`/1.0/projects/p${id}`, "DELETE").then((res) => {
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

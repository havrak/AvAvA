import https from "https";
import fs from "fs";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import mongodb from "mongodb";
let mdb;
new mongodb.MongoClient("mongodb://localhost:27017/lxd", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).connect((err, db) => {
	if (err) {
		console.log(err);
		process.exit(1);
	} else mdb = db;
});
import WebSocket from "ws";
import { connections } from "../services/websocket.js";
// import ContainerResourceState from "../models/ContainerResourceState.js";
import * as NS from "../models/NetworkState.js";
// import Container from "../models/Container.js";
// import Template from "../models/Template.js";
import OperationState from "../models/OperationState.js";
import Snapshot from "../models/Snapshot.js";
const key = fs.readFileSync(path.resolve(__dirname, "../../config/lxcclient.key"));
const crt = fs.readFileSync(path.resolve(__dirname, "../../config/lxcclient.crt"));

const debug = false;

/**
 * Create basic options common for all lxd requests.
 * @param {string} path - the route to connect to
 * @param {string} method - method to be used in the https request
 * @return {Object} - options for any lxd request
 */
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

/**
 * Make a request on LXD.
 * @param {string} path - the route to connect to
 * @param {string} method - method to be used in the request
 * @param {Object} data - body of the request if needed
 * @return {Object} - object of the lxd response
 */
function mkRequest(path, method, data) {
	let opts = mkOpts(path, method);
	if (debug && !path.includes("operation")) console.log({ path: path, method: method, data: data });
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
			res.on("end", () => {
				body = JSON.parse(body);
				if (body.error || (body.metadata && body.metadata.status_code >= 300))
					console.log({
						path: path,
						err: body.error || body.metadata.status,
					});
				resolve(body.metadata || body);
			});
		});
		if (data) req.write(data);
		req.end();
	});
}

/**
 * Construct a result state from the given operation object.
 * @param {Object} operation - an lxd operation response or error response
 * @return {OperationState} - summary result of the given object
 */
async function getOperation(operation) {
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

/**
 * Test the functionality of all present methods by uncommenting the required lines.
 */
export async function test() {
	// console.log(await deleteProfilesInProject(1));
	// console.log(await startInstance(1, 1));
	// console.log(await stopInstance(1, 1));
	/*let i = new Container(1);
	i.projectId = 1;
	i.template = new Template();
	i.state = new ContainerResourceState();
	i.state.internet = new NS.NetworkState();
	// console.log(await getInstance(i));
	console.log((await getState(1, 1, i.state)).internet);*/
	// console.log(await deleteInstance("73", "1"));
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
	// console.log(await execInstance("c1", "p1", "echo hello"));
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
	// console.log(await postFileToInstance("", 1, "/home/kepis/Downloads/haproxy.cfg", "/etc/haproxy/haproxy.cfg"));
}

/**
 * Get information about all instances from the array.
 * @param {Object} instances - instances to be completed
 * @return {Object} - OperationStatus of the operaion
 */
export function getInstances(instances) {
	return new Promise((resolve) => {
		let done = 0;
		if (instances.length > 0)
			instances.forEach((i) =>
				getInstance(i).then((instance) => {
					if (instance.statusCode && instance.statusCode != 200) resolve(instance);
					done++;
					if (done == instances.length) resolve(instances);
				})
			);
		else resolve(instances);
	});
}

/**
 * Create a container.
 * @param {Object} data - data for lxd to create a new container
 * @param {Object} commands - array of the command strings to be executed after start
 * @return {Object} - OperationStatus of the operaion
 */
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
		mdb
			.db("lxd")
			.collection(`p${data.project}`)
			.insertOne({ _id: data.name, data: null }, () => { });
		execCommands(id, data.project, commands);
	}
	return res;
}

/**
 * Get information about the container.
 * @param {Object} instance - object of the instance to be filled
 * @return {Object} - the filled in object
 */
export function getInstance(instance) {
	return mkRequest(`/1.0/instances/c${instance.id}?project=p${instance.projectId}`).then((res) => {
		if (!res.status_code || res.status_code > 200) return getOperation(res);
		instance.createdOn = new Date(res.created_at);
		instance.lastStartedOn = new Date(res.last_used_at);
		instance.stateful = res.stateful;
		// Is now managed by sql so no need to fill the data again.
		/*if (res.config["image.os"]) {
			instance.template.image = new Image(
				res.config["image.os"],
				res.config["image.version"],
				res.config["image.description"]
			);
		}*/
		return getSnapshots(instance.id, instance.projectId).then((snap) => {
			instance.snapshots = snap;
			return getState(instance.id, instance.projectId, instance.state).then((state) => instance);
		});
	});
}

/**
 * Patch the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} data - data to be patched
 * @return {Object} - OperationStatus of the operaion
 */
export function patchInstance(id, project, data) {
	return mkRequest(`/1.0/instances/${id}?project=${project}`, "PATCH", data).then((res) =>
		getOperation(res)
	);
}

/**
 * Delete the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteInstance(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/c${id}?project=p${project}`, "DELETE").then((res) =>
			getOperation(res).then((res) =>
				mdb
					.db("lxd")
					.collection(`p${project}`)
					.deleteOne({ _id: `c${id}` }, (err, data) =>
						resolve(err ? new OperationState(JSON.stringify(err), 400) : res)
					)
			)
		)
	);
}

/**
 * Create a virtual terminal in the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - {terminal,control} id to the websockets, or OperationState if an error
 */
export function getConsole(id, project) {
	return mkRequest(`/1.0/instances/c${id}/exec?project=p${project}`, "POST", {
		command: ["login", "-f", "--", "root"],
		// command: ["bash"],
		environment: {
			HOME: "/root",
			TERM: "xterm",
			USER: "root",
		},
		"wait-for-websocket": true,
		interactive: true,
	}).then((res) => {
		if (res.status_code != 103) return getOperation(res);
		let terminal = res.metadata.fds["0"];
		let control = res.metadata.fds.control;
		let term = new WebSocket(
			`wss://127.0.0.1:8443/1.0/operations/${res.id}/websocket?secret=${res.metadata.fds["0"]}`,
			{
				key: key,
				cert: crt,
				rejectUnauthorized: false,
			}
		);
		connections.set(terminal, { ws: term, control: control });
		term.on("error", (error) => console.log(`/p${project}/c${id}/console ERROR:  ${error}`));
		let ws = new WebSocket(
			`wss://127.0.0.1:8443/1.0/operations/${res.id}/websocket?secret=${res.metadata.fds.control}`,
			{
				key: key,
				cert: crt,
				rejectUnauthorized: false,
			}
		);
		connections.set(control, { ws: ws, terminal: terminal });
		ws.on("error", (error) => console.log(`/p${project}/c${id}/consoleControl ERROR:  ${error}`));
		ws.on("close", () => {
			ws = connections.get(control);
			term = connections.get(terminal);
			if (ws || (term && !term.cws)) {
				if (ws && ws.cws) ws.cws.close();
				connections.delete(terminal);
				if (term && term.cws) term.cws.close();
				connections.delete(control);
			}
		});
		return {
			terminal: res.metadata.fds["0"],
			control: res.metadata.fds.control,
		};
	});
}

/**
 * Execute a command in the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {string} command - command to be executed
 * @return {Object} - OperationStatus of the operaion, where status contains the text output of the executed command
 */
export function execInstance(id, project, command, getOutput) {
	if (!isNaN(parseFloat(project))) id = `c${id}`;
	if (!isNaN(parseFloat(project))) project = `p${project}`;
	return mkRequest(`/1.0/instances/${id}/exec?project=${project}`, "POST", {
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
									`${res.metadata.output[res.metadata.return == 0 ? "1" : "2"]
									}?project=${project}`
								),
								(req) => {
									let body = "";
									req.setEncoding("utf8");
									req.on("data", (d) => (body += d));
									req.on("end", () =>
										resolve(new OperationState(body.trim(), res.metadata.return))
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

/**
 * Execute multiple commands in the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} commands - array of the command strings to be executed
 * @return {Object} - OperationStatus of the operaion
 */
export async function execCommands(id, project, commands) {
	for (let i = 0; i < commands.length; i++) {
		let stat = await execInstance(id, project, commands[i], false);
		if (debug || stat.statusCode != 200)
			console.log({
				container: `c${id} in p${project}`,
				command: commands[i],
				status: stat.statusCode,
				desc: stat.status,
			});
	}
}

/**
 * Create a file in the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} piper - handler to send the file to container
 * @param {string} dstPath - destination path in the container
 * @param {Object} headers - headers of the request
 * @return {Object} - OperationStatus of the operaion
 */
function postToInstance(id, project, piper, dstPath, headers) {
	if (!isNaN(parseFloat(project))) id = `c${id}`;
	if (!isNaN(parseFloat(project))) project = `p${project}`;
	let opts = mkOpts(`/1.0/instances/${id}/files?project=${project}&path=${dstPath}`, "POST");
	opts.headers = headers;
	opts.headers["Content-Type"] = "application/octet-stream";
	return new Promise((resolve) => {
		let req = https.request(opts, (res) => {
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (d) => (body += d));
			res.on("end", () => {
				body = JSON.parse(body);
				if (!body.status_code || debug)
					console.log({
						container: `${id} in ${project}`,
						dstPath: dstPath,
						response: body,
					});
				resolve(body.status_code || body.error_code);
			});
		});
		piper(req);
	});
}

/**
 * Send the file to the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {string} srcPath - path to the file to be sent
 * @param {string} dstPath - destination path in the container
 * @return {Object} - OperationStatus of the operaion
 */
export function postFileToInstance(id, project, srcPath, dstPath) {
	let stream = fs.createReadStream(
		srcPath.startsWith(".") ? path.resolve(__dirname, srcPath) : srcPath
	);
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

/**
 * Pipe a response to the container as a file.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} response - http response of which the content should be redirected
 * @param {string} dstPath - destination path in the container
 * @return {Object} - OperationStatus of the operaion
 */
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
		},
		false
	);
}

/**
 * Get state of the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} rs - State object to be filled in
 * @return {Object} - the completed State object
 */
export async function getState(id, project, rs) {
	let data = await mkRequest(`/1.0/instances/c${id}/state?project=p${project}`);
	if (!data.status_code) return getOperation(data);
	let dbdata = { networks: { other: [] } };
	let proj = mdb.db("lxd").collection(`p${project}`);
	//use the time efficiently and while the measurement waits
	//for another measure, we put all available data in its place
	await new Promise((resolve) => {
		rs.operationState = new OperationState(data.status, data.status_code);
		rs.RAM.usage = data.memory.usage + data.memory.swap_usage;
		rs.RAM.usagePeak = data.memory.usage_peak + data.memory.swap_usage_peak;
		rs.disk.devices[0].name = "root";
		if (data.status_code != 102) {
			//finds only space used by containers sharing the same pool -> unusable
			execInstance(
				id,
				project,
				"du -sh -B 1 --exclude=/dev --exclude=/proc --exclude=/sys / | awk '{print $1;exit}'"
				// "df -B 1 | awk '/\\/$/{print $4;exit}'"
			).then((res) => {
				if (res.status && res.statusCode < 400)
					rs.disk.devices[0].usage = dbdata.disk = parseInt(res.status) - 1000000000;
				else
					proj.findOne({ _id: `c${id}` }, (err, res) => {
						if (!err && res.data && res.data.disk) rs.disk.devices[0].usage = res.data.disk;
						else rs.disk.devices[0].usage = 300000000;
					});
			});
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
					network.counters.download.bytesFromStart = lxdn.counters.bytes_received;
					network.counters.upload.bytesFromStart = lxdn.counters.bytes_sent;
					switch (key) {
						case "eth0":
							network.limits = rs.internet.limits;
							rs.internet = dbdata.networks.internet = network;
							break;
						case "lo":
							rs.loopback = dbdata.networks.loopback = network;
							break;
						default:
							dbdata.networks.other.push(network);
							rs.networks.push(network);
					}
				});
			setTimeout(resolve, 1000);
		} else resolve();
	}, 1000);
	if (data.status_code != 102) {
		let dataNew = await mkRequest(`/1.0/instances/c${id}/state?project=p${project}`);
		rs.CPU.usage =
			((rs.CPU.usedTime = dataNew.cpu.usage) - data.cpu.usage) / 1000000000000 * 100 * rs.CPU.limit; // limit is in Hz
		if (data.network)
			Object.keys(data.network).forEach((key) => {
				let lxdc = data.network[key].counters;
				let counters;
				switch (key) {
					case "eth0":
						counters = rs.internet.counters;
						break;
					case "lo":
						counters = rs.loopback.counters;
						break;
					default:
						for (let i = 0; i < rs.networks.length; i++)
							if (rs.networks[i].name == key) {
								counters = rs.networks[i].counters;
								break;
							}
				}
				// speed is in b/s, because we measure with 1s delay
				counters.download.usedSpeed = lxdc.bytes_received - counters.download.bytesFromStart;
				counters.download.bytesFromStart = lxdc.bytes_received;
				counters.upload.usedSpeed = lxdc.bytes_sent - counters.upload.bytesFromStart;
				counters.upload.bytesFromStart = lxdc.bytes_sent;
				counters.download.packetsFromStart = lxdc.packets_received;
				counters.upload.packetsFromStart = lxdc.packets_sent;
			});
		proj.updateOne({ _id: `c${id}` }, { $set: { data: dbdata } }, (err, result) => {
			if (err)
				console.log({
					id: `c${id}`,
					project: `p${project}`,
					mdbErr: err,
				});
			else if (result.result.n == 0)
				console.log({
					id: `c${id}`,
					project: `p${project}`,
					mdbErr: "Not initialized",
				});
		});
		return rs;
	} else
		return new Promise((resolve) =>
			proj.findOne({ _id: `c${id}` }, (err, res) => {
				if (!err) {
					rs.CPU.usedTime = res.data.cpuTime;
					rs.disk.devices[0].usage = res.data.disk;
					rs.internet = res.data.networks.internet;
					rs.loopback = res.data.networks.loopback;
					rs.networks = res.data.networks.other;
				}
				rs.CPU.usage = 0;
				resolve(rs);
			})
		);
}

/**
 * Get information about all snapshots in the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - Array of snapshots in the container.
 */
export function getSnapshots(id, project) {
	return new Promise((resolve) =>
		mkRequest(`/1.0/instances/c${id}/snapshots?project=p${project}`).then((snaps) => {
			let prefix = `/1.0/instances/c${id}/snapshots/s`.length;
			let suffix = `?project=p${project}`.length;
			let snapshots = new Array();
			if (snaps.length > 0)
				snaps.forEach((name) =>
					getSnapshot(id, project, name.substring(prefix, name.length - suffix)).then((snap) => {
						snapshots.push(snap);
						if (snapshots.length == snaps.length) resolve(snapshots);
					})
				);
			else resolve(snapshots);
		})
	);
}

/**
 * Create a snapshot from the container.
 * @param {number} instanceId - id of the container
 * @param {number} projectId - id of the parent project
 * @param {number} snapshotId - id of the snapshot
 * @return {Object} - OperationStatus of the operaion
 */
export function createSnapshot(instanceId, projectId, snapshotId, stateful) {
	return mkRequest(`/1.0/instances/c${instanceId}/snapshots?project=p${projectId}`, "POST", {
		name: `s${snapshotId}`,
		stateful: stateful,
	}).then((operation) =>
		getOperation(operation).then((res) => {
			if (res.statusCode == 200) return getSnapshot(instanceId, projectId, snapshotId);
			else return res;
		})
	);
}

/**
 * Get information a snapshot from the container.
 * @param {number} instanceId - id of the container
 * @param {number} projectId - id of the parent project
 * @param {number} snapshotId - id of the snapshot
 * @return {Object} - Snapshot object representing the snapshot
 */
function getSnapshot(instanceId, projectId, snapshotId) {
	return mkRequest(
		`/1.0/instances/c${instanceId}/snapshots/s${snapshotId}?project=p${projectId}`
	).then((data) => new Snapshot(snapshotId, data.created_at, data.stateful));
}

/**
 * Delete a snapshot from the container.
 * @param {number} instanceId - id of the container
 * @param {number} projectId - id of the parent project
 * @param {number} snapshotId - id of the snapshot
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteSnapshot(instanceId, projectId, snapshotId) {
	return mkRequest(
		`/1.0/instances/c${instanceId}/snapshots/s${snapshotId}?project=p${projectId}`,
		"DELETE"
	).then((res) => getOperation(res));
}

/**
 * Export the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @param {Object} stream - writable stream for the exported instance.tar.gz file
 * @return {Object} - OperationStatus of the operaion
 */
export async function exportInstance(id, project, stream) {
	let res = await mkRequest(`/1.0/instances/c${id}/backups?project=p${project}`);
	if (res.error_code) return getOperation(res);
	let bid = res.length;
	for (let i = 0; i < res.length; i++) {
		let num = parseInt(res[i].substring(`/1.0/instances/c${id}/backups/b`));
		if (num > bid) bid = num;
	}
	bid++;
	let expiry = new Date();
	expiry.setHours(expiry.getHours() + 5);
	res = await mkRequest(`/1.0/instances/c${id}/backups?project=p${project}`, "POST", {
		name: `b${bid}`,
		expires_at: expiry,
		instance_only: true,
		optimized_storage: true,
		//    compression_algorithm: "xz",
	});
	res = await getOperation(res);
	if (res.statusCode == 200) {
		let req = https.request(
			mkOpts(`/1.0/instances/c${id}/backups/b${bid}/export?project=p${project}`),
			(res) => {
				res.pipe(stream);
				stream.on("finish", () => deleteBackup(id, project, bid));
				stream.on("close", () => deleteBackup(id, project, bid));
				stream.on("end", () => deleteBackup(id, project, bid));
				res.on("close", () => deleteBackup(id, project, bid));
			}
		);
		req.end();
		return req;
	} else return res;
}

/**
 * Delete backup of the container.
 * @param {number} instanceId - id of the container
 * @param {number} projectId - id of the parent project
 * @param {number} backupId - id of the backup
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteBackup(instanceId, projectId, backupId) {
	return mkRequest(
		backupId === undefined
			? instanceId
			: `/1.0/instances/c${instanceId}/backups/b${backupId}?project=p${projectId}`,
		"DELETE"
	).then((res) => getOperation(res));
}

/**
 * Import a local instance as {id} in the specified project.
 * @param {number} id - id of the container to be created
 * @param {number} project - id of the parent project
 * @param {Object} stream - readable stream with the container file to be imported
 * @return {Object} - OperationStatus of the operaion
 */
export function importInstance(id, project, stream) {
	let opts = mkOpts(`/1.0/instances?project=p${project}`, "POST");
	opts.headers = {
		"Content-Type": "application/octet-stream",
		"X-LXD-name": `c${id}`,
	};
	return new Promise((resolve) => {
		let req = https.request(opts, (res) => {
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (d) => (body += d));
			res.on("end", () => {
				body = JSON.parse(body);
				resolve(body.metadata || body);
			});
		});
		stream.pipe(req);
		stream.on("finish", () => req.end());
	}).then((res) => getOperation(res));
}

/**
 * Start the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - OperationStatus of the operaion
 */
export function startInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "start",
		timeout: 60,
	}).then((res) => getOperation(res));
}

/**
 * Stop the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - OperationStatus of the operaion
 */
export function stopInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "stop",
		timeout: 60,
	}).then((res) => getOperation(res));
}

/**
 * Freeze the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - OperationStatus of the operaion
 */
export function freezeInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "freeze",
		timeout: 60,
	}).then((res) => getOperation(res));
}

/**
 * Unfreeze the container.
 * @param {number} id - id of the container
 * @param {number} project - id of the parent project
 * @return {Object} - OperationStatus of the operaion
 */
export function unfreezeInstance(id, project) {
	return mkRequest(`/1.0/instances/c${id}/state?project=p${project}`, "PUT", {
		action: "unfreeze",
		timeout: 60,
	}).then((res) => getOperation(res));
}

/**
 * Create a new project of the given specifications.
 * @param {Object} data - all the data needed by lxd for a project creation
 * @return {Object} - OperationStatus of the operaion
 */
export function createProject(data) {
	data.name = `p${data.name}`;
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

/**
 * Delete the specified project.
 * @param {number} id - id of the project to be deleted
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteProject(id) {
	return new Promise((resolve) => {
		deleteImagesOf(id).then((res) => {
			if (res.statusCode != 200) resolve(res);
			deleteProfilesOf(id).then((res) => {
				if (res.statusCode != 200) resolve(res);
				mkRequest(`/1.0/projects/p${id}`, "DELETE").then((res) => {
					if (!res || !res.error)
						mdb
							.db("lxd")
							.collection(`p${id}`)
							.drop((err, result) => {
								if (err) res = { error: err.toString(), eror_code: 400 };
								resolve(getOperation(res));
							});
					else resolve(getOperation(res));
				});
			});
		});
	});
}

/**
 * Delete all images of specified project.
 * @param {number} projectId - id of the project to be cleaned of profiles
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteImagesOf(projectId) {
	return mkRequest(`/1.0/images?project=p${projectId}`).then((images) => {
		if (images.error_code) return getOperation(images);
		else if (images.length > 0) {
			let done = 0;
			let error;
			return new Promise((resolve) =>
				images.forEach((image) =>
					mkRequest(`${image}?project=p${projectId}`, "DELETE").then((res) => {
						if (res.status_code != 200) error = getOperation(res);
						done++;
						if (done == images.length) resolve(error || getOperation(res));
					})
				)
			);
		} else return new OperationState(`No images.`, 200);
	});
}

/**
 * Delete all profiles of specified project except the default profile.
 * @param {number} projectId - id of the project to be cleaned of profiles
 * @return {Object} - OperationStatus of the operaion
 */
export function deleteProfilesOf(projectId) {
	return mkRequest(`/1.0/profiles?project=p${projectId}`).then((profiles) => {
		if (profiles.error_code) return getOperation(profiles);
		else if (profiles.length > 1) {
			let done = 1;
			let error;
			return new Promise((resolve) =>
				profiles.forEach((profile) => {
					if (!profile.endsWith("/default"))
						mkRequest(`${profile}?project=p${projectId}`, "DELETE").then((res) => {
							if (res.status_code != 200) error = getOperation(res);
							done++;
							if (done == profiles.length) resolve(error || getOperation(res));
						});
				})
			);
		} else return new OperationState(`No profiles.`, 200);
	});
}

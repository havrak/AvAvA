import WebSocket from "ws";
export const wss = new WebSocket.Server({ noServer: true });
export const connections = new Map();
wss.on("connection", (clientWS, req) => {
	let path = req.url;
	let lxd = connections.get(path);
	if (lxd && lxd.ws) {
		let lxdWS = lxd.ws;
		lxd.cws = clientWS;
		let onInput = (data) => {
			if (lxdWS.readyState == 1) {
				lxdWS.send(
					Buffer.from(data).toString(),
					{ binary: true },
					() => {}
				);
			} else clientWS.send("!!Not connected yet!!\n");
		};
		if (lxd.control) {
			lxdWS.on("message", (data) =>
				clientWS.send(Buffer.from(data).toString())
			);
			lxdWS.on("open", () => clientWS.send("!!Connection opened!!\n"));
			lxdWS.on("error", (error) => clientWS.send(`lxdWS ERROR: ${error}`));
			clientWS.on("close", () => {
				let control = connections.get(lxd.control);
				if (control) control.ws.close();
				lxdWS.send("exit", { binary: true }, () => lxdWS.close());
			});
		}
		clientWS.on("close", () => (lxd.cws = undefined));
		clientWS.on("message", onInput);
		lxdWS.on("close", () => {
			clientWS.removeListener("message", onInput);
			if (lxd.control) clientWS.close();
		});
		clientWS.on("error", (error) => console.log(`ClientWS ERROR: ${error}`));
	} else clientWS.close();
});

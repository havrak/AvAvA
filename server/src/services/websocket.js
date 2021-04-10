import WebSocket from "ws";
export const wss = new WebSocket.Server({ noServer: true });
export const connections = new Map();
wss.on("connection", (clientWS, req) => {
	let path = req.url;
	let lxd = connections.get(path);
	let lxdWS = lxd.ws;
	if (lxdWS) {
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
				lxdWS.send("exit", { binary: true }, () => lxdWS.close());
			});
		}
		clientWS.on("message", onInput);
		lxdWS.on("close", () => {
			clientWS.send("\n!!Connection closed!!\n");
			clientWS.removeListener("message", onInput);
			clientWS.close();
			if (lxd.terminal) {
				let lxdTerm = connections.get(lxd.terminal);
				if (lxdTerm) lxdTerm.ws.close();
			} else if (lxd.control) {
				let lxdControl = connections.get(lxd.control);
				if (lxdControl) lxdControl.ws.close();
			}
			connections.delete(path);
		});
		clientWS.on("error", (error) => console.log(`ClientWS ERROR: ${error}`));
	} else clientWS.close();
});

import WebSocket from "ws";
export const wss = new WebSocket.Server({ noServer: true });
export const connections = new Array();
wss.on("connection", (clientWS, req) => {
	let lxdWS = connections[req.url];
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
		lxdWS.on("message", (data) =>
			clientWS.send(Buffer.from(data).toString())
		);
		lxdWS.on("open", () => clientWS.send("!!Connection opened!!\n"));
		lxdWS.on("error", (error) => clientWS.send(`ERROR: ${error}`));
		lxdWS.on("close", () => {
			clientWS.send("\n!!Connection closed!!\n");
			clientWS.removeListener("message", onInput);
			clientWS.close();
			connections[req.url] = undefined;
		});
		clientWS.on("message", onInput);
		clientWS.on("close", () => {
			lxdWS.send("exit", { binary: true }, () => lxdWS.close());
			connections[req.url] = undefined;
		});
		clientWS.on("error", (error) => console.log(`Client ERROR: ${error}`));
	} else clientWS.close();
});

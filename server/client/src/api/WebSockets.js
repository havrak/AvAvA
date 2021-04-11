function createWebSocket(protocol, hostname, port, route){
   console.log(`${protocol}${hostname}:${port}/${route}`)
   return new WebSocket(`${protocol}${hostname}:${port}/${route}`);
}

function createBasicWebSocket(route){
   return createWebSocket(window.location.protocol === "https:" ? "wss://" : "ws://", window.location.hostname, window.location.port, route);
}

export function createTerminalSocket(projectId, containerId, terminalId){
   return createBasicWebSocket(`websockets/terminals/${projectId}/${containerId}/${terminalId}`)
}
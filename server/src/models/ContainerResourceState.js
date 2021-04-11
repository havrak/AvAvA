export default class ContainerResourceState {
  measuredOn;
  CPU = {
    limit: undefined,
    usedTime: undefined,
    usage: undefined,
  };
  RAM = {
    limit: undefined,
    usage: undefined,
    usagePeak: undefined,
  };
  disk = {
    limit: undefined,
    devices: [
      {
        name: undefined,
        usage: undefined,
      },
    ],
  };
  internet; // -> NetworkState.js
  loopback; // -> NetworkState.js
  networks = []; // -> [NetworkState.js]

  numberOfProcesses;
  operationState;
}

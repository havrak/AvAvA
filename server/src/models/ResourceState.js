export default {
  status: "",
  statusCode: 0,
  CPU: {
    consumedTime: 0,
    percentConsumed: 0,
  },
  RAM: {
    usage: 0,
    usagePeak: 0,
    percentConsumed: 0,
  },
  disk: {
    currentlyCosumedMemory: [],
    percentConsumed: 0,
  },
  networks: [],
  numberOfProcesses: 0,
};

export const userDiskSpace = {
  user: "",
  usage: 0,
};

export const network = {
  networkName: "",
  addresses: [],
  counters: {
    bytesRecieved: 0,
    bytesSent: 0,
    packetsRecieved: 0,
    packetsSent: 0,
  },
  hwaddr: "",
  hostName: "",
  mtu: 0,
  state: "",
  type: "",
};

export const address = {
  family: "",
  address: "",
  netmask: 0,
  scope: 0,
};

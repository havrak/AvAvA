export class ResourceState {
  OperationState;
  CPU = {
    consumedTime: undefined,
    percentConsumed: undefined,
  };
  RAM = {
    usage: undefined,
    usagePeak: undefined,
    percentConsumed: undefined,
  };
  disk = {
    currentlyCosumedMemory: [],
    percentConsumed: undefined,
  };
  networks = new Array();
  numberOfProcesses;
}

export class UserDiskSpace {
  user;
  usage;
}

export class Network {
  networkName;
  addresses = new Array();
  counters = {
    bytesRecieved: undefined,
    bytesSent: undefined,
    packetsRecieved: undefined,
    packetsSent: undefined,
  };
  hwaddr;
  hostName;
  mtu;
  state;
  type;
}

export class Address {
  family;
  address;
  netmask;
  scope;
}

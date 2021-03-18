export class ContainerResourceState {
	timestamp;
	CPU = {
		consumedTime: undefined,
		percentConsumed: undefined,
	};
	RAM = {
		usage: undefined,
		usagePeak: undefined,
		percentConsumed: undefined,
	};
	disk = new Array();
	networks = new Array();

	numberOfProcesses;
	OperationState;
}

export class Disk {
	constructor(deviceName, currentlyConsumedMemory, percentConsumed) {
		this.deviceName = deviceName;
		this.currentlyConsumedMemory = currentlyConsumedMemory;
		this.percentConsumed = percentConsumed;
	}
	deviceName;
	currentlyConsumedMemory;
	percentConsumed;
}

export class Network {
	constructor(networkName, addresses, hwaddr, hostName, mtu, state, type) {
		this.networkName = networkName;
		this.addresses = addresses;
		this.hwaddr = hwaddr;
		this.hostName = hostName;
		this.mtu = mtu;
		this.state = state;
		this.type = type;
	}

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
	constructor(family, address, netmask, scope) {
		this.family;
		this.address;
		this.netmask;
		this.scope;
	}
	family;
	address;
	netmask;
	scope;
}

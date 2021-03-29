export class ContainerResourceState {
	measureOn;
	CPU = {
		limit: undefined,
		consumedTime: undefined,
		percentConsumed: undefined,
	};
	RAM = {
		limit: undefined,
		usage: undefined,
		usagePeak: undefined,
	};
	disk = {
		limit: undefined,
		devices: {
			name: undefined,
			usage: undefined,
		},
	};
	internet; // -> NetworkState.js
	loopback; // -> NetworkState.js
	networks = []; // -> [NetworkState.js]

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

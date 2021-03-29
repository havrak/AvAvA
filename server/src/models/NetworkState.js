export class NetworkState {
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
	limits = {
		download: undefined,
		upload: undefined,
	};
	addresses = new Array();
	counters = {
		download: {
			usedSpeed: undefined,
			bytesRecieved: undefined,
			packetsRecieved: undefined,
		},
		upload: {
			usedSpeed: undefined,
			bytesSent: undefined,
			packetsSent: undefined,
		},
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

export class NetworkState {
	constructor(name, addresses, hwaddr, hostName, mtu, state, type) {
		this.name = name;
		this.addresses = addresses;
		this.hwaddr = hwaddr;
		this.hostName = hostName;
		this.mtu = mtu;
		this.state = state;
		this.type = type;
	}

	name;
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
		this.family = family;
		this.address = address;
		this.netmask = netmask;
		this.scope = scope;
	}
	family;
	address;
	netmask;
	scope;
}

export default class LightResourceState {
	limits; // -> Limits.js
	timestamp;
	CPU = {
		consumedTime: undefined,
		consumedHz: undefined,
		percentConsumed: undefined,
		allocatedHz: undefined,
		percentAllocated: undefined
	}
	RAM = {
		usage,
		percentConsumed: undefined,
		allocated: undefined,
		percentAllocated: undefined
	}
	disk = {
		upload = {
			uploadSpeed: undefined,
			uploadBandwidthSpeed: undefined,
			allocatedUploadSpeed: undefined,
			allocatedBandwidthSpeed: undefined
		},
		download = {
			downloadSpeed: undefined,
			downloadBandwidthUsage: undefined,
			allocatedDownloadSpeed: undefined,
			allocatedBandwidthUsage: undefined
		}
	}
	numberOfProcesses;
}

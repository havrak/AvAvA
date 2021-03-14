export default class LightResourceState {
	limits; // -> Limits.js
	timestamp;
	CPU = {
		consumedTime: undefined,
		percentConsumed: undefined,
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

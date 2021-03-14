export default class LightResourceState {
	limits; // -> Limits.js
	timestamp;
	CPU = {
		consumedTime,
		percentConsumed,
		percentAllocated
	}
	RAM = {
		usage,
		percentConsumed,
		allocated,
		percentAllocated
	}
	disk = {
		upload = {
			uploadSpeed,
			uploadBandwidthSpeed,
			allocatedUploadSpeed,
			allocatedBandwidthSpeed
		},
		download = {
			downloadSpeed,
			downloadBandwidthUsage,
			allocatedDownloadSpeed,
			allocatedBandwidthUsage
		}
	}
	numberOfProcesses;
}

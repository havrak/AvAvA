import {ramToMB, diskToGB, networkSpeedToMbits} from './UnitsConvertor';

export function limitsFromParentState(parentLimits, parentState){
   const limits = {};
   limits.RAM = ramToMB(parentLimits.RAM - (parentState.RAM.allocated + parentState.RAM.usage));
   limits.CPU = 100 - (parentState.CPU.percentConsumed + parentState.CPU.percentAllocated);
   limits.disk = diskToGB(parentLimits.disk - (parentState.disk.usage + parentState.disk.allocated));
   limits.network = {};
   limits.network.upload = networkSpeedToMbits(parentLimits.network.upload - (parentState.network.upload.uploadSpeed + parentState.network.upload.allocatedUploadSpeed)),
   limits.network.download = networkSpeedToMbits(parentLimits.network.download - (parentState.network.download.downloadSpeed + parentState.network.download.allocatedDownloadSpeed))
   return limits;
}
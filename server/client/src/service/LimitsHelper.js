import { ramToMB, diskToGB, networkSpeedToMbits, CPUToMhz } from "./UnitsConvertor";

export function limitsFromParentState(parentLimits, parentState) {
   const limits = {};
   limits.RAM = ramToMB(
      calculateFreeAmount(
         parentLimits.RAM,
         parentState.RAM.allocated,
         parentState.RAM.usage
      )
   );
   limits.CPU = CPUToMhz(
      calculateFreeAmount(
         parentLimits.CPU,
         parentState.CPU.consumedHz,
         parentState.CPU.allocatedHz
      )
   );
   limits.disk = diskToGB(
      calculateFreeAmount(
         parentLimits.disk,
         parentState.disk.usage,
         parentState.disk.allocated
      )
   );
   limits.network = {};
   (limits.network.upload = networkSpeedToMbits(
      calculateFreeAmount(
         parentLimits.network.upload,
         parentState.network.upload.uploadSpeed,
         parentState.network.upload.allocatedUploadSpeed
      )
   )),
      (limits.network.download = networkSpeedToMbits(
         calculateFreeAmount(
            parentLimits.network.download,
            parentState.network.download.downloadSpeed,
            parentState.network.download.allocatedDownloadSpeed
         )
      ));
   return limits;
}

export function calculateFreeAmount(maxAmount, usedAmount, allocatedAmount) {
   return maxAmount - (allocatedAmount + usedAmount);
}

export function calculateFreePercent(percentAllocated, percentConsumed) {
   return Math.round((100 - (percentAllocated + percentConsumed)) * 100.0) / 100.0;
}

export function bytesToAdequateMessage(bytes) {
   if (bytes > 1_000_000_000_000) {
      return Math.round(bytes / 1_000_000_000) / 1_000.0 + "TB";
   } else if (bytes > 1_000_000_000) {
      return Math.round(bytes / 1_000_000) / 1_000.0 + "GB";
   } else if (bytes > 1_000_000) {
      return Math.round(bytes / 1_000) / 1_000.0 + "MB";
   } else if (bytes > 1_000) {
      return bytes / 1_000.0 + "KB";
   } else {
      return bytes + "B";
   }
}

export function bytesPerSecondToAdequateMessage(bytes) {
   if (bytes > 1_000_000_000_000) {
      return Math.round(bytes / 1_000_000_000) / 1_000.0 + "Tb/s";
   } else if (bytes > 1_000_000_000) {
      return Math.round(bytes / 1_000_000) / 1_000.0 + "Gb/s";
   } else if (bytes > 1_000_000) {
      return Math.round(bytes / 1_000) / 1_000.0 + "Mb/s";
   } else if (bytes > 1_000) {
      return bytes / 1_000.0 + "Kb/s";
   } else {
      return bytes + "b/s";
   }
}

export function secondsToAdequateMessage(bytes) {
   if (bytes > 1_000_000_000) {
      return Math.round(bytes / 1_000_000) / 1_000.0 + "s";
   } else if (bytes > 1_000_000) {
      return Math.round(bytes / 1_000) / 1_000.0 + "ms";
   } else if (bytes > 1_000) {
      return bytes / 1_000.0 + "µs";
   } else {
      return bytes + "ns";
   }
}

export function HzToAdequateMessage(Hz) {
   if (Hz > 1_000_000_000) {
      return Math.round(Hz / 1_000_000) / 1_000.0 + "GHz";
   } else if (Hz > 1_000_000) {
      return Math.round(Hz / 1_000) / 1_000.0 + "MHz";
   } else if (Hz > 1_000) {
      return Hz / 1_000.0 + "KHz";
   } else {
      return Hz + "Hz";
   }
}

export function ramToMB(bytes) {
   return Math.round(bytes / 1_000) / 1_000.0;
}

export function ramFromMBToB(MB){
   return GB * 1_000_000;
}

export function diskToGB(bytes) {
   return Math.round(bytes / 1_000_000) / 1_000.0;
}

export function diskFromGBToB(GB){
   return GB * 1_000_000_000;
}

export function CPUToMhz(Hz){
   return Math.round(Hz / 1_000) / 1_000.0;
}

export function networkSpeedToMbits(bytes){
   return Math.round(bytes / 1_000) / 1_000.0;
}

export function networkSpeedFromMBitsToBits(MBits){
   return MBits * 1_000_000;
}
class UnitContainer {
   constructor(value, unit) {
      this.value = value;
      this.unit = unit;
   }
   getMessage() {
      return this.value + this.unit;
   }
}

const prefixes = {
   T: 1_000_000_000_000,
   G: 1_000_000_000,
   M: 1_000_000,
   K: 1_000,
   m: 0.001,
   µ: 0.000_001,
   n: 0.000_000_001,
};

export function bytesToAdequateValue(bytes) {
   return toAdequatevalue(bytes, 'B');
}

export function bitsPerSecondToAdequateValue(bytesPerSecond) {
   return toAdequatevalue(bytesPerSecond, 'bit/s');
}

export function secondsToAdequateValue(seconds) {
   return toAdequatevalue(seconds, 's');
}

export function HzToAdequateValue(Hz) {
   return toAdequatevalue(Hz, 'Hz');
}

function toAdequatevalue(value, unit){
   if (value >= prefixes.T) {
      return new UnitContainer(Math.round(value / 10_000_000_000) / 100.0, `T${unit}`);
   } else if (value >= prefixes.G) {
      return new UnitContainer(Math.round(value / 10_000_000) / 100.0, `G${unit}`);
   } else if (value >= prefixes.M) {
      return new UnitContainer(Math.round(value / 10_000) / 100.0, `M${unit}`);
   } else if (value >= prefixes.K) {
      return new UnitContainer(Math.round(value / 10.0) / 100.0, `K${unit}`);
   } else {
      return new UnitContainer(value, unit);
   }
}

// export function ramToMB(bytes) {
//    return Math.round(bytes / 1_000 / 1_000.0;
// }

// export function ramFromMBToB(MB) {
//    return MB * prefixes.M;
// }

// export function diskToGB(bytes) {
//    return Math.round(bytes / prefixes.M) / 1_000.0;
// }

// export function diskFromGBToB(GB) {
//    return GB * prefixes.G;
// }

// export function CPUToMHz(Hz) {
//    return Math.round(Hz / 1_000) / 1_000.0;
// }

// export function CPUFromMHzToHz(MHz) {
//    return MHz * prefixes.M;
// }

// export function networkSpeedToMbits(bytes) {
//    return Math.round(bytes / 1_000) / 1_000.0;
// }

// export function networkSpeedFromMBitsToBits(MBits) {
//    return MBits * prefixes.M;
// }

export function ramToMB(bytes) {
   return bytes / prefixes.M;
}

export function ramFromMBToB(MB) {
   return Math.round(MB * prefixes.M);
}

export function diskToGB(bytes) {
   return bytes / prefixes.G;
}

export function diskFromGBToB(GB) {
   return Math.round(GB * prefixes.G);
}

export function CPUToMHz(Hz) {
   return Hz / prefixes.M;
}

export function CPUFromMHzToHz(MHz) {
   return Math.round(MHz * prefixes.M);
}

export function networkSpeedToMbits(bytes) {
   return bytes / prefixes.M;
}

export function networkSpeedFromMBitsToBits(MBits) {
   return Math.round(MBits * prefixes.M);
}

//https://www.codegrepper.com/code-examples/javascript/how+to+show+only+hours+and+minutes+from+javascript+date
//creates hours:minutes date with 2 digits - 01:05
export function prettyDate(date) {
   return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
   });
}

class Container {
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
   if (bytes > 1_000_000_000_000) {
      return new Container(Math.round(bytes / 10_000_000_000) / 100.0, "TB");
   } else if (bytes > 1_000_000_000) {
      return new Container(Math.round(bytes / 10_000_000) / 100.0, "GB");
   } else if (bytes > 1_000_000) {
      return new Container(Math.round(bytes / 10_000) / 100.0, "MB");
   } else if (bytes > 1_000) {
      return new Container(Math.round(bytes / 10.0) / 100.0, "KB");
   } else {
      return new Container(bytes, "B");
   }
}

export function bytesPerSecondToAdequateValue(bytes) {
   if (bytes > 1_000_000_000_000) {
      return new Container(Math.round(bytes / 10_000_000_000) / 100.0, "Tbit/s");
   } else if (bytes > 1_000_000_000) {
      return new Container(Math.round(bytes / 10_000_000) / 100.0, "Gbit/s");
   } else if (bytes > 1_000_000) {
      return new Container(Math.round(bytes / 10_000) / 100.0, "Mbit/s");
   } else if (bytes > 1_000) {
      return new Container(Math.round(bytes / 10.0) / 100.0, "Kbit/s");
   } else {
      return new Container(bytes, "bit/s");
   }
}

export function secondsToAdequateValue(bytes) {
   if (bytes > 1_000_000_000) {
      return new Container(Math.round(bytes / 10_000_000.0) / 100.0, "s");
   } else if (bytes > 1_000_000) {
      return new Container(Math.round(bytes / 10_000.0) / 100.0, "ms");
   } else if (bytes > 1_000) {
      return new Container(Math.round(bytes / 10.0) / 100.0, "µs");
   } else {
      return new Container(bytes, "ns");
   }
}

export function HzToAdequateValue(Hz) {
   if (Hz > 1_000_000_000) {
      return new Container(Math.round(Hz / 10_000_000) / 100.0, "GHz");
   } else if (Hz > 1_000_000) {
      return new Container(Math.round(Hz / 10_000) / 100.0, "MHz");
   } else if (Hz > 1_000) {
      return new Container(Math.round(Hz / 10.0) / 100.0, "KHz");
   } else {
      return new Container(Hz, "Hz");
   }
}

export function ramToMB(bytes) {
   return Math.round(bytes / 1_000) / 1_000.0;
}

export function ramFromMBToB(MB) {
   return MB * 1_000_000;
}

export function diskToGB(bytes) {
   return Math.round(bytes / 1_000_000) / 1_000.0;
}

export function diskFromGBToB(GB) {
   return GB * 1_000_000_000;
}

export function CPUToMHz(Hz) {
   return Math.round(Hz / 1_000) / 1_000.0;
}

export function CPUFromMHzToHz(MHz) {
   return MHz * 1_000_000;
}

export function networkSpeedToMbits(bytes) {
   return Math.round(bytes / 1_000) / 1_000.0;
}

export function networkSpeedFromMBitsToBits(MBits) {
   return MBits * 1_000_000;
}

//https://www.codegrepper.com/code-examples/javascript/how+to+show+only+hours+and+minutes+from+javascript+date
//creates hours:minutes date with 2 digits - 01:05
export function prettyDate(date) {
   return date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
   });
}

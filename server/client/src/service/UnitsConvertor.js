export function bytesToAdequateMessage(bytes){
   if(bytes > 1_000_000_000_000){
      return Math.round(bytes / 1_000_000_000) / 1_000.0 + 'TB'
   } else if(bytes > 1_000_000_000){
      return Math.round(bytes / 1_000_000) / 1_000.0 + 'GB'
   } else if(bytes > 1_000_000){
      return Math.round(bytes / 1_000) / 1_000.0 + 'MB'
   } else if(bytes > 1_000){
      return bytes / 1_000.0 + 'KB'
   } else {
      return bytes + 'B';
   }
}

export function bytesPerSecondToAdequateMessage(bytes){
   if(bytes > 1_000_000_000_000){
      return Math.round(bytes / 1_000_000_000) / 1_000.0 + 'TB/s'
   } else if(bytes > 1_000_000_000){
      return Math.round(bytes / 1_000_000) / 1_000.0 + 'GB/s'
   } else if(bytes > 1_000_000){
      return Math.round(bytes / 1_000) / 1_000.0 + 'MB/s'
   } else if(bytes > 1_000){
      return bytes / 1_000.0 + 'KB/s'
   } else {
      return bytes + 'B/s';
   }
}

export function secondsToAdequateMessage(bytes){
    if(bytes > 1_000_000_000){
      return Math.round(bytes / 1_000_000) / 1_000.0 + 's'
   } else if(bytes > 1_000_000){
      return Math.round(bytes / 1_000) / 1_000.0 + 'ms'
   } else if(bytes > 1_000){
      return bytes / 1_000.0 + 'µs'
   } else {
      return bytes + 'ns';
   }
}
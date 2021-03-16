// generic class with limits
export default class Limits {
  constructor(RAM, CPU, disk, upload, download) {
    this.RAM = RAM;
    this.CPU = CPU;
    this.disk = disk;
    this.network.upload = upload;
    this.network.download = download;
  }

  RAM;
  CPU;
  disk;
  network = {
    upload: undefined,
    download: undefined,
  };
}

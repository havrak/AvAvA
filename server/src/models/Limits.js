// generic class with limits
export default class Limits {
  constructor(ram, cpu, disk, upload, download) {
    this.ram = ram;
    this.cpu = cpu;
    this.disk = disk;
    this.network.upload = upload;
    this.network.download = download;
  }

  ram;
  cpu;
  disk;
  network = {
    upload: undefined,
    download: undefined,
  };
}

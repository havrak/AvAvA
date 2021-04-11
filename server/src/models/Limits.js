// generic class with limits
export default class Limits {
  constructor(RAM, CPU, disk, upload, download) {
    this.RAM = RAM;
    this.CPU = CPU;
    this.disk = disk;
    this.internet.upload = upload;
    this.internet.download = download;
  }

  RAM;
  CPU;
  disk;
  internet = {
    upload: undefined,
    download: undefined,
  };
}

/**
 * information about history fo single container
 *
 */
export default class ContainerChangeLimitsJSONObj {
  constructor(ram, cpu, disk, upload, download) {
    this.config["limits.memory"] = ram;
    this.config["limits.cpu.allowance"] = cpu;
    //this.devices.root.size = disk;
    this.devices.eth0["limits.ingress"] = upload;
    this.devices.eth0["limits.egress"] = download;
  }
  config = {
    "limits.memory": undefined,
    "limits.cpu.allowance": undefined,
  };
  devices = {
    root: {
      path: "/",
      pool: "default",
      type: "disk",
      //size: undefined, // as things stand now, lxd has unfixed error, which causes problems with creation if disk size is limited
    },
    eth0: {
      name: "eth0",
      network: "lxdbr0",
      type: "nic",
      "limits.ingress": undefined,
      "limits.egress": undefined,
    },
  };
}

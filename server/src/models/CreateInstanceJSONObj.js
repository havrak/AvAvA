export default class CreateInstanceJSONObj {
  constructor(name, profiles, source, project) {
    this.name = name;
    this.profiles = profiles;
    this.source = source;
    this.project = project;
  }
  name;
  architecture = "x86_64";
  profiles;
  ephemeral = false;
  type = "container";
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
  source;
  project; // will be extracted from object
  appsToInstall; // will be extracted from object
}

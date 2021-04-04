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
  device = {
    root: {
      path: "/",
      pool: "default",
      size: undefined,
      type: "disk",
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
  project;
}

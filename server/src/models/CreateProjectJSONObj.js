export default class CreateProjectJSONObj {
  constructor(name, memory, disk) {
    this.name = name;
    this.config["limits.disk"] = disk;
    this.config["limits.memory"] = memory;
  }
  name;
  config = {
    "features.images": false,
    "features.profiles": false,
    "limits.memory": undefined,
    "limits.disk": undefined,
  };
}

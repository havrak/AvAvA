export default class CreateProjectJSONObj {
  constructor(name, memory, disk) {
    this.name = name;
    if (memory != null && disk != null) {
      this.config["limits.disk"] = disk;
      this.config["limits.memory"] = memory;
    }
  }
  name;
  config = {
    "features.images": "false",
    "features.profiles": "false",
  };
}

export default class CreateProjectJSONObj {
  constructor(name, memory, disk) {
    this.name = name;
    if (memory != null && disk != null) {
      //this.config["limits.disk"] = disk; // just as limit on disk space on instances is broken this too doesn't work and result in strange error
      //this.config["limits.memory"] = memory;
    }
  }
  name;
  config = {
    "features.images": "false",
    "features.profiles": "false",
  };
}

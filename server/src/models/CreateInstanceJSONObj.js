export default class CreateInstanceJSONObj {
  constructor(name, profiles, config, source, project) {
    this.name = name;
    this.profiles = profiles;
    this.config = config;
    this.source = source;
    this.project = project;
  }
  name;
  architecture = "x86_64";
  profiles;
  ephemeral = false;
  type = "container";
  config;
  source;
  project;
}

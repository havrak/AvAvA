export default class Template {
  constructor(id, name, timestamp, image, description, minDiskUsage) {
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.image = image;
    this.description = description;
    this.minDiskUsage = minDiskUsage;
  }
  id;
  name;
  timestamp;
  image;
  description;
  minDiskUsage;
}

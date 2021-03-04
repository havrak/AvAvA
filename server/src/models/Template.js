export default class Template {
  constructor(id, name, timestamp, image, description) {
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.image = image;
    this.description = description;
  }
  id; // corresponds to id
  name; // corresponds to profileName
  timestamp; // corresponds to timestamp
  image;
  description; // corresponds to profileDescription
}

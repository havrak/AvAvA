/**
 * inforamtion about Templates
 *
 */
export default class Template {
  constructor(id, name, createdOn, image, description, minDiskUsage) {
    this.id = id;
    this.name = name;
    this.createdOn = createdOn;
    this.image = image;
    this.description = description;
    this.minDiskUsage = minDiskUsage;
  }
  id;
  name;
  createdOn;
  image; // -> Image.js
  description;
  minDiskUsage;
}

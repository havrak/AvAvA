/**
 * information about single image
 *
 */
export default class Image {
  constructor(os, version, description) {
    this.os = os;
    this.version = version;
    this.description = description;
  }
  os;
  version;
  description;
}

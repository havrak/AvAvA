export default class Template {
  id; // corresponds to id
  name; // corresponds to profileName
  timestamp; // corresponds to timestamp
  image = {
    os: undefined, // corresponds to imageName
    version: undefined, // corresponds to version
    description: undefined, // correspond to imageDescription
  };
  description; // corresponds to profileDescription
}

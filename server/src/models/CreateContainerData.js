export default class CreateContainerData {
  constructor(templateTypes, applicationsToInstall) {
    this.templateTypes = templateTypes;
    this.applicationsToInstall = applicationsToInstall;
  }
  templateTypes; // -> Template.js[]
  applicationsToInstall; // ApplicationsToInstall.js[]
}

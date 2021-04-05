export default class CreateInstanceConfigData {
  constructor(templates, applicationsToInstall) {
    this.templates = templates;
    this.applicationsToInstall = applicationsToInstall;
  }
  templates; // -> Template.js[]
  applicationsToInstall; // ApplicationsToInstall.js[]
}

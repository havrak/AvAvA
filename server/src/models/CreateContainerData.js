export default class CreateContainerData {
  constructor(templateTypes, applicationsToInstall, limits) {
    this.templateTypes = templateTypes;
    this.applicationsToInstall = applicationsToInstall;
    this.limits = limits;
  }
  templateTypes; // -> Template.js[]
  applicationsToInstall; // ApplicationsToInstall.js[]
  maxLimits; // -> Limits.js
}

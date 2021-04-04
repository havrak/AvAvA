export default class CreateInstanceConfigData {
  constructor(templateTypes, applicationsToInstall, limits) {
    this.templateTypes = templateTypes;
    this.applicationsToInstall = applicationsToInstall;
    this.maxLimits = limits;
  }
  templateTypes; // -> Template.js[]
  applicationsToInstall; // ApplicationsToInstall.js[]
  maxLimits; // -> Limits.js, needs to check whether project has some limits defined.
}

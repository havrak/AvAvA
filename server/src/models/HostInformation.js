export default class HostInformation {
  constructor(model, frequency) {
    this.CPU.model = model;
    this.CPU.frequency = frequency;
  }

  CPU = {
    model,
    frequency,
  };
}

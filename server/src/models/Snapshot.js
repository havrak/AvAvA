export default class Snapshot {
	constructor(name, createdOn, stateful) {
		this.name = name;
		this.createdOn = createdOn;
		this.stateful = stateful;
	}

	name;
	createdOn;
	stateful;
}

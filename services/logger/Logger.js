class Logger {
	enabled;

	constructor(_enabled) {
		this.enabled = _enabled;
	}

	log(data) {
		console.log(data);
		const { id, message } = data;

		if (this.enabled) {
			console.log(`id: ${id}, message: ${message}`);
		}
	}

}

export default Logger;

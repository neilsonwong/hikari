function Program(program, date, time, location, taskList){
	this.program = program;
	this.date = date;
	this.time = time;
	this.location = location;
	this.responsibilities = taskList;
}

module.exports = Program;


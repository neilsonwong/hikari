var programDataDir = './data/programs/';

function Program(program, date, time, location, taskList){
	if (program){
		//if empty return empty program Obj
		this.id = Date.now();
		this.program = program;
		this.date = date;
		this.time = time;
		this.location = location;
		this.responsibilities = taskList;
		this.save();
	}
}

Program.prototype.save = function(){
	Program.list[this.id] = this;
	fs.writeFileSync(programDataDir + this.id + '.json', JSON.stringify(this), 'utf8');
};

Program.get = function(programId){
	if (Program.list[programId]) {
        return instance(Program.list[programId]);
    }
    else {
        try {
            var program = JSON.parse(fs.readFileSync(programDataDir + programId + '.json', 'utf8'));
            Program.list[programId] = program;
            return instance(program);
        }
        catch (e) {
            console.log(e);
        }
        return false;
    }
};

function instance(program){
	var prog = new Program();
	prog.id = program.id;
	prog.program = program.program;
	prog.date = program.date;
	prog.time = program.time;
	prog.location = program.location;
	prog.responsibilities = program.responsibilities;
	return prog;
}

Program.list = {};

module.exports = Program;


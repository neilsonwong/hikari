function TaskList(lead, devo, timeKeeper, skype){
	this.lead = lead;
	this.devo = devo;
	this.timeKeeper = timeKeeper;
	this.skype = skype;
}

TaskList.list = [
	'Program Lead', 
	'Devotion',
	'Time Keeper',
	'Skype'
];

module.exports = TaskList;
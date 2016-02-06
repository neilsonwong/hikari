var fs = require('fs');
var webroot = './web/'

exports.inject = function(htmlFile, objs){
	//we will make a script tag right before the body tag to inject vars
	var needle = '</body>';
	var scriptString = '<script id="transplant">';
	var htmlString = fs.readFileSync(webroot + htmlFile, 'utf8');
	var keys = Object.keys(objs);
	var i;
	for (i = 0; i < keys.length; ++i){
		scriptString += 'var '+ keys[i] + ' = ' + JSON.stringify(objs[keys[i]]) + ';\n';
	}
	scriptString += '</script></body>';

	return htmlString.replace(needle, scriptString);
}
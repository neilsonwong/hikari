var fs = require('fs');
var minify = require('html-minifier').minify;
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

exports.forcedInject = function(htmlFile, objs){
	//inject html to replace html templating which is valid html
	var htmlString = minify(fs.readFileSync(webroot + htmlFile, 'utf8'), { collapseWhitespace: true });
	var keys = Object.keys(objs);
	var i, needle, replacement;
	for (i = 0; i < keys.length; ++i){
		needle = keys[i];
		replacement = objs[keys[i]].html();
		htmlString = htmlString.replace(needle, replacement);
		// console.log("needle: " + needle);
		// console.log("replacement : " + replacement);
	}
	return htmlString;
}
var linebreak = '<div style="font-size:12.8px"><br></div>';

exports.linebreak = linebreak;

exports.makeLine = function(text, fontSize){
	switch(fontSize){
		case 'small':
			fontSize = '10';
			break;
		case 'big':
			fontSize = '14';
			break;
		default:
			fontSize = '12.8';
	}
	return '<div style="font-size:' + fontSize + 'px">' + text + '</div>';
}

exports.wrap = function(email){
	return '<div dir="ltr">'+email+'</div>';
}

exports.bold = function(text){
    return '<span style="font-weight:bold">' + text + '</span>';
}

exports.italic = function(text){
    return '<span style="font-style:italic">' + text + '</span>';
}
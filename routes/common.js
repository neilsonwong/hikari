var siteRoot = {
    root: __dirname
};

exports.oops = function(res) {
    res.status(404).sendFile('web/lost.html', siteRoot);
};

exports.nope = function(req, res) {
    res.redirect('/welcome');
};

exports.SITEROOT = siteRoot;
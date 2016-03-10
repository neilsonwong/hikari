var siteRoot = {
    root: __dirname+'/..'
};

exports.notFound = function(res) {
    return res.status(404).sendFile('web/lost.html', siteRoot);
};

exports.goToWelcome= function(req, res) {
    return res.redirect('/welcome');
};

exports.SITEROOT = siteRoot;
/*
 * GET home page.
 */
var version = require('../version');
exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  req.session.name = req.param.name || 'abc';

  if (!req.cookies.key) {
    var key = Math.round(Math.random() * 1e64).toString(36);
    res.cookie('key', key, {
      expires: new Date(2030, 4, 1)
    });
  }
  console.log(req.cookies['key']);
  res.render('index', {
    title: 'ヒーロージェネレータ',
    version: version[version.length - 1][0]
  });
};
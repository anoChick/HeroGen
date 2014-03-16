// GET     /                 ->  index
// GET     /new              ->  new
// POST    /                 ->  create
// GET     /:id              ->  show
// GET     /:id/edit         ->  edit
// PUT     /:id              ->  update
// DELETE  /:id              ->  destroy
var sqlStr = "SELECT TOP 100 r1.HeroID, r1.Name, r1.Chick, (SELECT count(r2.Chick) FROM Ranking as r2 WHERE r2.Chick>r1.Chick)+1 as rank FROM Ranking as r1 ORDER BY r1.Chick DESC ";

var hg = require('../herogen');
var sql = require('node-sqlserver');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";


exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  var page = (+req.query.page) || 0;
  if (page >= 10) page = 0;
  if (page < 0) page = 0;

  sql.query(conn_str, sqlStr, function(err, results) {
    if (err) res.send('なんかエラーでた。');
    res.render('ranking', {
      data: results,
      page: page
    });

  });



};
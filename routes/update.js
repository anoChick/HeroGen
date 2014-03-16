// GET     /                 ->  index
// GET     /new              ->  new
// POST    /                 ->  create
// GET     /:id              ->  show
// GET     /:id/edit         ->  edit
// PUT     /:id              ->  update
// DELETE  /:id              ->  destroy
var version = require('../version');
var hg = require('../herogen');
var sql = require('node-sqlserver');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";


exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  sql.query(conn_str, "SELECT * FROM Hero WHERE HeroID = '" + req.query.heroID + "'", function(err, results) {
    if (( !! err) || (results || {}).length == 0) {
      res.send('new id');
    }
    var heroData = {};
    res.render('update',{version:version});

  });



};


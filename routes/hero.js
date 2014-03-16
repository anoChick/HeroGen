// GET     /                 ->  index
// GET     /new              ->  new
// POST    /                 ->  create
// GET     /:id              ->  show
// GET     /:id/edit         ->  edit
// PUT     /:id              ->  update
// DELETE  /:id              ->  destroy


var hg = require('../herogen');
var sql = require('node-sqlserver');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";

var getUnixTime = function() {
  return new Date / 1000 | 0;
}
var columnName = ['AccessKey', 'Name', 'Title', 'Class', 'Head', 'Body', 'Arm', 'Shoe', 'RHand', 'LHand', 'Accessory1', 'Accessory2', 'Accessory3', 'TwitterID', 'HeroID', 'Ticket', 'Gold', 'LastAttackTime'];
var columnKey = ['key', 'name', 'title', 'class', 'head', 'body', 'arm', 'shoe', 'rHand', 'lHand', 'acce1', 'acce2', 'acce3', 'twitterID', 'heroID', 'ticket', 'gold', 'lastAttackTime'];
var columnType = ['', 'str', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'str', 'str', 'int', 'int', 'int'];

var data = require('../data');
var getHero = function(id) {
  return users[id] || null;

};

var itemType = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce', 'acce', 'acce'];


exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  sql.query(conn_str, "SELECT * FROM Hero WHERE HeroID = " + " '" + req.query.heroID + "'", function(err, results) {
    if (results.length) {
      var heroData = {};
      var heroData = hg.createHeroData(results[0]);
      heroData.key = undefined;
      res.json({
        result: {
          heroData: heroData
        },
        error: null
      });
    } else {
      res.json({
        result: null,
        error: {
          message: 'なんかエラーでた'
        }
      });
    }


  });



};

exports.show = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  var key = req.params.key;
  sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = " + " '" + req.params.key + "'", function(err, results) {
    if (results.length) {
      var heroData = hg.createHeroData(results[0]);
      res.json({
        result: {
          heroData: heroData
        },
        error: null
      });
    } else {
      var queryStr = "INSERT INTO Hero (AccessKey,Name,Title,Class,Head,Body,Arm,Shoe,RHand,LHand,Accessory1,Accessory2,Accessory3,TwitterID,HeroID,Ticket,Gold,LastAttackTime)" +
        "VALUES ('" + key + "',N'名無し',0,0,0,0,0,0,0,0,0,0,0,'','" + key.slice(0, 16) + "',300,0,0);";
      sql.query(conn_str, queryStr, function(err, results) {
        var queryStr = "INSERT INTO Ranking (HeroID,Chick,Name) VALUES ('" + key.slice(0, 16) + "',0,N'名無し');";
        sql.query(conn_str, queryStr, function(err, results) {});
        if (err) {
          res.json({
            result: null,
            error: {
              message: 'なんかエラーでた'
            }
          });
        } else {
          sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = " + " '" + req.params.key + "'", function(err, results) {
            if (results.length) {
              var heroData = {};
              var heroData = hg.createHeroData(results[0]);
              res.json({
                result: {
                  heroData: heroData
                },
                error: null
              });
            } else {
              res.json({
                result: null,
                error: {
                  message: 'なんかエラーでた'
                }
              });
            }
          });
        }
      });
    }
  });
}
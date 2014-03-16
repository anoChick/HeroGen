var sql = require('node-sqlserver');
var hg = require('../herogen');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";
var columnName = ['AccessKey', 'Name', 'Title', 'Class', 'Head', 'Body', 'Arm', 'Shoe', 'RHand', 'LHand', 'Accessory1', 'Accessory2', 'Accessory3', 'TwitterID', 'HeroID', 'Ticket', 'Gold', 'LastAttackTime'];
var columnKey = ['key', 'name', 'title', 'class', 'head', 'body', 'arm', 'shoe', 'rHand', 'lHand', 'acce1', 'acce2', 'acce3', 'twitterID', 'heroID', 'ticket', 'gold', 'lastAttackTime'];
var columnType = ['', 'str', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'str', 'str', 'int', 'int', 'int'];
var itemType = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce', 'acce', 'acce'];

var UPGRADE_MESSAGE = ['大失敗・・・(強化値-2)', '失敗。(強化値-1)', '失敗。(強化値±0)', '成功！(強化値+1)', '大成功！(強化値+2)'];
var UPGRADE_COLOR = ['#A00', '#E00', '#548', '#2b2', '#dc0'];
var upgrade = function(value) {
  var result = {}
  var rand = Math.random();

  if (rand > (0.5) + Math.floor(value / 20) * 0.1) {
    result.plus = 1;
    result.message = UPGRADE_MESSAGE[3];
    result.color = UPGRADE_COLOR[3];
  } else if (rand > 0.15) {
    result.plus = 0
    result.message = UPGRADE_MESSAGE[2];
    result.color = UPGRADE_COLOR[2];
  } else {
    result.plus = -1
    result.message = UPGRADE_MESSAGE[1];
    result.color = UPGRADE_COLOR[1];
  }
  result.value = value + result.plus;
  if (result.value >= 100) result.value = 99;
  if (result.value < 0) result.value = 0;
  return result;
};


exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  var key = req.query.key;
  var type = req.query.type;
  sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = " + " '" + key + "'", function(err, results) {
    //if (err) res.send('err');
    var column = '';
    if (results.length) {
      var record = results[0];

      var data = {};
      for (var i = 0; i < columnName.length; i++) {
        data[columnKey[i]] = results[0][columnName[i]];
        if (columnKey[i] == type) {
          column = columnName[i];
        }
      }
      if (record.Ticket < 5) {
        res.json({
          result: null,
          error: {
            message: 'チケットが足りない(5枚必要)'
          }
        });
        return;

      }
      record.Ticket-=5;
      var upgradeResult = upgrade(+("00000000" + data[type]).slice(-8).slice(0, 2));
      var newData = ("00" + upgradeResult.value).slice(-2) + ("00000000" + data[type]).slice(-8).slice(2, 8);

      sql.query(conn_str, "UPDATE Hero SET " + column + "=" + newData + ", Ticket=" + record.Ticket + " WHERE AccessKey='" + key + "';", function(err, results) {
        if (err) res.json({
          result: null,
          error: {
            message: 'なんかエラー出た。'
          }
        });
        record[column] = +newData;
        var hData = hg.createHeroData(record);
        //createHeroData
        res.json({
          result: {
            heroData: hData,
            upgrade: upgradeResult
          },
          error: null
        })
      });

    } else {
      res.json({
        result: null,
        error: {
          message: 'データが無い'
        }
      });
    }
  });


};
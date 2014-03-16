var sql = require('node-sqlserver');
var hg = require('../herogen');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";
var columnName = ['AccessKey', 'Name', 'Title', 'Class', 'Head', 'Body', 'Arm', 'Shoe', 'RHand', 'LHand', 'Accessory1', 'Accessory2', 'Accessory3', 'TwitterID', 'HeroID', 'Ticket', 'Gold', 'LastAttackTime'];
var columnKey = ['key', 'name', 'title', 'class', 'head', 'body', 'arm', 'shoe', 'rHand', 'lHand', 'acce1', 'acce2', 'acce3', 'twitterID', 'heroID', 'ticket', 'gold', 'lastAttackTime'];
var columnType = ['', 'str', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'str', 'str', 'int', 'int', 'int'];
var itemType = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce', 'acce', 'acce'];



exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  var key = req.query.key;
  var type = req.query.type;
  sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = " + " '" + key + "'", function(err, results) {
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

      if (record.Ticket < 1) {
        res.json({
          result: null,
          error: {
            message: 'チケットが足りない(1枚必要)'
          }
        });
        return;
      }
      record.Ticket -= 1;
      var newData = hg.randomItemValue(type);

      record[column] = +newData;
      sql.query(conn_str, "UPDATE Hero SET " + column + "=" + newData + ", Ticket=" + record.Ticket + " WHERE AccessKey='" + key + "';", function(err, results) {
        if (err) res.json({
          result: null,
          error: {
            message: 'なんかエラー出た。'
          }
        });
        var hData = hg.createHeroData(record);
        res.json({
          result: {
            heroData: hData,
            message: "[" + hData[type].str + "]を獲得した。",
            itemData: hData[type]
          },
          error: null
        });

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

exports.new = function(req, res) {
  res.send({
    a: 'ac'
  });
};

exports.create = function(req, res) {
  res.send({
    a: 'av'
  });
};

exports.show = function(req, res) {
  res.send({
    a: 'aa'
  });
};

exports.edit = function(req, res) {
  res.send({
    a: 'a'
  });
};

exports.update = function(req, res) {
  res.send({
    a: 'aq'
  });
};

exports.destroy = function(req, res) {
  res.send({
    a: 'azv'
  });
};
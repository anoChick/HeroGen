var sql = require('node-sqlserver');
var hg = require('../herogen');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";



exports.index = function(req, res) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '-1');
  var key = req.query.key;
  var name = req.query.name;
  var record;

  sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = " + " '" + key + "'", function(err, results) {
    if (results.length) {
      record = results[0];
      if (record.Ticket < 10) {
        res.json({
          result: null,
          error: {
            message: 'チケットが足りない(10枚必要)'
          }
        });
        return;
      }
      record.Ticket -= 10;

      sql.query(conn_str, "UPDATE Hero SET Name= N'" + name + "', Ticket=" + record.Ticket + " WHERE AccessKey='" + key + "';", function(err, results) {
        if (err) res.json({
          result: null,
          error: {
            message: 'なんかエラー出た。'
          }
        });

        record['Name'] = name;
        var hData = hg.createHeroData(record);
        res.json({
          result: {
            heroData: hData,
            message: '名前を変えた。'
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
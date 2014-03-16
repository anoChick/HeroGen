var sql = require('node-sqlserver');
var hg = require('../herogen');
var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";
var columnName = ['AccessKey', 'Name', 'Title', 'Class', 'Head', 'Body', 'Arm', 'Shoe', 'RHand', 'LHand', 'Accessory1', 'Accessory2', 'Accessory3', 'TwitterID', 'HeroID', 'Ticket', 'Gold', 'LastAttackTime'];
var columnKey = ['key', 'name', 'title', 'class', 'head', 'body', 'arm', 'shoe', 'rHand', 'lHand', 'acce1', 'acce2', 'acce3', 'twitterID', 'heroID', 'ticket', 'gold', 'lastAttackTime'];
var columnType = ['', 'str', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'str', 'str', 'int', 'int', 'int'];
var itemType = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce', 'acce', 'acce'];



exports.index = function(req, res) {
  res.header('Cache-Control','no-store, no-cache, must-revalidate');
  res.header('Pragma','no-cache');
  res.header('Expires','-1');
  var key = req.query.key;
  var type = req.query.type;
  sql.query(conn_str, "SELECT * FROM Hero WHERE AccessKey = '" + key + "'", function(err, results) {
    var column = '';
    if (results.length) {
      var record = results[0];
      if (record.Ticket < 20) {
        res.json({result:null,error:{message:'チケットが足りない(20枚必要)'}});
        return;
      }
      var hData = hg.createHeroData(record);
      var kill = hg.killChick(hData);

      sql.query(conn_str, "UPDATE Ranking SET Name=N'" +hData.title.str+hData.class.str+hData.name.str + "',Chick=Chick+" + kill + " WHERE HeroID = '" + hData.heroID.str + "';", function(err, results) {
        sql.query(conn_str, "UPDATE Hero SET Ticket=Ticket-20 WHERE AccessKey= '" + key + "'", function(err, results) {});
        hData.ticket.val -= 20;
        res.json({result:{
          heroData: hData,
          kill: kill
        },error:null});
      });


    } else {

      res.json({result:null,error:{message:'データが無い'}});
    }
  });


};


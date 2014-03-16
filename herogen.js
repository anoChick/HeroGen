//var 
module.exports = function() {
  var sql = require('node-sqlserver');
  var conn_str = "Driver={SQL Server Native Client 10.0};Server=tcp:neak1uzj9w.database.windows.net,1433;Database=herogen_db;Uid=herogenDB@neak1uzj9w;Pwd=hiyoko3kawaE;Encrypt=yes;Connection Timeout=30;";
  var columnName = ['AccessKey', 'Name', 'Title', 'Class', 'Head', 'Body', 'Arm', 'Shoe', 'RHand', 'LHand', 'Accessory1', 'Accessory2', 'Accessory3', 'TwitterID', 'HeroID', 'Ticket', 'Gold', 'LastAttackTime'];
  var columnKey = ['key', 'name', 'title', 'class', 'head', 'body', 'arm', 'shoe', 'rHand', 'lHand', 'acce1', 'acce2', 'acce3', 'twitterID', 'heroID', 'ticket', 'gold', 'lastAttackTime'];
  var columnType = ['', 'str', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'int', 'str', 'str', 'int', 'int', 'int'];
  var itemType = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce', 'acce', 'acce'];
  var equip = ['head', 'arm', 'rHand', 'lHand', 'body', 'shoe', 'acce1', 'acce2', 'acce3', 'class', 'title'];
  var data = require('./data');
  var herogen = {
    killChick: function(heroData) {
      var chick = 1;
      for (key in heroData.param.z) {
        chick += heroData.param.z[key];
      }
      chick = Math.floor(chick * (0.95 + (Math.random() / 10)))
      return chick;
    },
    statusCalculation: function(heroData) {
      var param = {
        a: {
          str: 1,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        },
        c: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        },
        z: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        }
      };
      for (var i = 0; i < equip.length; i++) {
        for (var p in param.a) {
          param.a[p] += heroData[equip[i]].param.a[p];
          param.c[p] += heroData[equip[i]].param.c[p];
          //heroData[key]
        }
      }
      //計算
      var str = param.a.str * (1 + param.c.str);
      var vit = param.a.vit * (1 + param.c.vit);
      var agi = param.a.agi * (1 + param.c.agi);
      var dex = param.a.dex * (1 + param.c.dex);
      var int = param.a.int * (1 + param.c.int);
      var men = param.a.men * (1 + param.c.men);
      if (str < 0) str = 0;
      if (vit < 0) vit = 0;
      if (agi < 0) agi = 0;
      if (dex < 0) dex = 0;
      if (int < 0) int = 0;
      if (men < 0) men = 0;
      param.z.str = Math.floor(str);
      param.z.vit = Math.floor(vit);
      param.z.agi = Math.floor(agi);
      param.z.int = Math.floor(int);
      param.z.dex = Math.floor(dex);
      param.z.men = Math.floor(men);

      param.z.atk = Math.floor((param.a.atk + str * 3 + Math.pow(int, 1.1) + dex * 1) * (1 + param.c.atk));
      param.z.def = Math.floor((param.a.def + vit * 3 + men * 2 + dex * 1) * (1 + param.c.def));
      param.z.hp = Math.floor((param.a.hp + vit * 5 + dex + str * 2) * (1 + param.c.hp));
      param.z.mp = Math.floor((param.a.mp + men * 5 + dex + int * 2) * (1 + param.c.mp));
      param.z.spd = Math.floor((param.a.spd + agi * 5 + dex * 1) * (1 + param.c.spd));
      param.z.avo = Math.floor((param.a.avo + agi * 3 + dex * 2) * (1 + param.c.avo));
      param.z.cri = Math.floor((param.a.cri + dex * 2 + agi) * (1 + param.c.cri));
      if (param.z.atk < 0) param.z.atk = 1;
      if (param.z.def < 0) param.z.def = 1;
      if (param.z.hp < 0) param.z.hp = 1;
      if (param.z.mp < 0) param.z.mp = 1;
      if (param.z.spd < 0) param.z.spd = 1;
      if (param.z.avo < 0) param.z.avo = 1;
      if (param.z.cri < 0) param.z.cri = 1;

      heroData.param = param;
      return heroData;
    },
    ticketHandOut: function() {
      sql.query(conn_str, "UPDATE Hero SET Ticket=Ticket+1 WHERE Ticket <1000", function(err, results) {});
    },
    randomProfValue: function(type) {
      if (type == 'class')
        return Math.floor(Math.random() * data.CLASS.length);
      if (type == 'title')
        return Math.floor(Math.random() * data.TITLE.length);
      return null;
    },
    getItemListForRare: function(rare, type) {
      var itemValues = [];
      if (type == 'TITLE1' || type == 'TITLE2') {
        for (var i = 0; i < data[type].length; i++) {
          if (data[type][i].param.rare == rare) {
            itemValues.push(i);
          }
        }
      } else {
        for (var i = 0; i < data.ITEM[type].length; i++) {
          if (data.ITEM[type][i].param.rare == rare) {
            itemValues.push(i);
          }
        }
      }
      if (!itemValues.length) return 0;
      return itemValues[Math.floor(Math.random() * itemValues.length)];

      return 0;
    },
    randomItemValue: function(type) {
      if (type == 'acce1' || type == 'acce2' || type == 'acce3') type = 'acce';
      var upgradeVal = Math.floor(Math.random() * 10);
      //アイテムの確率 5:0.0003 4:0.003 3:0.08 2:0.25 1 それいがい
      var rare;
      if (Math.random() <= 0.0003) {
        rare = 5;
      } else if (Math.random() <= 0.003) {
        rare = 4;
      } else if (Math.random() <= 0.08) {
        rare = 3;
      } else if (Math.random() <= 0.25) {
        rare = 2;
      } else {
        rare = 1;
      }



      //タイトルの確率 3:0.05 2:0.15  0.3  0.5 
      var itemVal = this.getItemListForRare(rare, type);



      if (Math.random() <= 0.05) {
        rare = 3;
      } else if (Math.random() <= 0.015) {
        rare = 2;
      } else if (Math.random() <= 0.5) {
        rare = 1;
      } else {
        rare = 0;
      }
      var title1Val = this.getItemListForRare(rare, 'TITLE1');

      if (rare == 0) title1Val = 0;


      if (Math.random() <= 0.05) {
        rare = 3;
      } else if (Math.random() <= 0.015) {
        rare = 2;
      } else if (Math.random() <= 0.4) {
        rare = 1;
      } else {
        rare = 0;
      }
      var title2Val = this.getItemListForRare(rare, 'TITLE2');
      if (rare == 0) title2Val = 0;
      return ("0" + upgradeVal).slice(-2) + ("0" + title1Val).slice(-2) + ("0" + title2Val).slice(-2) + ("0" + itemVal).slice(-2);
    },

    //データベースレコードからheroData:{}を生成する
    createHeroData: function(record) {
      if (record) {
        var heroData = {
          record: record
        };
        for (var i = 0; i < columnName.length; i++) {
          switch (columnType[i]) {
            case '':
              heroData[columnKey[i]] = record[columnName[i]];
              break;
            case 'int':
              heroData[columnKey[i]] = {
                val: record[columnName[i]]
              };
              break;
            case 'str':
              heroData[columnKey[i]] = {
                str: record[columnName[i]]
              };
              break;
          }

        }
        for (var i = 0; i < itemType.length; i++) {
          var type = itemType[i] + ((itemType[i] == 'acce') ? i - 5 : '');
          heroData[type] = this.createItemData(itemType[i], heroData[type].val);
        }


        heroData['title'] = this.createProfData('title', heroData['title'].val);
        heroData['class'] = this.createProfData('class', heroData['class'].val);

        heroData = this.statusCalculation(heroData);

        return heroData;
      }
    },

    createItemData: function(type, d) {

      d = ("00000000" + d).slice(-8);
      var itemData = {
        type: type,
        val: d
      };
      itemData.upgradeVal = +d.slice(0, 2);
      itemData.upgradeStr = '+' + itemData.upgradeVal;
      itemData.title1Val = +d.slice(2, 4);
      itemData.title1 = data.TITLE1[itemData.title1Val || 0];
      itemData.title2Val = +d.slice(4, 6);
      itemData.title2 = data.TITLE2[itemData.title2Val || 0];
      itemData.itemVal = +d.slice(6, 8);
      itemData.item = data.ITEM[type][itemData.itemVal || 0];

      //アイテム
      var param = {
        a: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        },
        c: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        }
      };
      for (var key in param.a) {
        var itemP = itemData.item.param[key].split(',');
        var title1P = itemData.title1.param[key].split(',');
        var title2P = itemData.title2.param[key].split(',');
        param.a[key] = (+itemP[0] + (+title1P[0]) + (+title2P[0])) * (1 + (Math.pow(itemData.upgradeVal, 2.5) / 1000));
        param.c[key] = (+itemP[1] + (+title1P[1]) + (+title2P[1])) * (1 + (itemData.upgradeVal / 100));
        //param.a[key]=((itemData.item.param[key]||0)+(itemData.title1.param[key]||0)+(itemData.title2.param[key]||0))*(itemData.upgradeVal||0)*0.05;
      }
      itemData.param = param;
      itemData.str = itemData.title1.str + "" + itemData.title2.str + "" + itemData.item.str + "" + ((!itemData.upgradeVal) ? "" : itemData.upgradeStr);
      return itemData;
    },
    createProfData: function(type, d) {
      var a = {
        title: "TITLE",
        class: "CLASS"
      };

      var pStr = data[a[type]][+d].param;

      //アイテム
      var param = {
        a: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        },
        c: {
          str: 0,
          vit: 0,
          agi: 0,
          dex: 0,
          int: 0,
          men: 0,
          atk: 0,
          def: 0,
          hp: 0,
          mp: 0,
          spd: 0,
          avo: 0,
          cri: 0
        }
      };

      for (var key in param.a) {
        var titleP = data[a[type]][+d].param[key].split(',');
        param.a[key] = +titleP[0];
        param.c[key] = +titleP[1];
      }

      return {
        val: +d,
        str: data[a[type]][+d].str,
        param: param
      };

    }
  }

  return herogen;
}();
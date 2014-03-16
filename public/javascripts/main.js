$(function() {

  var herogen = {
    chickRecord: null,
    key: null,
    itemView: function() {
      return function() {
        var part = $(this).attr('part');
        iData = hero.data[part];
        console.log(iData.item.param.rare);
        $('.itemUpgrade').html(iData.upgradeStr);
        $('.itemName').html($('<span>', {
          class: 'rare' + iData.item.param.rare
        }).html(iData.item.str));
        $('.itemTitle').html(iData.title1.str + " " + iData.title2.str);
        $('.itemLeft').html('');
        $('.itemRight').html('');
        if (part == 'lHand' || part == 'rHand') {
          var wType = iData.item.param.type;
          var str = '武器タイプ:';
          var tStr = {
            hammer: "鈍器",
            axe: '斧',
            lod: '杖',
            katana: '刀',
            knife: 'ナイフ',
            shield: "盾",
            gun: '銃',
            spear: '槍',
            knuckle: '拳',
            sword: '剣',
          };
          $('.itemLeft').append($('<p>').addClass('weapontype').html(str + tStr[wType]));
        }
        var p = ['atk', 'def', 'spd', 'avo', 'cri', 'hp', 'mp', 'str', 'vit', 'agi', 'dex', 'int', 'men'];
        var s = ['攻撃力', '防御力', '攻撃速度', '回避', 'クリティカル', 'HP', 'MP', 'STR', 'VIT', 'AGI', 'DEX', 'INT', 'MEN'];
        for (var i = 0; i < p.length; i++) {
          var val = Math.floor(iData.param.a[p[i]]);
          if (val != 0) {
            var e = $('<p>').append(s[i]);
            $('.itemLeft').append(e);
            if (val < 0)
              e.append($('<span>', {
                class: 'st-down'
              }).html(val));
            else
              e.append($('<span>', {
                class: 'st-up'
              }).html('+' + val));
          }
          var cro = Math.floor(iData.param.c[p[i]] * 100);
          if (cro != 0) {
            var e = $('<p>').append(s[i]);
            $('.itemRight').append(e);
            if (cro < 0)
              e.append($('<span>', {
                class: 'st-down'
              }).html(cro + "%"));
            else
              e.append($('<span>', {
                class: 'st-up'
              }).html(('+' + cro) + "%"));
          }
        }
      }
    },
    tweet: function() {
      if (!hero.data) return;
      var msg = ""
      var url = 'http://hgen.anck.in/view?heroID=' + hero.data.heroID.str;
      msg += hero.data.title.str + hero.data['class'].str + hero.data.name.str;
      if (herogen.chickRecord) {
        msg += 'の強さはひよこ' + herogen.chickRecord + '匹に相当する。'
      } else {
        msg += 'は博愛主義者なのでひよこを殺さない。'
      }
      msg += '必殺技は';
      if (Math.random() < 0.5) {
        msg += '[' + hero.data.lHand.item.param.ex + ']';
      } else {
        msg += '[' + hero.data.rHand.item.param.ex + ']';
      }
      msg = encodeURIComponent(msg);
      var f = 'https://twitter.com/intent/tweet?hashtags=herogen&original_referer=http://hgen.anck.in&text=' + msg + '&url=' + url;
      if (!window.open(f, 'tweet')) location.href = f;
    },
    upgrade: function(key) {
      return function() {
        var btn = $(this);
        var type = $(this).attr('id').replace('upgrade', '');
        $.get("/upgrade", {
          key: key,
          type: type
        }).done(function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            hero.setData(data.result.heroData);
            herogen.itemView().apply(btn);
            herogen.pushMessageLog(data.result.upgrade.message, data.result.upgrade.color);
          }
        });
      }
    },
    buy: function(key) {
      return function() {
        var btn = $(this);
        var type = $(this).attr('id').replace('buy', '');
        $.get("/buy", {
          key: key,
          type: type
        }).done(function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            hero.setData(data.result.heroData);
            herogen.itemView().apply(btn);
            herogen.pushMessageLog(data.result.message, data.result.message.color);
          }
        });
      }
    },
    attack: function(key) {
      return function() {
        $.get("/attack", {
          key: key
        }).done(function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            hero.setData(data.result.heroData);
            herogen.pushMessageLog('ひよこを' + data.result.kill + '匹倒した！', '#a00');
            herogen.chickRecord = data.result.kill;
          }
        });
      }
    },
    change: function(key, type) {
      return function() {

        $.get("/change", {
          key: key,
          type: type
        }).done(function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            hero.setData(data.result.heroData);
            herogen.pushMessageLog(data.result.message, '#444');
          }
        });
      }
    },
    rename: function(key) {
      return function() {
        var name = prompt('新しい名前は？', '');
        $.get("/rename", {
          key: key,
          name: name
        }).done(function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            hero.setData(data.result.heroData);
            herogen.pushMessageLog(data.result.message, '#444');
          }
        });
      }
    },
    start: function() {
      this.key = document.cookie.substring(document.cookie.indexOf('key=') + 'key='.length).split(';')[0];
      $('.btn.upgrade').on('click', this.upgrade(this.key));
      $('.btn.buy').on('click', this.buy(this.key));
      $('.btn.name').on('click', this.rename(this.key));
      $('.btn.class').on('click', this.change(this.key, 'class'));
      $('.btn.title').on('click', this.change(this.key, 'title'));
      $('#attackButton').on('click', this.attack(this.key));
      $('.equip .hLine').on('mouseover', this.itemView());
      $('#tweetButton').on('click', this.tweet);
      setInterval(function() {
        $('#loadLayer span').fadeOut(1000, function() {
          $(this).fadeIn(1000)
        });
      }, 2000);
      var piyo = this.loadDataAll(this.key);
      piyo();
      setInterval(piyo, 1000 * 10);
    },
    loadDataAll: function(key) {
      return function() {
        $.get("/hero/" + key, function(data) {
          if (data.error) {
            herogen.pushMessageLog(data.error.message, '#c00');
          } else {
            if (hero.setData(data.result.heroData)) {
              $('#loadLayer').hide();
            }
          }
        });
      }
    },
    pushMessageLog: function(str, color) {
      $('#messageLog').prepend($('<div>', {
        'class': 'messageLine'
      }).append($('<p>').html(str).css('color', color)));
    }
  };
  var hero = {
    setData: function(data) {
      this.data = data;
      for (var key in data) {
                          $('#' + key + 'P').html('');

        if (data[key].item) {
        console.log(data[key]);
        $('#' + key + 'P').append($('<span>',{class:'rare'+data[key].title1.param.rare}).html(data[key].title1.str));
                $('#' + key + 'P').append($('<span>',{class:'rare'+data[key].title2.param.rare}).html(data[key].title2.str));
                  $('#' + key + 'P').append($('<span>',{class:'rare'+data[key].item.param.rare}).html(data[key].item.str));
                  $('#' + key + 'P').append($('<span>',{class:'rare'+(1+Math.floor(data[key].upgradeStr/20)) }).html(data[key].upgradeStr));
        } else {

          $('#' + key + 'P').html((data[key] || {}).str || (data[key] || {}).val);
        }
      }
      for (var key in data.param.z) {
        $('#' + key + 'P').html(data.param.z[key]);
      }
      $('#ticketBar').css('width', ((data['ticket'] || {}).val / 10) + "%");
      return data;
    },
    data: {}
  };
  herogen.start();
});
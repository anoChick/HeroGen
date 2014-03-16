function get_url_vars() {
  var vars = new Object,
    params;
  var temp_params = window.location.search.substring(1).split('&');
  for (var i = 0; i < temp_params.length; i++) {
    params = temp_params[i].split('=');
    vars[params[0]] = params[1];
  }
  return vars;
}
$(function() {
  var hero = {
    setData: function(data) {
      this.data = data;
      for (var key in data) {
        $('#' + key + 'P').html('');
        if (data[key].item) {
          $('#' + key + 'P').append($('<span>', {
            class: 'rare' + data[key].title1.param.rare
          }).html(data[key].title1.str));
          $('#' + key + 'P').append($('<span>', {
            class: 'rare' + data[key].title2.param.rare
          }).html(data[key].title2.str));
          $('#' + key + 'P').append($('<span>', {
            class: 'rare' + data[key].item.param.rare
          }).html(data[key].item.str));
          $('#' + key + 'P').append($('<span>', {
            class: 'rare' + (1 + Math.floor(data[key].upgradeStr / 20))
          }).html(data[key].upgradeStr));
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
  var itemView = function() {
    return function() {
      var part = $(this).attr('part');
      iData = hero.data[part];
        $('.itemUpgrade').html($('<span>', {
          class: 'rare' + (1+Math.floor(iData.upgradeVal/20))
        }).html(iData.upgradeStr));
        $('.itemName').html($('<span>', {
          class: 'rare' + iData.item.param.rare
        }).html(iData.item.str));
        $('.itemTitle').html('');
        $('.itemTitle').append($('<span>',{class:'rare'+iData.title1.param.rare}).html(iData.title1.str));
        $('.itemTitle').append($('<span>',{class:'rare'+iData.title2.param.rare}).html(iData.title2.str));
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
            knife:'ナイフ',
            shield: "盾",
            gun: '銃',
            spear: '槍',
            knuckle: '拳',
            sword:'剣',
        };
        $('.itemLeft').append($('<p>').addClass('weapontype').html(str + tStr[wType]));
      }
      var p = ['atk', 'def', 'spd', 'avo', 'cri', 'hp', 'mp', 'str', 'vit', 'agi', 'dex', 'int', 'men'];
      var s = ['攻撃力', '防御力', '攻撃速度', '回避', 'クリティカル', 'HP', 'MP', 'STR', 'VIT', 'AGI', 'DEX', 'INT', 'MEN'];
      for (var i = 0; i < p.length; i++) {
        var val = Math.floor(iData.param.a[p[i]]);
        if (val != 0) {
          var e= $('<p>').append(s[i]);
          $('.itemLeft').append(e);
          if(val<0)
            e.append($('<span>',{class:'st-down'}).html(val));
          else
            e.append($('<span>',{class:'st-up'}).html('+' + val));
        }
        var cro = Math.floor(iData.param.c[p[i]] * 100);
        if (cro != 0) {
          var e= $('<p>').append(s[i]);
          $('.itemRight').append(e);
          if(cro<0)
            e.append($('<span>',{class:'st-down'}).html(cro+"%"));
          else
            e.append($('<span>',{class:'st-up'}).html(('+' + cro) + "%"));
        }
      }
    }
  }

  $('.equip .hLine').on('mouseover', itemView());
  var heroID = get_url_vars().heroID;
  if (!heroID) return;
  $.get("/hero", {
    heroID: heroID
  }).done(function(data) {
    hero.setData(data.result.heroData);
  });
});
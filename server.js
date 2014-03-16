
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var hg = require('./herogen');
var resource = require('express-resource');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.cookieParser("マウンテンデュー美味しい"));
app.use(express.session({secret: 'チョコパフェ食べたい'}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.resource('update', require('./routes/update'), { id:'heroID' });
app.resource('view', require('./routes/view'), { id:'heroID' });
app.resource('ranking', require('./routes/ranking'));
app.resource('hero', require('./routes/hero'), { id:'key' });
app.resource('change', require('./routes/change'), { id:'key' });
app.resource('upgrade', require('./routes/upgrade'), { id:'key' });
app.resource('buy', require('./routes/buy'), { id:'key' });
app.resource('rename', require('./routes/rename'), { id:'key' });
app.resource('attack', require('./routes/attack'), { id:'key' });
http.createServer(app).listen(app.get('port'), function(){
  setInterval(hg.ticketHandOut,1000*10);
  console.log('Express server listening on port ' + app.get('port'));

});

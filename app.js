'use strict'

//服务器启动文件，项目启动入口

//项目根目录
global.ROOTPATH = __dirname;

require(global.ROOTPATH + '/server/js/setting.js');

global.ROOTPATH = __dirname;
var
	//设置端口
	port = process.env.PORT || global.port,

	express = require('express'),
	UUID = require('node-uuid'),
	http = require('http'),
	app = express(),
	bodyParser = require('body-parser'),
    http_server = http.createServer(app),
    rpc = require(global.ROOTPATH + '/server/js/rpc.js');

//监听端口
http_server.listen(port);
console.log('\t :: Express listen to port:' + port);

app.use(bodyParser());


//设置主页
app.all('/', function (req, res) {
	// console.log(req);
	// console.log(res);
    res.sendfile('/dashboard.html', { root: __dirname });
});



//登录请求
app.post('/login', function (req, res) {
	// console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	db.select('users', 'username', username, ['username', 'password'], function (err, params) {
		console.log(err, params);
		if (err) {
			console.log(err);
			req.session.destroy();
			res.json({"success":false});
		} else if (params && params[0] && username == params[0].username && password == params[0].password) {
			console.log('login successfully');
			req.session.login = true;
			req.session.name = username;
			res.json({"success":true});
		} else {
			console.log('wrong');
			req.session.destroy();
			res.json({"success":false});
		}
	});
});


app.post('/enroll', function (req, res) {
	// res.sendfile('/client/html/enroll.html', { root: __dirname });
	var username = req.body.username;
	var password = req.body.password;
	console.log(req);
	db.insert('users', {username:username, password:password}, function (err, params) {
		console.log(err, params);
		if (err) {
			console.log(err);
			req.session.destroy();
			res.json({"success":false});
		} else {
			console.log('enroll successfully');
			req.session.destroy();
			res.json({"success":true});
		}
	});
});

app.post('/rpc', function (req, res, next) {
    console.log(req);
    // var method = req.body.method;
	// var params = req.body.params;
	// rpc.single_post(res, method, params);

	rpc.getBlockPage(res);
});

//监听/×文件
app.all('/*', function (req, res, next) {
	var file = req.params[0];
	console.log('\t :: Express :: file requested: ' + file, file.substring(0, 6));
	if (file.substring(0, 6) != 'server'){ 
		res.sendfile(__dirname + '/' + file);
    } else {
        res.end();
    }
});

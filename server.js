const http = require('http');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const net = require('net');
//const dos = require('./dosFlooding.js')
var requestIp = require('request-ip');
const url = require('url');
var querystring = require('querystring'); 
const fs = require('fs')
const multer = require("multer");

const mealSearch = require("./scripts/mealParsing.js");

let mealBuffer = fs.readFileSync('json/mealData.json');
let mealJSON = mealBuffer.toString();
let mealData_json = JSON.parse(mealJSON); // 읽어온 json 파일을 데이터화

var bodyParser = require('body-parser');
var ipfilter = require('express-ipfilter').IpFilter;
var IpDeniedError = require('express-ipfilter').IpDeniedError;

let dataBuffer = fs.readFileSync('json/main_option.json');
let dataJSON = dataBuffer.toString();
let main_option = JSON.parse(dataJSON); // 읽어온 json 파일을 데이터화

const app = express();
const server = http.createServer(app);
const port = 4015 || process.env.port;

// 차단, 허용할 특정 아이피 목록
var ips = ['::ffff:58.97.227.138'];

// ips 목록의 ip들만 허용
//app.use(ipfilter(ips, {mode: 'allow'}));

// ips 목록의 ip들 차단
app.use(ipfilter(ips));

app.use(function(err, req, res, _next) {
  //console.log('Error handler', err);
  res.send('당신의 네트워크는 관리자로부터 차단되었습니다.');                     // page view 'Access Denied'
  if(err instanceof IpDeniedError){
    res.status(401).end();
  }else{
    res.status(err.status || 500).end();
  }
  // res.render('error', {
  //   message: 'You shall not pass',
  //   error: err
  // });
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.set('views', './views');

app.use(bodyParser.urlencoded({extend : false}));

app.get('/', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  console.log('=================================')
    console.log('ClientIP: ' + ClientIP + '\nServer Connection Occurred');
    console.log('=================================')
  res.render('main', {main_option: main_option});
})

app.get('/todayMeal', (req, res) => {
  ClientIP = requestIp.getClientIp(req) // 요청한 클라이언트 아이피
  
  console.log('=================================')
    console.log('급식조회\nClientIP: ' + ClientIP + '\nServer Connection Occurred');
    console.log('================================')
  res.render('todayMeal', {"mealSearch": mealData_json});
})

server.listen(port, () => {
  console.log('서버가 열렸음.');
});

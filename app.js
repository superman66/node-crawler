var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
// var requrl = 'http://jandan.net/ooxx/page-1319';
var requrl = 'https://tuchong.com/tags/%E6%97%85%E8%A1%8C/?page=2';

var target = {
  url: 'https://tuchong.com/tags/%E6%97%85%E8%A1%8C/?page=',
  pageNumberOne: 1,
  pageNumberTwo: 6,
  selector: '.main-collage img',
  replace: 'ft640',
  replaceTo: 'f'
};
function crawler(target) {
  for (var i = target.pageNumberOne; i <=target.pageNumberTwo; i++) {
    console.log('第'+i+'页，url是：'+ target.url+i);
   request(target.url+i, function (error, response, body) {
    console.log(error);
    if (!error && response.statusCode == 200) {
      // console.log(body);    //返回请求页面的HTML
      acquireData(body, i);
    }
  });
  }
}

function requestUrl(url) {
  request(requrl, function (error, response, body) {
    console.log(error);
    if (!error && response.statusCode == 200) {
      // console.log(body);    //返回请求页面的HTML
      acquireData(body);
    }
  });
}


function acquireData(data, pageSize) {
  var $ = cheerio.load(data);
  var meizi = $('.main-collage img').toArray();
  // console.log(meizi.length);
  var len = meizi.length;
  for (var i = 0; i < len; i++) {
    var imgsrc = meizi[i].attribs.src.replace('ft640', 'f');
    console.log(imgsrc);
    var filename = parseUrlForFileName(imgsrc);  //生成文件名
    downloadImg(imgsrc, filename, pageSize, function () {
      console.log(filename + ' done');
    });
  }
}

function parseUrlForFileName(address) {
  return path.basename(address);
}

var downloadImg = function (uri, filename, pageSize, callback) {
  request.head(uri, function (err, res, body) {
    // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
    // console.log('content-length:', res.headers['content-length']);  //图片大小
    if (err) {
      console.log('err: ' + err);
      return false;
    }

    request(uri).pipe(fs.createWriteStream('download/' + filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
  });
};

crawler(target);
// requestUrl(requrl);
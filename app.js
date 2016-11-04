var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');

var crawlerObj = {
  url: 'https://tuchong.com/tags/%E6%97%85%E8%A1%8C/?page=',  // 网址
  pageStart: 1, // 起始页
  pageEnd: 1, //  结束页
  selector: '.main-collage img',  //内容所在的选择器，语法同jQuery
  replaceFrom: 'ft640', // 图片路径需要代替的内容
  replaceTo: 'f', // 代替新内容
  dirName: 'tuchong'  //存放文件夹名称
};

var Crawler = {
  init: function (crawlerObj) {
    this.crawlerObj = crawlerObj;
    this.crawler();
  },
  crawler: function () {
    var that = this;
    for (var i = that.crawlerObj.pageStart; i <= that.crawlerObj.pageEnd; i++) {
      console.log('第' + i + '页，url是：' + that.crawlerObj.url + i);
      that.requestUrl();
    }
  },
  requestUrl: function () {
    var that = this;
    request(that.crawlerObj, (error, response, body)=> {
      if (error) {
        console.log(error);
      }
      if (response.statusCode === 200) {
        that.getData(body);
      }
    })
  },
  getData: function (data) {
    var that = this;
    var $ = cheerio.load(data);
    var dataList = $(that.crawlerObj.selector).toArray();
    var length = dataList.length; // the num of data
    for (var j = 0; j < length; j++) {
      var imgSrc = dataList[j].attribs.src;

      if (that.crawlerObj.replaceFrom && that.crawlerObj.replaceTo) {
        imgSrc.replace(that.crawlerObj.replaceFrom, that.crawlerObj.replaceTo);
      }

      var fileName = that.parseUrlForFileName(imgSrc);
      that.download(imgSrc, fileName, function () {
        console.log(fileName + ' done');
      })
    }
  },
  parseUrlForFileName: function (fileName) {
    return path.basename(fileName);
  },
  download: function (uri, filename, callback) {
    var that = this;
    request.head(uri, function (err, res, body) {
      // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
      // console.log('content-length:', res.headers['content-length']);  //图片大小
      if (err) {
        console.log('err: ' + err);
        return false;
      }

      // 创建文件夹
      mkdirp.sync('download/' + that.crawlerObj.dirName);

      //调用request的管道来下载到 images文件夹下
      request(uri).pipe(fs.createWriteStream('download/' + that.crawlerObj.dirName + '/' + filename)).on('close', callback);
    });
  }
};

Crawler.init(crawlerObj);

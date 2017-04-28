/**
 * Created by Kerwin on 2017/4/17.
 */
var request = require("request");
function spider(path,callback){
    var options = {
        url: 'http://m.api.haoshiqi.net'+path,
        headers:{
            "Accept":"application/json",
            "Accept-Encoding":"gzip, deflate, sdch, br",
            "Accept-Language":"zh-CN,zh;q=0.8",
            "Referer":"https://m.haoshiqi.net/",
            "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
        }
    };

    request(options, function(error, response, body){
        callback && callback(body);
    });

}

module.exports = spider;
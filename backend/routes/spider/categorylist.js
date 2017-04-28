var express = require('express');
var router = express.Router();
var spider = require("./spider");

router.get("/",function(req,res,next){
	spider(`/category/categorylist?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23category%3Fchannel_id%3Dh5`,function(data){
		res.send(data);
	});
})

module.exports =router;
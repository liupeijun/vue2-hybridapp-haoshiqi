var express = require('express');
var router = express.Router();
var spider = require("./spider");

router.get("/",function(req,res,next){
	spider(`/common/hotsearchsug?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23search%3Fchannel_id%3Dh5`,function(data){
		res.send(data);
	});
})

router.get("/list",function(req,res,next){

	spider(`/product/itemssearch?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=2459&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23list%3Fsearchtag%3D${encodeURIComponent(req.query.text)}%26backLevel%3D-2%26channel_id%3Dh5&searchTag=${encodeURIComponent(req.query.text)}&q=${encodeURIComponent(req.query.text)}&needPagination=1&pageNum=${req.query.num}&pageLimit=20`,function(data){
		res.send(data);
	})
})

router.get("/category",function(req,res,next){
	
	spider(`/product/itemssearch?device=pc&channel=h5&swidth=1440&sheight=900&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23list%3Fcategoryname%3D${encodeURIComponent(req.query.text)}%26categoryid%3D${req.query.id}%26channel_id%3Dh5&categoryId=${req.query.id}&category=${encodeURIComponent(req.query.text)}&needPagination=1&pageNum=${req.query.num}&pageLimit=20`,function(data){
		res.send(data);
	})
})

module.exports =router;
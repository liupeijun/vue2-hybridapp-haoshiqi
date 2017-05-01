var express = require('express');
var router = express.Router();
var spider = require("./spider");

router.get("/index",function(req,res,next){
	spider(`/common/index?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F`,function(data){
		res.send(data);
	});
})


router.get("/recommend",function(req,res,next){
	spider(`/product/recommendproducts?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F&needPagination=1&pageNum=${req.query.num}&pageLimit=20`,function(data){
		res.send(data);
	});
})
 
module.exports =router;
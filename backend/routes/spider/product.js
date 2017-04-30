var express = require('express');
var router = express.Router();
var spider = require("./spider");

router.get("/info",function(req,res,next){
	spider(`/product/iteminfo?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23detail%3Fsid%3D14369%26channel_id%3Dh5&skuId=${req.query.id}`,function(data){
		res.send(data);
	});
})

router.get("/detail",function(req,res,next){
	spider(`/product/productdetail?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23detail%3Fsid%3D14435%26channel_id%3Dh5&productId=${req.query.id}`,function(data){
		res.send(JSON.parse(data).data.graphicDetail); //返回产品的详细图片信息
	});
})
    

 
module.exports =router;
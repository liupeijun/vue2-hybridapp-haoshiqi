var express =require("express");
var router = express.Router();
var spider = require("./spider");
router.get("/index",function(req,res,next){

	spider("/common/pinindex?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=857&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23couple_list%3FshowFooter%3D1%26channel_id%3Dh5",function(data){
		res.send(data);
	})
})

router.get("/product",function(req,res,next){
	spider(`/product/coupleskulist?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=857&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23couple_list%3FshowFooter%3D1%26channel_id%3Dh5&needPagination=1&pageNum=${req.query.num}&pageLimit=20`,function(data){
		res.send(data);
	})
})

router.get("/search/config",function(req,res,next){
	spider(`/common/initconfig?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=857&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23couple_search_list%3Fsearch%3Dd%26channel_id%3Dh5`,function(data){
		res.send(data);
	})
})

router.get("/search/activities",function(req,res,next){
 	var sorttext = "";
 	if(req.query.sortType===undefined){
 		sorttext = "";
 	}else if(req.query.sortType==1){
 	
 		sorttext = '&sort=price'+'&sortType=1';
 	}else{

 		sorttext = '&sort=price'+'&sortType=0';
 	}
 	
	var url =`/market/pinactivitiessearch?device=iphone&channel=h5&swidth=375&sheight=667&zoneId=1479&v=2.3.0&terminal=wap&page=https%3A%2F%2Fm.haoshiqi.net%2F%23
	couple_search_list%3Fsearch%3D${encodeURIComponent(req.query.text)}%26channel_id%3Dh5`+
	`${req.query.sort=='selled'?'&sort=selled':''}`+
	`${sorttext}`+
	`${req.query.area?'&area='+encodeURIComponent(req.query.area):''}`+
	`${req.query.price?'&price='+req.query.price:''}`+
	`&needPagination=1&pageNum=${req.query.num}&pageLimit=20`+
	`&q=${encodeURIComponent(req.query.text)}`;
	console.log(url);
	spider(url,function(data){
		res.send(data);
	})
})

module.exports = router;


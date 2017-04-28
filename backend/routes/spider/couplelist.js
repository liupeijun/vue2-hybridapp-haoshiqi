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

module.exports = router;


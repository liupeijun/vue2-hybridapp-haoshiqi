	<template>
		<div class="home" >
			
			<div class="header">
				<div class="logo"></div>
				<input type="text" placeholder="搜索你想要的商品" @focus="handleFocus()"/>
				<div class="location">
					<span>{{location}}</span><i class="iconfont icon-moreunfold"></i>
				</div>
			</div>

			<div class="content" ref="content">
				<ul class="bannerlist">
					<li v-for="(data,index) in bannerlist">
						<img :src="data.image">
					</li>
				</ul>

				<ul class="buttonlist">
					<li v-for="(data,indx) in buttonlist">
						<img :src="data.icon"/>
						<span>{{data.label}}</span>
					</li>
				</ul>

				<ul class="marketingactivities">
					<li v-for="(data,index) in activitieslist">
						<img :src="data.icon">
					</li>
				</ul>

				<div class="recommendlistContainer">
					<ul class="recommendlist"   
						v-infinite-scroll="loadMore"
	  					infinite-scroll-disabled="loading"
	  					infinite-scroll-distance="0">
						<li v-for="(data,index) in recommendlist" @click="handleDetailClick(data.skuInfo.id)">
							<img :src="data.skuInfo.skuThumbnail"/>

							<div class="text">
								<h3>{{data.name}}</h3>
								<p>￥{{data.skuInfo.price |formatNumber}}<span>{{data.skuInfo.market_price|formatNumber}}</span></p>
							</div> 

							<div class="shopcar">
								
							</div>
						</li>
					</ul>
				</div>
			</div>

			
		</div>
	</template>


	<script>
		import router  from "../router";
		import Vue from "vue";
		import { Indicator } from 'mint-ui';
		import { Toast } from 'mint-ui';
		import { InfiniteScroll } from 'mint-ui';
		Vue.use(InfiniteScroll); //全局指令


		//分割数字的过滤器 by kerwin
		Vue.filter('formatNumber',function(value){
			// console.log(value);
			var value = value.toString();
            return value.slice(0,-2)+"."+value.slice(-2);

        });


		export default {
			created(){
				//请求banner数据by Kerwin
				
				axios.get(`${process.env.URL}/home/index`)
				  .then(res=>{
				  	// console.log(res.data.data);
				  	this.bannerlist = res.data.data.bannerList;
				  	this.buttonlist = res.data.data.subButtonList;
				  	this.activitieslist = res.data.data.marketingActivities;
		
				  })
				  .catch(function (error) {
				    console.log(error);

				  });

				  //加载第一页的推荐表,不需要加载，无限滚动组件会自动加载一次
				 // this.getRecommendList(this.currentpage);

				 var _this =this;
				 //获取经纬度值
				 var onSuccess = function(position) {
							
					axios.get("http://api.map.baidu.com/geocoder/v2/?location="+position.coords.latitude+","+position.coords.longitude+"&output=json&pois=1&ak=67jMQ5DmYTe1TLMBKFUTcZAR").then(res=>{
						
						console.log(res.data.result.addressComponent.province);
						_this.location = res.data.result.addressComponent.province;

						Toast(`已定位到${_this.location}`);
					})
				};

				// onError回调函数接收一个PositionError对象
				function onError(error) {
					alert('code: '    + error.code    + '\n' +
						'message: ' + error.message + '\n');
					_this.location= "Kerwin";
				}
				navigator.geolocation.getCurrentPosition(onSuccess, onError,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
			},


			beforeRouteEnter(to,from,next){
				next(vm=>{
					vm.loading= false; //可以加无限加载了
					vm.$emit("scrolltop"); //进来之前， 滚动条滚动最上面
				});
			},

			beforeRouteLeave(to,from,next){
				this.loading = true; //禁用无限加载， fixed bug by kerwin
				next();
			},

			data(){
				return {
					currentpage:0,
					bannerlist:[],
					buttonlist:[],
					activitieslist:[],
					recommendlist:[],
					loading:false ,//false 表示不禁用无限滚动
					location:""
				}
			},
			
			methods:{
				
				getRecommendList(num,callback){
					axios.get(`${process.env.URL}/home/recommend`,{
						params: {
					      num: num
					    }
					}).then(res=>{
					  	// console.log(res.data);
					  	this.recommendlist =[...this.recommendlist,...res.data.data.list];

					  	callback && callback();
					  })
					  .catch(function (error) {
					    console.log(error);
					  });
				},
				loadMore(){
					
					Indicator.open();
					this.loading = true; //禁用无限加载
					this.getRecommendList(++this.currentpage,()=>{
						this.loading= false; //启用无限加载
						Indicator.close();
					});
				},

				//进入搜索页面
				handleFocus(){
					router.push({path:"/search"});
				},

				handleDetailClick(id){
					router.push({path:"/detail",query:{id:id}});
				}
			}

		}
	</script>


	<style lang="scss" scoped>
			.home{height:100%;}
			.header{
				width:100%;
				height:2.75rem;
				background:#fe1;
				padding: .4375rem 5rem;
				
				.logo{
					position: absolute;
				    top: .625rem;
				    left: .625rem;
				    width: 3.75rem;
				    height: 1.125rem;
				    background: url(http://img1.haoshiqi.net/assets/hsqimg/logo2.png) top left no-repeat;
				    -webkit-background-size: auto 100%;
				    background-size: auto 100%;
				    z-index: 1000;
				}

				input {
					display:block;
					height:100%;
					outline:none;
					width:100%;
					border:0px;
					border-radius:0.25rem;
					background:#fff;
					padding: 0 .625rem;
					font-size:0.75rem;
				}

				.location{
					position: absolute;
				    top: .625rem;
				    right: .625rem;
				    white-space: nowrap;
				    max-width: 3.75rem;
				    // overflow: hidden;
				    color: #914e07;
				}
			}

			.content{
				.bannerlist img{
					width:100%;
				}

				.buttonlist {
					display: -webkit-box;
				    display: -webkit-flex;
				    display: -ms-flexbox;
				    display: flex;
				    width: 100%;
					
					li{
						margin-top:5px;
						background:#fff;
						padding:.625rem 0px;
						-webkit-box-flex: 1;
						-webkit-flex:1;
						flex:1;
						text-align:center;
						padding:10px;
						img{
							width:2.5rem;
						}
						span{
							display:block;
							font-size: .75rem;
						    text-align: center;
						    color: #959595;
						}
					}
				}

				.marketingactivities{
					li{
						padding-bottom:3px;
					}
					img{
						width:100%;
					}
				}

				.recommendlistContainer{

					.recommendlist{
						li{
							padding:10px;
							background:#fff;
							margin-top:5px;
							overflow:hidden;
							position:relative;
							img{
								width: 6.25rem;
	    						height: 6.25rem;
	    						float:left;
							}

							.text {
								overflow:hidden; //清除浮动
								padding:5px;
								h3{
									overflow: hidden;
								    margin-bottom: 1.25rem;
								    height: 2rem;
								    font-size: .875rem;
								    font-weight: 400;
								    line-height: 1.2;
								    color: #252525;
								}
								p{
									white-space: nowrap;
								    margin-left:10px;
								    font-style: normal;
								    font-size: 1.25rem;
								    color: #f55;

								    span{
								    	font-size:.75rem;
								    	margin-left:10px;
								    	text-decoration:line-through;
								    	color: #b4b4b4;
								    }
								}
							}
							.shopcar{
								background-image:url(http://img1.haoshiqi.net/assets/hsqimg/button_shopCart.png);
								width: 1.875rem;
	   							height: 1.875rem;
	   							position:absolute;
	   							bottom:10px;
	   							right:10px;
	   							background-size:cover;
							}
						}					
					}					
				}

			}

	</style>


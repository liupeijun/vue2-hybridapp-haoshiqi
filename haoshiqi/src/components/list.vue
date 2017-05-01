	<template>
		<div>
		
			<div class="header">
				<span class="left button" @click="handleBack()">返回</span>
				<span class="right button"><i class="iconfont icon-all" @click="handleHome()"></i></span>
				{{title}}
			</div>

			<div class="content">
				<div class="searchlistContainer">
					<ul class="searchlist"   
						v-infinite-scroll="loadMore"
	  					infinite-scroll-disabled="loading"
	  					infinite-scroll-distance="0">
						<li v-for="(data,index) in searchlist" @click="handleDetailClick(data.skuInfo.id)">
							<img :src="data.main_sku_pic"/>

							<div class="text">
								<h3>{{data.name}}</h3>
								<p>￥{{data.skuInfo.price |formatNumber}}<span>{{data.skuInfo.market_price|formatNumber}}</span></p>
							</div>

							<div class="shopcar">
								
							</div>
						</li>
					</ul>
				</div>
				<div class="nomorefoods" v-show="isEnd">没有更多的商品了</div>
				<div class="nomatchfoods" v-show="isShow">没有找到"{{title}}"相关的商品</div>
			</div>
		</div>
	</template>


	<script>
		import router from "../router";
		import { Indicator } from 'mint-ui';
		let  CancelToken ;
		let  source ;

		export default {

			beforeRouteEnter(to,from,next){


				next(vm=>{
					vm.from =from.path; //是从哪个页面来的	

					// console.log(vm.$route.query); //传参数实现 
					vm.title = vm.$route.query.text; 
					vm.loading= false; //可以加无限加载了

					//每次进入路由重新设置cancel token 可以source.cancel取消数据请求
					CancelToken = axios.CancelToken; 
					source = CancelToken.source(); 
				})
			},

			beforeRouteLeave(to,from,next){
				this.searchlist= []; //清空列表
				this.loading = true; //禁用无限加载， fixed bug by kerwin
				this.num =0; //从0开始
				this.isEnd=false;

				source.cancel(); //取消未完成的请求

				this.isShow =false; //隐藏没有找到**相关的商品
				next(); //一定要写
			},

			data(){
				return {
					num:0,
					title:"",
					searchlist:[],
					loading:false,
					totalPage:0,
					isEnd:false,
					isShow:false,
					from:""
				}
			},

			methods:{
				getSearchList(value,num,callback){
					let url="";
					let params=null;
					if(this.from=="/category"){
						//
						url=`${process.env.URL}/search/category`;
						params= {
					      num: num,
					      text:value,
					      id:this.$route.query.id //category _id 值
					    }
					}else{
						url=`${process.env.URL}/search/list`;
						params= {
					      num: num,
					      text:value
					    }
					}

					axios.get(url,{
						params,
					    cancelToken: source.token //设置token(所有的请求的都是同一个token)
					}).then(res=>{
					  	// console.log(res.data.data);
					  	this.searchlist =[...this.searchlist,...res.data.data.list];
					  	this.totalPage= res.data.data.totalPage;
					  	callback && callback();
					  })
					  .catch(function (error) {
					    console.log(error);
					  });
				},
 
				handleBack(){
					router.go(-1); //返回上个页面
				},

				handleHome(){
					router.push({path:"/home"}); //回到首页
				},

				loadMore(){
					
					Indicator.open();
					this.loading = true; //禁用无限加载
					this.getSearchList(this.title,++this.num,()=>{
						if(!this.totalPage && this.searchlist.length==0){
							this.isShow =true;
							return;
						}
						if(this.num<this.totalPage){
							this.loading= false; //启用无限加载
						}else{
							this.isEnd=true;
							this.loading= true; //禁用无限加载， 所有的数据请求完了已经
						}
						Indicator.close();
					});
				},

				handleDetailClick(id){
					router.push({path:"/detail",query:{id:id}});
				}
			}
		}
	</script>


	<style lang="scss" scoped>
			.header{
				width:100%;
				height:44px;
				line-height:44px;
				text-align:center;
				background-color: rgba(255,238,17,.9);
    			color: #914e07;
    			font-size: 1.125rem;
    			position:fixed;
    			left:0px;
    			top:0px;
    			z-index: 100;

    			 .left{
				    	float:left;
				 }
				    .right{
				    	float:right;

				    }
				    .button{
				    	color: #914e07;
				    	cursor: pointer;
				    	font-size: .875rem;
				    	line-height:44px;
						padding:0px 10px;
						width:4rem;
				    	&:active{
				    		background:rgba(0,0,0,0.2)
				    	}
				}
			}

			.searchlistContainer{
					margin-top:44px;
					.searchlist{
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

				.nomorefoods{
					width:100%;
					height:44px;
					line-height:44px;
					text-align:center;
					background:#f8f8f8;

				}

				.nomatchfoods{
					width: 100%;
				    margin-top: 6.25rem;
				    padding-top: 6.25rem;
				    text-align: center;
				    color: #959595;
				    background: url(http://img1.haoshiqi.net/assets/hsqimg/placeholder.png) top center no-repeat;
				    -webkit-background-size: 6.25rem 6.25rem;
				    background-size: 6.25rem;
				}
	</style>


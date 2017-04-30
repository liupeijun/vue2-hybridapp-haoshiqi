	<template>
		<div>
		
			<div class="header">
				
					<span class="left button" @click="handleBack()">返回</span>
					<span class="right button"><i class="iconfont icon-all" @click="handleHome()"></i></span>
					{{title}}
				
			</div>

			<div class="content" :style="{height:picHeight}" v-if="detailInfo">
				<mt-swipe :auto="0" class="swiper" >
				  <mt-swipe-item v-for="(data,index) in detailInfo.pics" :key="index">
				  		<img :src="data"/>
				  </mt-swipe-item>
				</mt-swipe>
				<div class="info">
					<div class="name">
						<div>{{detailInfo.name}}</div>
						<p>
							<span class="price">￥{{detailInfo.lowest_price |formatNumber}}</span>
							<span  class="deleteprice">价格<del>{{detailInfo.market_price |formatNumber}}</del></span>
							<span class="number">库存{{detailInfo.left_stock}}件</span>
						</p>
						<p class="selectNum" @click="isShowShopcar=true;">
							<span>已选：</span>{{number}}件
							<i class="iconfont icon-more"></i>
						</p>
					</div>

					<ul class="icons">
						<li v-for="data in detailInfo.labels">
							<img :src="data.icon"/>
							<span>{{data.text}}</span>
						</li>
					</ul>
					<div class="merchantInfo">
						<img :src="detailInfo.merchantInfo.logo"/>
						<div>{{detailInfo.merchantInfo.name}}</div>
						<p>{{detailInfo.merchantInfo.province}} {{detailInfo.merchantInfo.city}}</p>
					</div>
				</div>

				<div v-html="productInfo" class="productInfo">
					
				</div>
			</div>

			<div class="footer">
				<ul>
					<li>
						<i class="iconfont icon-service"></i>
						<span>客服</span>
					</li>
					<li>
						<i class="iconfont icon-favorites"></i>
						<span>收藏</span>
					</li>
					<li @click="goShopCar()">
						<i class="iconfont icon-cart"></i>
						<span >购物车</span>
					</li>
				</ul>
				<p @click="isShowShopcar=true">加入购物车</p>
			</div>
			
			<div class="cover" v-show="isShowShopcar">
				
			</div>
			<div class="shopcar" v-show="isShowShopcar" v-if="detailInfo">
				<div class="buyheader">
					<img :src="detailInfo.thumbnail"/>
					<h3>{{detailInfo.lowest_price |formatNumber}}</h3>
					<p>库存{{detailInfo.left_stock}}件<br/> 商品编号：{{detailInfo.skuId}}</p>
					<i class="iconfont icon-close" @click="isShowShopcar=false"></i>
				</div>
				<div class="buynumber">
					<p>购买数量</p>
					<div>
						<button @click="delNumber()">-</button>
						<span>{{number}}</span>
						<button @click="++number">+</button>
					</div>
				</div>

				<div class="buyfooter" @click="addShopcar()">
					加入购物车
				</div>
			</div>
		</div>
	</template>


	<script>
		import router  from "../router";
		import { Toast } from 'mint-ui';
		let  CancelToken ;
		let  source ;
		export default {

			beforeRouteEnter(to,from,next){

				next(vm=>{
					
					//每次进入路由重新设置cancel token 可以source.cancel取消数据请求
					CancelToken = axios.CancelToken; 
					source = CancelToken.source(); 
					
					vm.getItemInfo();
				})
			},

			beforeRouteLeave(to,from,next){
				this.detailInfo = null;
				this.productInfo = "";
				this.number = 1;
				source.cancel();
				next()
			},

			data(){
				return {
					title:"商品详情",
					detailInfo:null,
					productInfo:"",
					number:1,
					picHeight:document.documentElement.clientWidth+"px",

					isShowShopcar:false
				}
			},

			computed:{
				
			},

			methods:{
				handleBack(){
					router.go(-1);
				},
				handleHome(){
					router.push({path:"/home"});
				},

				getItemInfo(){
					axios("/api/product/info",{
						params:{
							id:this.$route.query.id
						},
						 cancelToken: source.token //设置token(所有的请求的都是同一个token)
					}).then(res=>{
						console.log(res.data.data);
						this.detailInfo = res.data.data;
						return axios("/api/product/detail",{
							params:{
								id:this.detailInfo.productId
							}
						})
					}).then(res=>{
						this.productInfo = res.data;
					})
				},

				goShopCar(){
					router.push({path:"/shopcar"});
				},

				delNumber(){
					this.number--;
					if(this.number==0){
						this.number =1;
					}
					return this.number;
				},

				addShopcar(){
					this.$store.dispatch("ADD_DATA",{
			          merchant_id:this.detailInfo.merchant_id,
			          merchant_name:this.detailInfo.merchantInfo.name,
			          name:this.detailInfo.name,
			          lowest_price:this.detailInfo.lowest_price,
			          market_price:this.detailInfo.market_price,
			          thumbnail:this.detailInfo.thumbnail,
			          left_stock:this.detailInfo.left_stock,
			          number:this.number,
			          product_id:this.detailInfo.skuId
			       	});

			       	this.isShowShopcar = false; //
			       	//显示加入成功

			       	Toast({
					  message: '加入购物车成功',
					  iconClass: 'iconfont icon-success',
					  className:"kerwinsuccess",
					});

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

			.content{
				padding-top:44px;
				.swiper{
					width:100%;
					
					img{
						width:100%;
					}
				}

				.info{
					background:#fff;
					.name{
						padding:10px;
						
						.price{
						    white-space: nowrap;
						    display: inline-block;
						    font-style: normal;
						    font-size: 1.25rem;
						    color: #f55;
						}

						.deleteprice{
							color: #959595;
							font-size: .75rem;
						}

						.number{
							float:right;
							color: #959595;
							font-size: .75rem;
						}

						.selectNum{
							margin-bottom:-10px;
							border-top:1px solid #e4e4e4;
							height:40px;
							line-height:40px;
							font-size: .875rem;

							i{
								float:right;
								color: #b4b4b4;
    							font-size: 1rem;
							}

							span{
								color:#959595;
							}
						}
					}

					.icons{
						display: -webkit-box;
					    display: -webkit-flex;
					    display: -ms-flexbox;
					    display: flex;
					    width: 100%;
					    background: #f7f8fa;
						li{

							-webkit-box-flex: 1;
							-webkit-flex:1;
							flex:1;
							text-align:center;
							
							img{
								width:2.5rem;
							}
							span{
								    display: block;
								    text-align: center;
								    width: 100%;
								    white-space: nowrap;
								    overflow: hidden;
								    text-overflow: ellipsis;
								    font-size: .625rem;
								    color:#b4b4b4;
							}
						}
					}

					.merchantInfo{
						padding:10px;
						img{
							width:3rem;
							float:left;
						}
						div{
							font-size: .875rem;
    						font-weight: 400;
							overflow:hidden;
							padding-left:10px;    						
						}
						p{
							    padding-top: .625rem;
							    margin-bottom: .375rem;
							    font-size: .75rem;
							    color: #959595;
							    overflow:hidden;
								padding-left:10px;    
						}
					}
				}
				.productInfo{
					margin-top:10px;
					margin-bottom:44px;
				}
			}

			.footer{
				position:fixed;
				width:100%;
				height:44px;
				left:0px;
				bottom:0px;
				
				text-align:center;
				background:#fff;
				-webkit-box-shadow: 0 -3px 5px -1px rgba(0,0,0,.1);
			    box-shadow: 0 -3px 5px -1px rgba(0,0,0,.1);

				display: -webkit-box;
					    display: -webkit-flex;
					    display: -ms-flexbox;
					    display: flex;
				ul{
					-webkit-box-flex: 1;
					-webkit-flex:1;
					flex:1;
					display: -webkit-flex;
					display: -ms-flexbox;
					display: flex;
					li{
						    font-size: .75rem;
						padding-top:.5rem;;
						-webkit-box-flex: 1;
						-webkit-flex:1;
						flex:1;
						color: #959595;
						border-right:.0625rem solid #d8d8d8;
						i{
							display:block;
						}
					}
				}

				p{
					width:100px;

    				background: #f55;
    				line-height:44px;
    				color:#fff;
				}
			}

			.cover{
				position:fixed;
				top:0px;
				left:0px;
				width:100%;
				height:100%;
				font-size: .875rem;
				 background:rgba(0,0,0,0.3);
				 z-index:2;
			}

			.shopcar{
				font-size: .875rem;
				position:fixed;
				bottom:0px;
				left:0px;
				width:100%;
				height: 50%;
				z-index:100;
				
				padding:10px;
				background:#fff;
				.buyheader{
					border-bottom:.0625rem solid #e4e4e4;
					padding-bottom:10px;
					position:relative;

					img{
						float:left;
						margin-right:0.625rem;
						width: 5.75rem;
    					height: 5.75rem;
    					margin-top:-1.5rem;
    					    border-radius: .1875rem;
					}

					h3{
						overflow:hidden;
						white-space: nowrap;
					    display: inline-block;
					    font-style: normal;
					    font-size: 1.25rem;
					    color: #f55;
					    font-weight: 400;
					}
					p{
						overflow:hidden;
						font-size: .875rem;
					}

					i{
						position:absolute;
						top:5px;
						right:5px;
					}
				}
				.buyfooter{
					position: absolute;
				    bottom: 0;
				    left: 0;
				    width: 100%;
				    height: 3.125rem;
				    line-height: 3.125rem;
				    font-size: 1.125rem;
				    background: #f55;
				    color: #fff;
				    text-align: center;
				}

				.buynumber{
					border-bottom:.0625rem solid #e4e4e4;
					padding:.8125rem 0px;
					position:relative;
					height: 3.5rem;
					overflow:hidden;
					p{
						display:inline-block;
						line-height: 1.875rem;
					}
					div{
						display:inline-block;
						float:right;

						button{
							width: 2.5rem;
						    height: 1.875rem;
						    line-height: 1.875rem;
						    background: #f7f7f7;
						    border: none;
						    border-radius: .25rem;
						    font-size: 1rem;
						    color: #959595;

						}
						span{
							display:inline-block;
							width:20px;
							text-align:center;
						}
					}
				}
			}
	</style>


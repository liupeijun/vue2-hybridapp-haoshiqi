	<template>
		<div kerwin>
		
			<div class="header">
				拼团
			</div>
			<div class="content">
				<div class="search">
					<i class="iconfont icon-search"></i>
					<input type="text" placeholder="搜索拼团商品" />
				</div>

				<ul class="category">
					<li v-for="(data,index) in categorylist">
						<img :src="data.icon"/>
						<span>{{data.label}}</span>
					</li>
				</ul>

				<div class="recommendlistContainer">
					<ul class="recommendlist"   
						v-infinite-scroll="loadMore"
	  					infinite-scroll-disabled="loading"
	  					infinite-scroll-distance="0">
						<li v-for="(data,index) in recommendlist">
							<img :src="data.skuPic"/>

							<div class="text">
								<h3>{{data.coupleTitle}}</h3>
								<p>￥{{data.couplePrice |formatNumber}}<span>{{data.marketPrice|formatNumber}}</span></p>
							</div>

							<div class="tuantext">
								{{data.countLimit+'人团'}}<i class="iconfont icon-more"></i>
							</div>
						</li>
					</ul>
				</div>
				<div class="nomorefoods" v-show="isEnd">没有更多的商品了</div>
			</div>
		</div>
	</template>


	<script>

		export default {
			created(){
				//获取index数据

				axios("/api/couplelist/index").then(res=>{
					// console.log(res);
					this.categorylist = res.data.data.subButtonList;
				}).catch(error=>{

				})
			},

			beforeRouteEnter(to,from,next){

				next(vm=>{
					vm.loading= false; //可以加无限加载了
					// console.log(vm.$emit);
					vm.$emit("scrolltop"); //进来之前， 滚动条滚动最上面
				});
			},

			beforeRouteLeave(to,from,next){
				this.loading = true; //禁用无限加载， fixed bug by kerwin
				next();
			},

			data(){
				return {
					categorylist:[],
					recommendlist:[],
					currentpage:0,
					loading:false ,//false 表示不禁用无限滚动
					isEnd:false,
					totalPage:0
				}
			},
			methods:{
				
				getRecommendList(num,callback){
					axios.get('/api/couplelist/product',{
						params: {
					      num: num
					    }
					}).then(res=>{
					  	// console.log(res.data);
					  	this.recommendlist =[...this.recommendlist,...res.data.data.list];
					  	this.totalPage = res.data.data.totalPage;
					  	callback && callback();
					  })
					  .catch(function (error) {
					    console.log(error);
					  });
				},
				loadMore(){
					

					this.loading = true; //禁用无限加载
					this.getRecommendList(++this.currentpage,()=>{
						
						if(this.currentpage<this.totalPage){
							this.loading= false; //启用无限加载
						}else{
							this.isEnd=true;
							this.loading= true; //禁用无限加载， 所有的数据请求完了已经
						}
					});
				},

				
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
			}

			.content{
				padding-top:44px;
				.search{
					background:white;
					display: block;
				    position: relative;
				    padding: .625rem;
				    color:#b4b4b4;
				    input{
				    	display:block;
				    	outline:none;
				    	border:0px;
				    	height: 1.5625rem;
				    	width:100%;
						line-height:44px;
						padding:0px 30px;
						background:#f7f7f7;
				    }

				    i{
				    	position:absolute;
				    	top: 1rem;
   						left: 1.25rem;
				    }
				}

				.category{
					display: -webkit-box;
				    display: -webkit-flex;
				    display: -ms-flexbox;
				    display: flex;
				    width: 100%;
				    margin-top:10px;
					li{
						-webkit-box-flex: 1;
						-webkit-flex:1;
						flex:1;
						text-align:center;
						padding:10px;
						background:#fff;
						img{
							width: 2.5rem;
   							height: 2.5rem;
						}

						span{
							margin-top: .3125rem;
						    font-size: .75rem;
						    text-align: center;
						    color: #959595;
						}
					}
				}

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
							.tuantext{
								padding: 0.375rem 0.5rem;
	   							height: 1.5625rem;
	   							position:absolute;
	   							bottom:10px;
	   							right:10px;
	   							background-size:cover;
	   							border-radius: .25rem;
	   							background: #f55;
	   							line-height: 0.8125rem;
							    font-size: .75rem;
							    color: #fff;
							    i{
							    	font-size:0.8125rem;
							    	font-weight: bold;
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
			}
	</style>


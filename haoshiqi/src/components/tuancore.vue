	<template>
			<div class="content">
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
	</template>


	<script>

		export default {
			created(){

			},

			beforeRouteEnter(to,from,next){

				next(vm=>{
					vm.loading= false; //可以加无限加载了
				});
			},

			beforeRouteLeave(to,from,next){
				this.loading = true; //禁用无限加载， fixed bug by kerwin
				next();
			},

			data(){
				return {
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
		
			.content{
				padding-top:44px;
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


	<template>
			<div class="core">
				<div class="recommendlistContainer">
					<ul class="recommendlist"   
						v-infinite-scroll="loadMore"
	  					infinite-scroll-disabled="loading"
	  					infinite-scroll-distance="0">
						<li v-for="(data,index) in recommendlist" @click="handleClick">
							<img :src="data.skuPic"/>

							<div class="text">
								<h3>{{data.coupleTitle}}</h3>
								<p>￥{{data.couplePrice |formatNumber}}<span>{{data.marketPrice|formatNumber}}</span></p>
							</div>

							<div class="tuantext">
								{{'暂不支持'}}<i class="iconfont icon-more"></i>
							</div>
						</li>
					</ul>
				</div>
				<div class="nomorefoods" v-show="isEnd">没有更多的商品了</div>
				
			</div>
	</template>


	<script>
		import { Indicator } from 'mint-ui';
		export default {
			created(){

			},

			props:["load","data","url"], 
			//load 是父组件传来的属性值 ，因为在子组件中还要修改这个值，所以建议放在计算属性中（否则控制台报错），false 表示不禁用无限滚动


			computed:{
				
			},

			watch:{
				
			},

			data(){
				return {
					recommendlist:[],
					currentpage:0,
					isEnd:false,
					totalPage:0,
					loading:this.load
				}
			},


			methods:{
				
				getRecommendList(num,callback){
					
					axios.get(this.url,{
						params: Object.assign({num: num},this.data) //合并对象
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
					
					Indicator.open();
					this.loading = true; //禁用无限加载 ，直接改变计算属性
					this.getRecommendList(++this.currentpage,()=>{
						
						if(this.currentpage<this.totalPage){
							this.loading= false; //启用无限加载，直接改变计算属性
						}else{
							this.isEnd=true;
							this.loading= true; //禁用无限加载， 所有的数据请求完了已经，，直接改变计算属性
						}
						Indicator.close();
					});
				},

				handleClick(){
					console.log(this.data);
				}
			}

		}
	</script>


	<style lang="scss" scoped>
		
			.core{
				 
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
	   							background: gray;
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


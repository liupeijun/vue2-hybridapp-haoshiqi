	<template>
		<div class="tuansearchroot">
		
			<div class="header">
				<div>
					<span class="left button" @click="handleBack()">返回</span>
					<span class="right button"><i class="iconfont icon-all" @click="handleHome()"></i></span>
					{{title}}
				</div>
				<div class="filter">
					<div class="tag" @click="direction1= !direction1;direction2=false;filterIndex=0" :class="filterIndex==0?'active':''">{{filtername}}<i class="iconfont" :class="direction1?'icon-less':'icon-moreunfold'"></i>
					</div>
					<div class="tag" @click="direction1= false;direction2=false;filterIndex=1;resetState();params.sort='selled';loadMore()" :class="filterIndex==1?'active':''">销量</div>
					<div class="tag" @click="direction2= !direction2;direction1=false;filterIndex=2" :class="filterIndex==2?'active':''">筛选<i class="iconfont" :class="direction2?'icon-less':'icon-moreunfold'"></i></div>

					<ul class="filterlist" v-show="direction1">
							<li @click="direction1= false;secondFilterIndex=0;filtername='综合排序';resetState();loadMore()" :class="secondFilterIndex==0?'active':''">综合排序</li>
							<li @click="direction1= false;secondFilterIndex=1;filtername='价格从低到高';resetState();params.sortType=0;loadMore()" :class="secondFilterIndex==1?'active':''">价格从低到高</li>
							<li @click="direction1= false;secondFilterIndex=2;filtername='价格从高到低';resetState();params.sortType=1;loadMore()" :class="secondFilterIndex==2?'active':''">价格从高到低</li>
					</ul>


				</div>
			</div>

			<transition name="slide">
				<div class="rightlist" v-show="direction2">
					<div class="header">
						<span class=" button" @click="direction2= false;">关闭</span>
						<div>筛选</div>
					</div>

					<ul class="content" @click="secondlist=true">
						<li @click="selectFilterOptions(1)">
							产地
							<div >{{selectCountry}}<i class="iconfont icon-more"></i></div>
						</li>
						<li @click="selectFilterOptions(2)">
							价格
							<div >{{selectPrice}}<i class="iconfont icon-more"></i></div>
						</li>
					</ul>

					<div class="footer">
						<span class="cancel" @click="direction2= false;">重置</span>
						<span  @click="direction2= false;resetState();params.area=selectCountry;loadMore()">确定</span>
					</div>
				</div>
			</transition>
			
			<transition name="slide">

				<div class="rightlist2" v-show="secondlist">
					<div class="header">
						<span class=" button" @click="secondlist=false"><i class="iconfont icon-back"></i></span>
						<div>筛选</div>
					</div>

					<ul class="content">

						<li v-for="data in options" @click="secondlist=false;handleOptionsClick(data)"> 
							<!-- 可以写一系列表达式 -->

							{{data.start!=undefined?formatNumber(data.start )+(data.end?'-'+formatNumber(data.end):"以上"):data}}

							<!-- 无法使用指令来过滤 2200 ====> 22:00,改用方法 -->
						</li>
					</ul>
					
				</div>
			</transition>

			<div class="cover1" v-show="direction1">
				
			</div>
			<div class="cover2" v-show="direction2">
				
			</div>
			
			<!-- 这个组件是在params 变量初始化完成后才会render -->
				<tuancore :loading="isNeedLoading" :load-more="loadMore" :recommendlist="recommendlist" :isEnd="isEnd"></tuancore>
			
		</div>
	</template>


	<script>
		import router from "../router";
		import tuancore  from "./tuansearchcore.vue"; //引入组件
		import { Indicator } from 'mint-ui';
		let  CancelToken ;
		let  source ;
		export default {

			mounted(){
				//进行ajax请求
				axios.get(`${process.env.URL}/couplelist/search/config`).then(res=>{
					this.productionAreaOptions = res.data.data.productionAreaOptions;
					this.priceOptions = res.data.data.priceOptions;
				})
			},

			beforeRouteEnter(to,from,next){


				next(vm=>{
					vm.title = vm.$route.query.text; 
					vm.params.text = vm.$route.query.text; 
					vm.isNeedLoading = false;

					//每次进入路由重新设置cancel token 可以source.cancel取消数据请求
					CancelToken = axios.CancelToken; 
					source = CancelToken.source(); 
					
					vm.resetData();
					vm.resetState();
					vm.loadMore();
				})
			},

			beforeRouteLeave(to,from,next){
				this.isNeedLoading = true;
				source.cancel();
				next();
			},


			data(){
				return {
					title:"",
					direction1:false,
					direction2:false,
					isNeedLoading:false,
					filterIndex:0,
					secondFilterIndex:0,
					secondlist:false,
					priceOptions:[],
					productionAreaOptions:[],
					options:[], //产地 或者价格筛选
					selectCountry:"全部",
					selectPrice:"全部",
					params:{text:""},
					filtername:'综合排序' ,//过滤的title

					currentpage:0,
					isEnd:false,
					totalPage:0,
					recommendlist:[]
				}
			},


			methods:{
				handleBack(){
					router.go(-1); //返回上个页面
				},

				handleHome(){
					router.push({path:"/home"}); //回到首页
				},

				selectFilterOptions(data){
					this.options = data==1?this.productionAreaOptions:this.priceOptions;
				},

				formatNumber(value){
					var value = value.toString();
					if(value==0){
						return value;
					}else{
						return value.slice(0,-2)
					}
            		
				},

				handleOptionsClick(data){
					// console.log(data);
					if(this.options[0].start==undefined){ //表示筛选的是产地
						this.selectCountry = data;
					}else{
						this.selectPrice =this.formatNumber(data.start )+(data.end?'-'+this.formatNumber(data.end):"以上");
					}

				},


				getRecommendList(num,callback){
					
					axios.get(`${process.env.URL}/couplelist/search/activities`,{
						cancelToken: source.token, //设置token(所有的请求的都是同一个token)
						params: Object.assign({num: num},this.params) //合并对象
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
					this.isNeedLoading = true; //禁用无限加载 ，直接改变计算属性
					this.getRecommendList(++this.currentpage,()=>{
						
						if(this.currentpage<this.totalPage){
							this.isNeedLoading= false; //启用无限加载，直接改变计算属性
						}else{
							this.isEnd=true;
							this.isNeedLoading= true; //禁用无限加载， 所有的数据请求完了已经，，直接改变计算属性
						}

						Indicator.close();
					});
				},

				resetState(){
					
					//重置所有 团数据, loadmore 会重新加载所有的数据
					this.isNeedLoading=false;
					this.currentpage=0;
					this.isEnd=false;
					this.totalPage=0;
					this.recommendlist=[];
					this.params= {text:this.title};
					
				},

				resetData(){
					this.filterIndex=0;
					this.secondFilterIndex=0;
					this.selectCountry="全部";
					this.selectPrice="全部";
					this.filtername='综合排序' ;//过滤的title

				}
			},

			components:{
				tuancore
			}
		}
	</script>


	<style lang="scss" scoped>

			.tuansearchroot{
				position:relative;
				width:100%;
				height:100%;
				font-size: .875rem;
				padding-top:90px;
			}

			.cover{
				position:fixed;
				top:0px;
				left:0px;
				width:100%;
				height:100%;
				font-size: .875rem;
			}

			.cover1{
				 @extend .cover;
				 background:rgba(0,0,0,0.3);
				 z-index:2;
			}
			.cover2{
				 @extend .cover;
				 background:rgba(0,0,0,0.3);
				 z-index:888;
			}
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

				.filter{
					position:absolute;
					top:44px;
					left:0px;
					width:100%;
					
					.tag{
						border-bottom: 1px solid #e4e4e4;
						font-size: .75rem;
					    background: #fff;
					    color: #959595;
						text-align:center;
						float:left;
						width:33.333%;
						height:45px;
						background:white;
						position:relative;
						&:after{
							content: "";
						    position: absolute;
						    left: 0;
						    top: 50%;
						    width: 1px;
						    height: .9375rem;
						    margin-top: -.5rem;
						    background: #e4e4e4;
						}
						&.active{
							color:red;
						}
					}

					.filterlist{
						background:white;
						font-size:0.75rem;
						color: #959595;
						text-align:initial;
						z-index:999;
						li{
							padding-left:30px;
							border-bottom:1px solid #e4e4e4;
							&.active{
								color:red;
							}
						}
					}

				}
			}



			.rightlist,.rightlist2{
				position:fixed;
				right:0px;
				width:70%;
				background:#fff;
				height:100%;
				top:0px;
				z-index:999;
				.header{
					position:relative;
					font-size: .875rem;
					.button{
						position:absolute;
						left:0px;
						top:0px;
					}
				}

				.content{
					
					li{ 
						padding:10px;
						background:#fff;
						border-bottom:1px solid #e4e4e4;
						div{
							float:right;
							color: #b4b4b4;
						}
					}
					
				}

				.footer{
					position:absolute;
					bottom:0px;
					left:0px;
					width:100%;
					background:#fff;
					height:50px;

					span{
						float:left;
						width:50%;
						text-align:center;
						line-height:50px;
						background:#f55;
						color:white;

						&.cancel{
							background:#fdebed;
							color:#f55;
						}
					}
				}
			}

			.rightlist2{
				z-index:1000;
			}

			//动画
	        .slide-enter-active{
	            animation: s-enter .5s;
	            -webkit-animation: s-enter .5s;
	        }
	        .slide-leave-active{
	            animation: s-leave .5s;
				-webkit-animation: s-leave .5s;
	        }
	        @keyframes  s-enter{
	            0%{
	                transform: translate(100%,0px);
	            }
	            100%{
	                transform: translate(0px,0px);
	            }
	        }
	       	@-webkit-keyframes  s-enter{
	            0%{
	                -webkit-transform: translate(100%,0px);
	            }
	            100%{
	                -webkit-transform: translate(0px,0px);
	            }
	        }
	        @keyframes  s-leave{
	            0%{
	                transform: translate(0px,0px);
	            }
	            100%{
	                transform: translate(100%,0px);
	            }
	        }
	        @-webkitkeyframes  s-leave{
	            0%{
	                -webkit-transform: translate(0px,0px);
	            }
	            100%{
	                -webkit-transform: translate(100%,0px);
	            }
	        }

	</style>


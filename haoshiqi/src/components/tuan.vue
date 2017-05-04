	<template>
		<div kerwin>
		
			<div class="header">
				拼团
			</div>
			<div class="content">
				<div class="search">
					<i class="iconfont icon-search"></i>
					<div style="margin-right:40px;"><input type="text" placeholder="搜索拼团商品" v-model="searchtext"/></div>
					<span class="searchbtn" @click="handleSearch(searchtext)">搜索</span>
				</div>

				<ul class="category">
					<li v-for="(data,index) in categorylist" @click="handleSearch(data.label)">
						<img :src="data.icon"/>
						<span>{{data.label}}</span>
					</li>
				</ul>

				<tuancore :load="isNeedLoading" :url="url"></tuancore>

				<!-- 通过属性 传给子组件 isNeedLoading 是true 还是false 来判断是否该进行滚动加载功能 -->
			</div>
		</div>
	</template>


	<script>
		import tuancore  from "./tuancore.vue"; //引入组件
		import router from "../router";
		export default {
			created(){
				//获取index数据

				axios(`${process.env.URL}/couplelist/index`).then(res=>{
					// console.log(res);
					this.categorylist = res.data.data.subButtonList;
				}).catch(error=>{

				})
			},

			beforeRouteEnter(to,from,next){

				next(vm=>{
					vm.isNeedLoading = false;
					vm.$emit("scrolltop"); //进来之前， 滚动条滚动最上面
				});
			},

			beforeRouteLeave(to,from,next){
				this.isNeedLoading = true;
				next();
			},

			data(){
				return {
					categorylist:[],
					isNeedLoading:false,
					searchtext:"",
					url:`${process.env.URL}/couplelist/product`
				}
			},
			methods:{
				
				handleSearch(searchtext){
					router.push({path:"/tuansearch",query:{text:searchtext}})
				}
				
			},
			components:{
			
				tuancore //注册组件
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
						// line-height:44px;
						padding:0px 30px;
						background:#f7f7f7;
						font-size:0.75rem;
				    }

				    i{
				    	position:absolute;
				    	top: 1rem;
   						left: 1.25rem;
				    }

				    .searchbtn{
				    	position: absolute;
					    right: 10px;
					    top: 0px;
					    line-height: 44px;
						color: #959595;
						font-size: .875rem;
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
						    display: block;
						}
					}
				}

				
			}
	</style>


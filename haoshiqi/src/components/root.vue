	<template>
		<div class="root" >
			<keep-alive>
				<router-view @scrolltop = "handleScrollTop()" kerwintest></router-view>

				<!--父子间通信 $emit  (router-view 上面的属性， 以及子路由根节点的属性 都会被保留)-->
			</keep-alive>
			
			<footer>
				<ul>
					<router-link tag="li" to="/home">
						<i class="iconfont icon-all"></i>
						<span>首页</span>
					</router-link>
					<router-link tag="li" to="/tuan">
						<i class="iconfont icon-supplierfeatures"></i>
						<span>拼团</span>
					</router-link>
					<router-link tag="li" to="/category">
						<i class="iconfont icon-category"></i>
						<span>分类</span>
					</router-link>

					<router-link tag="li" to="/shopcar">
						<i class="iconfont icon-cart"></i>
						<span>购物车</span>
					</router-link>
					<router-link tag="li" to="/me">
						<i class="iconfont icon-account"></i>
						<span>我的</span>
					</router-link>

				</ul>
			</footer>

			<div v-if="isShow" class="topIcon" @click="handleScrollTop()">
				
			</div>
		</div>
	</template>


	<script>
		export default {
			mounted(){
				//添加scroll监听事件
				window.addEventListener("scroll",this.handleScroll);
			},

			destroyed(){
				//移除scroll监听事件
				window.removeEventListener("scroll",this.handleScroll);
			},

			data(){
				return {
					isShow:false //是否显示返回顶部按钮
				}
			},

			methods:{
				handleScroll(){
					//获取原生dom节点 this.$refs.content

					if(document.body.scrollTop>1000){
						this.isShow =true;
					}else{
						this.isShow =false;
					}
				},
				handleScrollTop(){
					document.body.scrollTop=0;
				}
			}
		}
	</script>


	<style lang="scss" >
			.root{
				height:100%;
			}

			footer{
				position:fixed;
				bottom:0px;
				left:0px;
				width:100%;
				height:50px;
				border-top: .0625rem solid #e4e4e4;
				background:#f8f8f8;
				ul li {
					float:left;
					text-align:center;
					width:20%;
					line-height:20px;

					i{
						padding-top:5px;
						display:block;
						color:#be966c;

					}

					span{
						color:#914e07;
						font-size: .625rem;
					}
				}
			}

			.router-link-active i{
				color:rgba(255,238,17,1);
				font-weight:bold;
			}

			.router-link-active span{
				color:rgba(255,238,17,1);
				font-weight:bold;
			}

			.topIcon{
				position:fixed;
			    bottom: 3.125rem;
			    right: 1.25rem;
			    width:40px;
			    height:40px;
			    background-image:url(http://img1.haoshiqi.net/assets/hsqimg/btn_top.png);
				background-size:100% 100%;

			}
			
	</style>


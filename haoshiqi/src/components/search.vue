	<template>
		<div>
			<div class="header">
				<span class="left button" @click="handleBack()">返回</span>
				<span class="right button" @click="changeList(inputsearch)">搜索</span>
				<div class="search">
					<i class="iconfont icon-search"></i>
					<input type="text" placeholder="搜索您想找的商品"  autofocus v-model="inputsearch"/>
				</div>
			</div>
			<div class="content">
				<h3>热门搜索</h3>
				<ul class="hotlist">
					<li v-for="(data,index) in hotlist" @click="changeList(data.value)">
						{{data.value}}
					</li>
				</ul>
				<h3>最近搜索</h3>
				<p>暂无搜索记录</p>
			</div>
		</div>


	</template>


	<script>
		import router from "../router";
		import { Indicator } from 'mint-ui';
		export default {
			created(){
				Indicator.open();
				axios.get(`${process.env.URL}/search`).then(res=>{
					// console.log(res.data.data);
					this.hotlist= res.data.data.list;
					Indicator.close();
				}).catch(error=>{
					Indicator.close();
					console.log(error);
				})
			},

			data(){
				return {
					hotlist:[],
					inputsearch:"" //双向数据绑定
				}
			},
			methods:{
				handleBack(){
					router.go(-1); // 返回上一个页面
				},
				changeList(value){
					router.push({ path: '/list', query: { text: value }})
				}
			}
		}
	</script>


	<style lang="scss" scoped>
			.header{
					background:rgba(255,238,17,.9);
					display: block;
				    // position: relative;
				    padding: .625rem;
				    color:#b4b4b4;
				    .search{
				    	position: relative;
				    	margin:0px 3.125rem;
				    	input{
					    	display:block;
					    	outline:none;
					    	border:0px;
					    	height: 1.5625rem;
					    	width:100%;
							// line-height:44px;
							font-size:0.75rem;
							padding:0px 30px;
							background:#fff;
							border-radius: .25rem;
					    }

					    i{
					    	position:absolute;
					    	line-height: 1.5625rem;
	   						left: .5rem;
					    }
				    }

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
				    	line-height:1.5625rem;

				    	&:active{
				    		background:rgba(0,0,0,0.2)
				    	}
				    }
			}

			.content{
				h3{
					padding: .625rem;
				    margin-bottom: 0;
				    font-weight: 400;
				    color: #b4b4b4;
				    font-size: .875rem;
				}

				.hotlist{
					overflow:hidden;
					border-bottom:1px solid #e4e4e4;
					li{
						padding:10px;
						float:left;
						width:33.333%;
						text-align:center;
						background:white;
						border-top:1px solid #e4e4e4;
						font-size: .875rem;
						position:relative;
						&:after{
							content: "";
						    position: absolute;
						    top: .625rem;
						    right: 0;
						    height: 1.25rem;
						    border-right: .0625rem solid #e4e4e4;
						}
						&:active{
							background:#e4e4e4;
						}
					}
				}

				p{
					
					height:44px;
					line-height:44px;
					text-align:center;
					color:#b4b4b4;
					background:#fff;
					font-size: .875rem;
					border:1px solid #e4e4e4;
				}
			}
	</style>


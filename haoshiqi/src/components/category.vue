	<template>
		<div>
			<div class="header">
					<i class="iconfont icon-search"></i>
					<input type="text" placeholder="搜索您想找的商品" @focus="handleFocus()"/>
			</div>
			
			<div class="content">
				<ul class="list">
					<li v-for="(data,index) in list" class="item" >
						<h4 @click="handleClick(data.name,data.id)">
							{{data.name}}
							<i class="iconfont icon-more"></i>
						</h4>
						<ul class="sublist">
							<li v-for="(subdata,subindex) in data.subCategories" class="subitem" @click="handleClick(subdata.name,subdata.id)" >
								{{subdata.name}}
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</template>


	<script>
		import router from "../router";
		export default {

			created(){
				axios.get("/api/categorylist").then(res=>{
					// console.log(res.data.data);
					this.list = res.data.data.list;
				}).catch(error=>{
					console.log(error);
				})
			},

			data(){
				return {
					list:[]
				}
			},

			methods:{
				handleClick(text,id){
					router.push({ path: '/list',query:{text:text,id:id} });
				},

				handleFocus(){
					router.push({ path: '/search' });
				}
			}


		}
	</script>
 

	<style lang="scss" scoped>
		
		.header{
					background:rgba(255,238,17,.9);
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
						background:#fff;
				    }

				    i{
				    	position:absolute;
				    	top: 1rem;
   						left: 1.25rem;
				    }
		}

		.content {
			 .list{
			 	.item{

					background:white;
					
					margin-bottom:10px;

					h4{
						padding: .3125rem .625rem .3125rem 1.25rem;
					    background: #fff;
					    color: #252525;
					    font-weight:400;
					    font-size: .875rem;
						position:relative;
					    i{
					    	float:right;
					    	color: #b4b4b4;
					    	font-weight:bold;
					    }

					    &:before{
					    	content:"";
					    	display:block;
					    	position:absolute;
					    	left:5px;
					    	top:50%;
							width:2px;
							height:2px;
							margin-top:-1px;
							border:1px solid #f55;
							border-radius:50%;
							background:red;

					    }
					}
					.sublist{
						border-top:1px solid #e4e4e4;
						
						li{
							display:inline-block;
							border-radius: .125rem;
						    font-size: .75rem;
						    border: 1px solid #e4e4e4;
						    line-height: .875rem;
						    padding: .3125rem;	
							margin:3px 3px;

							&:active{
								background:#f8f8f8 ; //激活li 变色
							}
						}
					}
			 	}
			 }
		}
	</style>


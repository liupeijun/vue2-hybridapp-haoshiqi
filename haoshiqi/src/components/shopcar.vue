	<template>
		<div>
		
			<div class="header">
				<span>购物车</span>
				<!-- <span class="editbtn">编辑</span> -->
			</div>
			<div class="content">
				<dl v-for="(data,index) in shopData">
					<dt>

						<input type="checkbox"  v-model="data.isChecked" @click="handleChecked(data,$event)"/>
						{{data.name}} <b><i class="iconfont icon-more"></i></b>
					</dt>
					<dd>
						<ul >
							<li v-for="(childitem,childindex) in data.children" >
								<input type="checkbox"  v-model="childitem.isChecked" @click="handleChildChecked('shopitem'+index,data,childitem,$event)" :ref="'shopitem'+index"/>
								<span v-show="false">{{date}}</span>
								<div class="item">
									<img :src="childitem.thumbnail"/>
									<h3>{{childitem.name}}</h3>
									<div class="price">
										<span>￥{{childitem.lowest_price |formatNumber}}&nbsp;&nbsp;<del>￥{{childitem.market_price |formatNumber}}</del></span>
										<p>剩余{{childitem.left_stock}}件</p>
									</div>
									<div class="number">
										<span class="del" @click="handleDel(childitem)"><b>-</b></span>
										<input type="number" v-model="childitem.number"/>
										<span class="add" @click="childitem.number++"><b>+</b></span>
									</div>
								</div>
							</li>
						
						</ul>
					</dd>
				</dl>
				
			</div>

			<div class="footer" v-show="shopData.length">
				
					<div class="checkdiv">
						<input type="checkbox" @click="handleAll" />
						<p>全选</p>
					</div>
					<div class="sumbtn" @click="handlePay()">去结算</div>
					<div class="sum">
						合计:<span>￥{{sum()}}</span>
					</div>
				
				
			</div>
		
			<div class="emptyshopcar" v-show="!shopData.length">购物车空空如也</div>
		</div>
	</template>


	<script>
		import router from "../router";
		import { MessageBox } from 'mint-ui';
		import { Toast } from 'mint-ui';
		export default {

			mounted(){

			},

			data(){
				return{
					kerwinShopData:[],
					isChecked:false,
					date:""
				}
			},
		
			updated(){
				// console.log(1111);
			},
			computed:{
				originData(){
					return this.$store.state.shopcarData;
				},

				shopData(){
					//fixed bug (父子checkbox 联动)
					this.kerwinShopData = this.$store.getters.ProcessedShopData; 
					//加上这句话，checkbox的 isChecked 双向数据绑定才好用 (vue 的bug? 还是机制?)
					
					return this.$store.getters.ProcessedShopData; //只要依赖的元素发生改变， 计算属性会重新计算。
				},

				
			},

			methods:{
				handleDetailClick(id){
					router.push({path:"/detail",query:{id:id}});
				},
				handleDel(item){
					if(--item.number==0){
						MessageBox(
							{
							  title: '提示',
							  message: '你要把此商品从购物车删除吗?',
							  closeOnClickModal: false,
							  showCancelButton:true
							}).then(action => {
								if(action=="cancel"){
									item.number =1;	
								}else{
									this.$store.dispatch("DEL_DATA",{
							  			
							          product_id:item.product_id
							       	});
								}
						})

					}
				},

				handleChecked(data,ev){
					// console.log(ev.target.checked);
					data.children.forEach(item=>{
							item.isChecked =ev.target.checked;
					})
				},
				handleChildChecked(data,item,childitem,ev){
					
					var isChecked =this.$refs[data].every(item=>item.checked==true);
					item.isChecked =isChecked;
					childitem.isChecked = ev.target.checked;

					this.date= new Date(); //fixed bug 
				},

				handleAll(ev){
					console.log(ev.target.checked);
					this.shopData.forEach(item=>{

						item.isChecked= ev.target.checked;
						item.children.forEach(childitem=>{
							childitem.isChecked = ev.target.checked;
						})
					})
				},

				sum(){
					var sum =0;

					this.shopData.forEach(item=>{
						item.children.forEach(childItem=>{
							if(childItem.isChecked){
								sum+=childItem.number*(childItem.lowest_price/100)
							}
						})
					})
 
					return sum.toFixed(2);
				},

				handlePay(){
					let instance = Toast('暂未开通,感谢支持');
					setTimeout(() => {
					  router.push({path:"/me"});
					}, 2000);
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

    			.editbtn{
    				position:absolute;
    				right:10px;
    				top:0px;
    				font-size: 0.875rem;
    			}
			}

			.content{
				font-size: 0.875rem;
				
				padding-top:44px;
				padding-bottom:100px;
				dl{
					background:#fff;
					margin-bottom:10px;
					padding:0px 10px;
				}
				dt{
					padding:10px 0px;
					border-bottom:1px solid #e4e4e4;
				}
				dd{
					padding:10px 0px;
					input[type=checkbox]{
						vertical-align: top;
						float:left;
					}

					li{
						position:relative;
						margin-bottom:8px;
					}
					.item{
						// display:inline-block;
						
						overflow:hidden;

						img{
							float:left;
							width:50px;
							height:50px;
						}
						h3{
							// width:100%;
							overflow:hidden;
							padding-left:10px;
						    font-style: normal; 
						    font-weight: 400;
						    font-size:0.8rem;
						}
						.price{
							width:100%;

    						overflow: hidden;
    						span{
    								white-space: nowrap;
								    display: inline-block;
								    font-style: normal;
								    font-size: 1rem;
								    color: #f55;
									font-weight: bold;
								    del{
								    	color: black;
								    	font-weight: 100;
								    	font-size: .875rem;
								    }
    						}
    						p{
    							font-size: .875rem;
    							color:gray;
    						}
						}
						.number{
							position:absolute;
							right:0px;
							bottom:20px;
							input{
								width:30px;
								outline:none;
								// border:0px;
								text-align:center;
								margin:0px 10px;
							}

							.del{
								font-size:1.25rem;
								
							}

							.add{
								color: #f55;
								font-size:1.25rem;

							}
						}
					}
				}
			}

			.footer{
				font-size: 0.875rem;
				position:fixed;
				bottom:50px;
				left:0px;
				width:100%;
				height:50px;
				line-height:50px;
				background:#fff;

				.checkdiv{
					float:left;
					text-align:center;
					line-height:20px;
					padding:5px 10px;
				}

				.sum{
					float:right;
					padding:0px 10px;
					span{
					    white-space: nowrap;
						display: inline-block;
						font-style: normal;
						font-size: 1rem;
						color: #f55;
						font-weight: bold;
					}
				}

				.sumbtn{
					float:right;
					// line-height: 3.125rem;
					width:100px;
				    font-size: 1.125rem;
				    background: #f55;
				    color: #fff;
				    text-align: center;
				}
			}


			.emptyshopcar{
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


	<template>
		<div class="user">
		
			<div class="header">
				个人中心
			</div>

			<div class="content">
				<img :src="url" @click="handlePhotoClick"/>

				<p>Kerwin</p>

				
			</div>
			<div class="testuser" >只为学习交流使用</div>
			<mt-actionsheet
			  :actions="actions"
			  v-model="sheetVisible">
			</mt-actionsheet>
		</div>
	</template>


	<script>
		import { Actionsheet } from 'mint-ui';

		export default {
			data(){
				return {
					url:"http://img1.haoshiqi.net/assets/hsqimg/couple/usericon_normal.png",
					actions:[{name:"拍照",method:this.takephoto},{name:"从相册中选择",method:this.selectphoto}],
					sheetVisible:false
				}
			},
			methods:{
				handlePhotoClick(){
					this.sheetVisible= true;
				},
				takephoto(){
					var _this =this;
					this.sheetVisible= false;
					navigator.camera.getPicture(onSuccess, onFail, { quality: 30 });

					function onSuccess(imagepath) {
					   _this.url = imagepath;
					}
					function onFail(message) {
					   
					}
				},
				selectphoto(){
					var _this =this;
					this.sheetVisible= false;
					navigator.camera.getPicture(onSuccess, onFail, { quality: 30,
						sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
 					});

					function onSuccess(imagepath) {
					   _this.url = imagepath;
					}
					function onFail(message) {
					   
					}
				}
			}
		}
	</script>


	<style lang="scss" scoped>

			.user{
				overflow:hidden;
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
			}

			.content{
				margin-top:44px;
	
				height:80px;
				background:#fff;
				overflow:hidden;
				img{
					    width: 3.75rem;
					    height: 3.75rem;
					    background: #dfdfdf;
					    border-radius:50%;
					    float:left;
					    margin:10px;
				}

				p{
					line-height:80px;
					overflow:hidden;
					padding-left:10px;
				}


			}
			.testuser{
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


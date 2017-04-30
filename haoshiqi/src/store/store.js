import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
	state:{

		shopcarData:[]
	},

	actions:{
		//可以是异步操作
		ADD_DATA:(store,data)=>{
			store.commit("ADD_DATA_MUTATION",data);
		},

		DEL_DATA:(store,data)=>{
			store.commit("DEL_DATA_MUTATION",data);
		},

		UPDATE_DATA:(store,data)=>{
			store.commit("UPDATE_DATA_MUTATION",data);
		}

	},

	mutations:{
		//必须是同步操作
		ADD_DATA_MUTATION:(state,data)=>{
			// console.log(data);
			// 去重
			let merchant  =state.shopcarData.filter(item=>item.product_id==data.product_id);
			merchant.length?merchant[0].number+=data.number:state.shopcarData.push(data);

			state.shopcarData.filter(item=>item.isChecked ==undefined).forEach(item=>{
				item.isChecked= false; //初始化isChecked
			})
		},

		DEL_DATA_MUTATION:(state,data)=>{
			// console.log(data);
			state.shopcarData.forEach((item,index)=>{
				if(item.product_id==data.product_id){
					state.shopcarData.splice(index,1);
				}
			})
		},

		UPDATE_DATA_MUTATION:(state,data)=>{
			// console.log(data);
			state.shopcarData.forEach((item,index)=>{
				if(item.product_id==data.product_id){
					item.isChecked = data.isChecked;
				}
			})
		}
	},

	getters:{
		ProcessedShopData(state){
			
			//处理数据(将相同商家的产品进行归类， 给shopcar页面输出)
			let merchants = [];

			state.shopcarData.forEach(item=>{

				if(!merchants.some(merchant=>merchant.id==item.merchant_id)){

					merchants.push({id:item.merchant_id,name:item.merchant_name,isChecked:false});
				}
			})

			merchants.forEach(merchant=>{
				merchant.children =state.shopcarData.filter(item=>item.merchant_id==merchant.id);

				//判读是否子元素全部选中
				merchant.children.every(item=>item.isChecked==true)?merchant.isChecked=true:merchant.isChecked=false;
			})

			return merchants;
		}
	}

}) 

export default store;

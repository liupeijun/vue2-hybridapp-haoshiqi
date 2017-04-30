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
		}

	},

	mutations:{
		//必须是同步操作
		ADD_DATA_MUTATION:(state,data)=>{
			// console.log(data);
			// 去重
			let merchant  =state.shopcarData.filter(item=>item.product_id==data.product_id);
			merchant.length?merchant[0].number+=data.number:state.shopcarData.push(data);
		},

		DEL_DATA_MUTATION:(state,data)=>{

		}
	},

	getters:{
		ProcessedShopData(state){
			//处理数据(将相同商家的产品进行归类， 给shopcar页面输出)
			let merchants = [];

			state.shopcarData.forEach(item=>{

				if(!merchants.some(merchant=>merchant.id==item.merchant_id)){
					merchants.push({id:item.merchant_id,name:item.merchant_name});
				}
			})

			merchants.forEach(merchant=>{
				merchant.children =state.shopcarData.filter(item=>item.merchant_id==merchant.id);
			})

			return merchants;
		}
	}

}) 

export default store;

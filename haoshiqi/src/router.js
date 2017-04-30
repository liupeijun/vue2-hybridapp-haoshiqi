import Vue from 'vue';
import VueRouter from 'vue-router';
import Root from "./components/root.vue";
import Home from "./components/home.vue";
import Tuan from "./components/tuan.vue";
import Category from "./components/category.vue";
import Shopcar from "./components/shopcar.vue";
import Me from "./components/me.vue";
import Search from "./components/search.vue";
import List from "./components/list.vue";
import Detail from "./components/detail.vue";
import Tuansearch from "./components/tuansearch.vue";

Vue.use(VueRouter);

const routes = [
  {
    path:"/search",
    component:Search   //serch 要独立于root之外， 不属于root的子路由
  },

  {
    path:"/tuansearch",
    component:Tuansearch
  },

  {
    path:"/list",
    component:List
  },

  {
    path:"/detail",
    component:Detail
  },

  { path: '/', 

  	redirect:"/home",

  	component:Root,

  	children:[

  		{
  			path:"home",
  			component:Home
  		},
  		{
  			path:"tuan",
  			component:Tuan
  		},
  		{
  			path:"category",
  			component:Category
  		},
  		{
  			path:"shopcar",
  			component:Shopcar
  		},
  		{
  			path:"me",
  			component:Me
  		}
  	]
  }
]


const router = new VueRouter({
	routes
}) //加载所有模块(组件是按需加载)

export default router;



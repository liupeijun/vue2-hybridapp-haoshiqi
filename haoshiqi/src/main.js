import 'babel-polyfill'; //部分ES6 api 不会转码，需要引入这个库
import Vue from 'vue';
import router from "./router";
import App from "./app.vue";
import store from "./store/store";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css';
import "./assets/iconfont/iconfont.css";
Vue.use(MintUI);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

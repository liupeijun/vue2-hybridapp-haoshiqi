import Vue from 'vue';
import router from "./router";
import App from "./app.vue";
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css';
import "./assets/iconfont/iconfont.css";
Vue.use(MintUI);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

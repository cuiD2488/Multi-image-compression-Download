// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import 'lib-flexible/flexible.js'
import { WechatPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin, Toast } from 'vux'

Vue.config.productionTip = false
Vue.use(WechatPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Toast)
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'yd7fa7e13c45f02c5ab606f328c6bf2b7',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

// 登陆控制
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

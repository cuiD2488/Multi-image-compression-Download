// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import store from './store'
import 'iview/dist/styles/iview.css'
import utils from './lib/utils'

Vue.use(iView)
Vue.prototype.utils = utils
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  window.document.title = to.meta.title || '云尚停车商户管理'
  if (!sessionStorage.getItem('userInfo') && to.name !== 'login') {
    iView.Message.info('请先登录')
    next({
      name: 'login'
    })
  } else {
    let breadcrumbList = []
    if (to.meta.parent) {
      let route = router.options.routes[0].children.find((n) => {
        return n.name === to.meta.parent
      })
      breadcrumbList = [route]
    }
    breadcrumbList = [...breadcrumbList, ...to.matched.slice(1)]
    store.commit('SET_BREADCRUMB', breadcrumbList)
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: { name: 'parkingList' },
      component: reslove => { require(['../layout/default'], reslove) },
      children: [
        {
          path: 'parkingRecord',
          name: 'parkingRecord',
          meta: {
            title: '停车记录'
          },
          component: reslove => { require(['../views/parkingRecord'], reslove) }
        },
        {
          path: 'parkingList',
          name: 'parkingList',
          meta: {
            title: '停车场管理'
          },
          component: reslove => { require(['../views/parkingList'], reslove) }
        },
        {
          path: 'home',
          name: 'home',
          component: reslove => { require(['../views/home'], reslove) }
        },
        {
          path: 'pakingMGTlist',
          name: 'pakingMGTlist',
          meta: {
            title: '车位管理列表'
          },
          component: reslove => { require(['../views/pakingMGTlist'], reslove) }
        },
        {
          path: 'deviceMGT',
          name: 'deviceMGT',
          meta: {
            title: '设备管理'
          },
          component: reslove => { require(['../views/deviceMGT'], reslove) }
        },
        {
          path: 'unpaid',
          name: 'unpaid',
          meta: {
            title: '待支付停车信息'
          },
          component: reslove => { require(['../views/unpaid'], reslove) }
        },
        // {
        //   path: 'parkingChargeRecord',
        //   name: 'parkingChargeRecord',
        //   meta: {
        //     title: '停车收费记录'
        //   },
        //   component: reslove => { require(['../views/parkingChargeRecord'], reslove) }
        // },
        {
          path: 'role',
          name: 'role',
          meta: {
            title: '角色管理'
          },
          component: reslove => { require(['../views/role'], reslove) }
        },
        {
          path: 'chargerules',
          name: 'chargerules',
          meta: {
            title: '停车场收费规则'
          },
          component: reslove => { require(['../views/chargerules'], reslove) }
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          meta: {
            title: '用户信息'
          },
          component: reslove => { require(['../views/userInfo'], reslove) }
        },
        {
          path: 'violationrecord',
          name: 'violationrecord',
          meta: {
            title: '违停记录'
          },
          component: reslove => { require(['../views/violationrecord'], reslove) }
        },
        {
          path: 'menuAuthorization',
          name: 'menuAuthorization',
          meta: {
            title: '菜单授权'
          },
          component: reslove => { require(['../views/menuAuthorization'], reslove) }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: reslove => { require(['../views/login'], reslove) }
    },
    {
      path: '/regist',
      name: 'regist',
      meta: {
        title: '注册'
      },
      component: reslove => { require(['../views/regist'], reslove) }
    }
    // {
    //   path: '/*',
    //   name: 'error_404',
    //   meta: {
    //     title: '页面不存在'
    //   },
    //   component: reslove => { require(['../views/error_page/404.vue'], reslove) }
    // }
  ]
})

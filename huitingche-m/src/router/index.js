import Vue from 'vue'
import Router from 'vue-router'
import home from '@/iviews/home'
import layout from '@/layout/defalut'
import location from '@/iviews/location'
import Intelligence from '@/iviews/parking/Intelligence'
import bindTel from '@/iviews/mine/bindTel'
import mine from '@/iviews/mine'
import myWallet from '@/iviews/mine/myWallet'
import parkingRecord from '@/iviews/mine/parkingRecord'
import recharge from '@/iviews/mine/recharge'
import carMessage from '@/iviews/mine/carMessage'
import safety from '@/iviews/mine/safety'
import parkingRules from '@/iviews/parkingRules'
import billingDetail from '@/iviews/mine/billingDetail'
import report from '@/iviews/mine/report'
import bindAdmin from '@/iviews/mine/bindAdmin'
import lifeAssistant from '@/iviews/lifeAssistant'
import aroundServer from '@/iviews/aroundServer'
// const home = () => import('@/iviews/home')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: {name: 'home'},
      component: layout,
      children: [
        {
          path: 'home',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: home
        },
        {
          path: 'location',
          name: 'location',
          meta: {
            title: '查询附近车位'
          },
          component: location
        },
        {
          path: 'parkingRules',
          name: 'parkingRules',
          meta: {
            title: '收费规则'
          },
          component: parkingRules
        },
        {
          path: 'mine',
          name: 'mine',
          meta: {
            title: '个人中心'
          },
          component: mine
        },
        {
          path: '/mine/bindTel',
          name: 'bindTel',
          meta: {
            title: '注册'
          },
          component: bindTel
        },
        {
          path: '/mine/report',
          name: 'report',
          meta: {
            title: '违停举报'
          },
          component: report
        },
        {
          path: '/mine/myWallet',
          name: 'myWallet',
          meta: {
            title: '我的钱包'
          },
          component: myWallet
        },
        {
          path: '/mine/recharge',
          name: 'recharge',
          meta: {
            title: '充值'
          },
          component: recharge
        },
        {
          path: '/mine/parkingRecord',
          name: 'parkingRecord',
          meta: {
            title: '停车记录'
          },
          component: parkingRecord
        },
        {
          path: '/parking/Intelligence',
          name: 'Intelligence',
          meta: {
            title: '智能停车'
          },
          component: Intelligence
        },
        {
          path: '/mine/carMessage',
          name: 'carMessage',
          meta: {
            title: '车辆信息'
          },
          component: carMessage
        },
        {
          path: '/mine/safety',
          name: 'safety',
          meta: {
            title: '账号与安全'
          },
          component: safety
        },
        {
          path: '/mine/billingDetail',
          name: 'billingDetail',
          meta: {
            title: '账单明细'
          },
          component: billingDetail
        },
        {
          path: '/mine/bindAdmin',
          name: 'bindAdmin',
          meta: {
            title: '管理员注册'
          },
          component: bindAdmin
        },
        {
          path: 'lifeAssistant',
          name: 'lifeAssistant',
          meta: {
            title: '生活助手'
          },
          component: lifeAssistant
        },
        {
          path: 'aroundServer',
          name: 'aroundServer',
          meta: {
            title: '周边服务'
          },
          component: aroundServer
        }
      ]
    }
  ]
})

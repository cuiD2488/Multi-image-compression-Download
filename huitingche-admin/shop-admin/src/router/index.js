import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
// import cuponFormStep1 from '../../views/cuponForm'
Vue.use(Router)
const shopTitle = VueCookies.get('userInfo') ? VueCookies.get('userInfo').name : ''
// const shopTitle = '寰球正品'
export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: { name: 'home' },
      component: reslove => { require(['../layout/default'], reslove) },
      children: [
        {
          path: 'home',
          name: 'home',
          meta: {
            title: shopTitle + '商户管理系统 - 首页',
            breadname: '首页'
          },
          component: reslove => { require(['../views/home'], reslove) }
        },
        {
          path: 'enterpriseMsg',
          name: 'enterpriseMsg',
          meta: {
            title: shopTitle + '商户管理系统 - 商家信息',
            breadname: '商家信息'
          },
          component: reslove => { require(['../views/enterpriseMsg'], reslove) }
        },
        {
          path: 'settingFront',
          name: 'settingFront',
          meta: {
            title: shopTitle + '商户管理系统 - 页面设置',
            breadname: '页面设置'
          },
          component: reslove => { require(['../views/settingFront'], reslove) }
        },
        {
          path: 'merchant',
          name: 'merchant',
          meta: {
            title: shopTitle + '商户管理系统 - 子商户管理',
            breadname: '子商户管理'
          },
          component: reslove => { require(['../views/merchant'], reslove) }
        },
        {
          path: 'goods',
          name: 'goods',
          meta: {
            title: shopTitle + '商户管理系统 - 商品列表',
            breadname: '商品列表'
          },
          component: reslove => { require(['../views/goods'], reslove) }
        },
        {
          path: 'goods/new_good',
          name: 'new_good',
          meta: {
            title: shopTitle + '商户管理系统 - 新增商品',
            parent: 'goods',
            breadname: '新增商品'
          },
          component: reslove => { require(['../views/new_good'], reslove) }
        },
        {
          path: 'verify',
          name: 'verify',
          meta: {
            title: shopTitle + '商户管理系统 - 子商户商品审核',
            breadname: '子商户商品审核'
          },
          component: reslove => { require(['../views/verify'], reslove) }
        },
        {
          path: 'shopOrder',
          name: 'shopOrder',
          meta: {
            title: shopTitle + '商户管理系统 - 商城订单管理',
            breadname: '商城订单管理'
          },
          component: reslove => { require(['../views/shopOrder'], reslove) }
        },
        {
          path: 'dispatchingOrder',
          name: 'dispatchingOrder',
          meta: {
            title: shopTitle + '商户管理系统 - 已发货订单',
            breadname: '已发货订单'
          },
          component: reslove => { require(['../views/dispatchingOrder'], reslove) }
        },
        {
          path: 'refundOrder',
          name: 'refundOrder',
          meta: {
            title: shopTitle + '商户管理系统 - 退货订单',
            breadname: '退货订单'
          },
          component: reslove => { require(['../views/refundOrder'], reslove) }
        },
        {
          path: 'refundOrderInfo',
          name: 'refundOrderInfo',
          meta: {
            title: shopTitle + '商户管理系统 - 退货订单详情',
            breadname: '退货订单'
          },
          component: reslove => { require(['../views/refundOrder/refundOrderInfo'], reslove) }
        },
        {
          path: 'accredit',
          name: 'accredit',
          meta: {
            title: shopTitle + '商户管理系统 - 人员管理',
            breadname: '人员管理'
          },
          component: reslove => { require(['../views/accredit'], reslove) }
        },
        {
          path: 'reward',
          name: 'reward',
          meta: {
            title: shopTitle + '商户管理系统 - 奖励设置',
            breadname: '奖励设置'
          },
          component: reslove => { require(['../views/reward'], reslove) }
        },
        {
          path: 'wxconfig',
          name: 'wxconfig',
          meta: {
            title: shopTitle + '商户管理系统 - 公众号设置',
            breadname: '开发配置'
          },
          component: reslove => { require(['../views/wxconfig'], reslove) }
        },
        {
          path: 'wxmenu',
          name: 'wxmenu',
          meta: {
            title: shopTitle + '商户管理系统 - 公众号设置',
            breadname: '菜单设置'
          },
          component: reslove => { require(['../views/wxmenu'], reslove) }
        },
        {
          path: 'users',
          name: 'users',
          meta: {
            title: shopTitle + '商户管理系统 - 用户管理',
            breadname: '用户管理'
          },
          component: reslove => { require(['../views/users'], reslove) }
        },
        {
          path: 'statistics',
          name: 'statistics',
          meta: {
            title: shopTitle + '商户管理系统 - 统计分析',
            breadname: '统计分析'
          }
        },
        {
          path: 'view',
          name: 'view',
          meta: {
            title: shopTitle + '商户管理系统 - 页面设置',
            breadname: '页面设置'
          },
          component: reslove => { require(['../views/view'], reslove) }
        },
        {
          path: 'gift',
          name: 'gift',
          meta: {
            title: shopTitle + '商户管理系统 - 礼品中心',
            breadname: '礼品中心'
          },
          component: reslove => { require(['../views/gift'], reslove) }
        },
        {
          path: 'giftOrder',
          name: 'giftOrder',
          meta: {
            title: shopTitle + '商户管理系统 - 礼品订单',
            breadname: '礼品中心'
          },
          component: reslove => { require(['../views/giftOrder'], reslove) }
        },
        {
          path: 'cuponForm',
          name: 'cuponForm',
          redirect: { name: 'cuponFormStep1' },
          meta: {
            title: shopTitle + '商户管理系统',
            breadname: '优惠券设置'
          },
          component: reslove => { require(['../views/cuponForm'], reslove) },
          children: [
            {
              path: 'cuponFormStep1',
              name: 'cuponFormStep1',
              meta: {
                title: shopTitle + '商户管理系统',
                breadname: '优惠券设置-基础规则'
              },
              component: reslove => { require(['../views/cuponForm/step1'], reslove) }
            },
            {
              path: 'cuponFormStep2',
              name: 'cuponFormStep2',
              meta: {
                title: shopTitle + '商户管理系统',
                breadname: '优惠券设置-其他规则'
              },
              component: reslove => { require(['../views/cuponForm/step2'], reslove) }
            },
            {
              path: 'cuponFormStep3',
              name: 'cuponFormStep3',
              meta: {
                title: shopTitle + '商户管理系统',
                breadname: '优惠券设置-确认创建'
              },
              component: reslove => { require(['../views/cuponForm/step3'], reslove) }
            }
          ]
        },
        {
          path: 'cuponList',
          name: 'cuponList',
          meta: {
            title: shopTitle + '商户管理系统',
            breadname: '优惠券列表'
          },
          component: reslove => { require(['../views/cuponList'], reslove) }
        },
        {
          path: 'reconciliationChild',
          name: 'reconciliationChild',
          meta: {
            title: shopTitle + '商户管理系统',
            breadname: '子商户提点'
          },
          component: reslove => { require(['../views/reconciliationChild'], reslove) }
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
      path: '/*',
      name: 'error_404',
      meta: {
        title: '页面不存在'
      },
      component: reslove => { require(['../views/error_page/404.vue'], reslove) }
    }
  ]
})

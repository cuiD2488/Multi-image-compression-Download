<template>
  <div>
    <div style="margin:10px 20px;">
      <Button @click="$router.push({name: 'cuponForm'})">新增优惠券</Button>
    </div>
    <div style="margin:20px;">
      <tabledata
        ref = 'table'
        page-position="center" 
        border 
        :columns="tableColumns"
        :queryUrl="queryUrl"
        :queryData="queryData"
        type="json"
        :axiosType="axiosType"
        :current="page"
        :pageSize="num"
        ></tabledata>
    </div>
  </div>
</template>
<script>
import tabledata from '@/components/tabledata'
import {findCouponList} from '@/api'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      axiosType: 'GET',
      page: 1,
      num: 10,
      queryUrl: findCouponList,
      userInfo:  this.$cookies.get('userInfo'),
      queryData: {
        enterpriseId: this.$cookies.get('userInfo').id,
        coupon_status: 1
      },
      tableColumns: [
        {
          title: '优惠券名称',
          align: 'center',
          width: 110,
          key: 'coupon_name'
        },
        {
          title: '优惠券状态',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return (
              <div>{params.row.coupon_status === 1 ? '已激活' : '未激活'}</div>
            )
          }
        },
        {
          title: '优惠券门槛',
          align: 'center',
          width: 120,
          key: 'coupon_threshold'
        },
        {
          title: '优惠券总数量',
          align: 'center',
          width: 140,
          key: 'coupon_total'
        },
        {
          title: '优惠券每人限领数量',
          align: 'center',
          width: 110,
          key: 'max_quota'
        },
        {
          title: '生效日期',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return (
              <div>{this.utils.timeFormat(params.row.begin_time)}</div>
            )
          }
        },
        {
          title: '结束日期',
          align: 'center',
          width: 140,
          render: (h, params) => {
            return (
              <div>{this.utils.timeFormat(params.row.end_time)}</div>
            )
          }
        },
        {
          title: '是否可与其他优惠同时使用',
          align: 'center',
          render: (h, params) => {
            return (
              <div>{params.row.isSynchronous_use === 0 ? '只能单独使用' : '可以一同使用'}</div>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return (
              <div>
              <i-button type="text" onClick={
                () => {
                  console.log('删除')
                }
              }>删除</i-button>
              <i-button type="text" onClick={
                () => {
                  console.log('删除') 
                }
              }>{'停止发放'}</i-button>
              <i-button type="text" onClick={
                () => {
                  console.log('删除')
                }
              }>删除</i-button>
              </div>
            )
          }
        }
      ]
    }
  }
}
</script>

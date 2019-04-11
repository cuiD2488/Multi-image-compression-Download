<template>
  <div>
    <Form :label-width="120">
      <FormItem label="活动名">
        {{cuponeListForm.nameActivity}}
      </FormItem>
      <FormItem label="优惠券金额" prop="name">
        {{cuponeListForm.nameMoney}}
      </FormItem>
      <FormItem label="使用门槛" prop="name">
        订单金额达到{{cuponeListForm.limit}}可使用
      </FormItem>
      <FormItem label="有效期" prop="name">
        {{cuponeListForm.dateBging}} - {{cuponeListForm.dateEnd}}
      </FormItem>
      <FormItem label="备注" prop="name">
        {{cuponeListForm.desc}}      
      </FormItem>
      <FormItem label="用户可领个数" prop="name">
        {{cuponeListForm.cuponMax}}
      </FormItem>
      <FormItem label="发放总上限" prop="name">
        {{cuponeListForm.cuponUpperLimit}}
      </FormItem>
      <FormItem label="同时使用" prop="name">
        {{cuponeListForm.achieve === 0 ? '不是' : '是'}}
      </FormItem>
      <FormItem label="是否为商城通用券" prop="name">
        {{cuponeListForm.is_whole_field === 0 ? '不是' : '是'}}
      </FormItem>
      <FormItem>
      <Button type="primary" @click="handleSubmit()">确认创建</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
// import Axios from 'axios'
import {ApiSetShopCoupon} from '@/api'
export default {
  data () {
    return {
      cuponeListForm: {},
      userInfo: this.$cookies.get('userInfo')
    }
  },
  methods: {
    async handleSubmit () {
      // const data = {
      //   coupon_name: '优惠券活动',
      //   enterpriseId: -1,
      //   goodsId: 24,
      //   coupon_value: 1,
      //   coupon_threshold: 1.01,
      //   coupon_status: 1,
      //   coupon_total: 10,
      //   max_quota: 1,
      //   used_num: 0,
      //   is_send_num: 0,
      //   begin_time: '2018-08-01',
      //   end_time: '2018-08-03',
      //   isSynchronous_use: 0
      // }
      const data = {
        coupon_name: this.cuponeListForm.nameActivity,
        enterpriseId: this.userInfo.id,
        coupon_value: this.cuponeListForm.nameMoney,
        coupon_threshold: this.cuponeListForm.limit,
        coupon_status: 0,// 优惠券初始状态未激活
        coupon_total: this.cuponeListForm.cuponUpperLimit,// 优惠券发放总数量
        max_quota: this.cuponeListForm.cuponMax,// 每个用户限领数量
        used_num: 0,
        is_send_num: 0,
        begin_time: this.cuponeListForm.dateBging,
        end_time: this.cuponeListForm.dateEnd,
        isSynchronous_use: this.cuponeListForm.is_whole_field
      }
      // const res = await Axios.post('http://yssh.css-link.com/setShopCoupon.json', data)
      // const res = await Axios('http://yssh.css-link.com/setShopCoupon.json', {  
      //     method: 'POST',
      //     mode: 'no-cors',
      //     data: data,
      //     headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'Content-Type': 'application/json',
      //     },
      //     withCredentials: true,
      //     credentials: 'same-origin',
      //   })
      const res = await ApiSetShopCoupon(data)
      if (res.errorCode === 1) {
        this.$Message.success('新增优惠券成功')
        sessionStorage.removeItem('cuponeListForm')
        this.$router.push({name: 'cuponList'})
      } else {
        this.$Message.error('新增优惠券成功')
      }
      console.log(res)
    }
  },
  mounted () {
    this.cuponeListForm = JSON.parse(sessionStorage.getItem('cuponeListForm'))
  }
}
</script>


<template>
  <div class="infoPage">
    <div class="orderInfo">
      <!-- 顶部商品展示 -->
      <div class="topGood">
        <div class="imgDiv">
          <img :src="'http://' + refundInfo.imgURL" alt="">
        </div>
        <div class="centerTitle">
          <div class="goodsTitle">{{refundInfo.goodsName}}</div>
          <div class="attributeName" v-if="attributeName">{{refundInfo.attributeName}}</div>
          <div class="attributeName" v-else>&nbsp;</div>
          <div class="goodStatus">订单状态:{{refundInfo.refundState === 0 ? '待处理' : refundInfo.refundState === 1 ? '退款失败' : refundInfo.refundState === 2 ? '退款成功' : '同意申请退款'}}</div>
          <div class="orderBtn">
            <span v-if="refundInfo.refundState === 0 && refundInfo.orderStatus === 1" @click="toChoose(2)">同意退款申请</span>
            <span v-if="refundInfo.refundState === 0 && refundInfo.orderStatus === 1" @click="toChoose(1)">拒绝退款申请</span>
            <span v-if="refundInfo.refundState === 0 && refundInfo.orderStatus > 1 && refundInfo.orderStatus < 4" @click="toChoose(3)">填写物流</span>
          </div>
        </div>
        <div class="rightNumber">订单编号:{{refundInfo.orderNo}}</div>
      </div>
      <!-- 退款订单展示 -->
      <div class="backgroundLine" style="margin-bottom:10px;margin-top: 50px;">退款订单信息:</div>
      <div class="backgroundLine">
        <div class="thirtyDiv">下单账号:{{refundInfo.nickName}}</div>
        <div class="thirtyDiv">联系电话:{{refundInfo.phone}}</div>
        <div class="thirtyDiv">退款申请时间:{{utils.timeFormat(refundInfo.createTime, 'yyyy-MM-dd HH:mm:ss')}}</div>
        <div class="thirtyDiv">订单总金额:{{refundInfo.orderMoney}}</div>
        <div class="thirtyDiv">退款金额:{{refundInfo.money}}</div>
        <div class="thirtyDiv">退款原因:{{refundInfo.reasonName}}</div>
        <div>退货说明:{{refundInfo.refundInstruction}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.infoPage{
  padding: 47px 24px;
}
.topGood{
  display: flex;
}
.imgDiv{
  width: 135px;
  height: 135px;
  img{
    width: 135px;
    height: 135px;
  }
}
.centerTitle{
  display: flex;
  flex-direction: column;
  width: 570px;
  font-size: 16px;
  margin-left: 25px;
  .goodStatus{
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  .orderBtn{
    height: 40px;
    display: flex;
    align-items: flex-end;
    span{
      font-size: 14px;
      border: 1px solid #cecece;
      background: #fff;
      color: #808080;
      padding: 2px 14px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
.rightNumber{
  flex-grow: 1;
  text-align: right;
  font-size: 16px;
}
.backgroundLine{
  padding: 24px 30px;
  background-color: #f5f5f5;
  font-size: 16px;
  div{
    line-height: 50px;
  }
  .thirtyDiv{
    display: inline-block;
    width: 30%;
  }
}
</style>
<script>
import {ApiUpdateRefundRecord, ApiGetRefundOrder} from '@/api'
export default {
  data () {
    return {
      refundInfo: null
    }
  },
  methods: {
    // 后台退款处理函数
    async toChoose (n) {
      let data = {
        refundState: n,
        outRefundNo: this.refundInfo.outRefundNo
      }
      const res = await ApiUpdateRefundRecord(data)
      if (res.errorCode === 1) {
        this.$Message.success(res.msg)
        this.getRefundOrderInfo()
      }
    },
    // 根据编号查询退款订单信息并刷新数据
    async getRefundOrderInfo () {
      let data = {
        enterpriseId: this.$cookies.get('userInfo').id,
        outRefundNo: this.refundInfo.outRefundNo
      }
      const res = await ApiGetRefundOrder(data)
      if (res.errorCode === 1) {
        this.refundInfo = res.data[0]
        sessionStorage.setItem('refundOrder', JSON.stringify(res.data[0]))
      } else {
        this.$Message.error(res.msg)
      }
    }
  },
  mounted () {
    // 获取退款的订单信息
    this.refundInfo = this.$route.params.refundOrder === undefined ? JSON.parse(sessionStorage.getItem('refundOrder')) : this.$route.params.refundOrder
  }
}
</script>

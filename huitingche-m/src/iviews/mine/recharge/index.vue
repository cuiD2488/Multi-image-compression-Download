<template>
  <div class="rechargeContent">
    <!-- 充值页面 -->
    <div class="balanceDiv">
      <div class="top">余额（元）</div>
      <div class="bottom">{{walletMsg.balance}}</div>
      <!-- <span>余额<strong style="">0.00</strong>元</span> -->
    </div>
    <group class="groupClass">
      <x-input :show-clear="false" @on-change="changeMoney" style="border: 1px solid #ddd" title="充值金额：" v-model="moneyVal" placeholder="单次充值金额不得小于20元"></x-input>
    </group>
    <div class="btnLine">
      <x-button class="buttonContent" :class="{buttonBox: index === targetInde}" mini plain type="primary" @click.native="chooseMoney(index)" v-for="(item, index) in moneyButtonList" :key="index">{{item.value}}元</x-button>
    </div>
    <div class="sureBtn">
      <x-button type="primary" :disabled="disabledBl" @click.native="wxPay">确定</x-button>
    </div>
  </div>
</template>

<style>
.weui-cells, .vux-no-group-title{
  margin-top: 0!important;
}
.weui-btn + .weui-btn{
  margin-top: 0!important;
}
.btnLine .buttonContent{
  margin-top: 0 !important;
}
.weui-btn_plain-primary{
  color: #7cd1ef !important;
  border-color: #7cd1ef !important;
}
.weui-btn_mini{
  padding: 0 20px !important;
}
</style>

<style lang="less" scoped>
.rechargeContent{
  background: #f8f8f8;
  height: 100vh;
}
.balanceDiv{
  background: linear-gradient(#6abedb, #b3ecff);
  position: relative;
  height: 243px;
  text-align: center;
  color:#fff;
  font-size: 40px;
  padding-top: 70px;
  box-sizing: border-box;
  .top{
    font-size: 36px;
  }
  .bottom{
    font-size: 48px;
  }
}
.groupClass{
  padding: 25px 35px;
  margin-bottom: 15px;
  background: #fff;
}
.btnLine{
  display: flex;
  padding: 25px 35px;
  background: #fff;
  margin-bottom: 90px;
  justify-content: space-between;
  .buttonContent{
    width: 20%;
  }
}
// .sureBtn{
//   padding: 25px 35px;
// }
</style>

<script>
import {ApiWeiXinPay, ApiUpdatePkPayStatus} from '@/api'
import { XInput, Group, XButton } from 'vux'
export default {
  components: {
    XInput,
    Group,
    XButton
  },
  data () {
    return {
      disabledBl: true,
      moneyVal: null,
      moneyButtonList: [
        {
          value: 50
        },
        {
          value: 100
        },
        {
          value: 200
        },
        {
          value: 500
        }
      ],
      targetInde: -1,
      walletMsg: sessionStorage.getItem('walletMsg') ? JSON.parse(sessionStorage.getItem('walletMsg')) : null
    }
  },
  methods: {
    // 监听输入框变化
    changeMoney () {
      // console.log(this.moneyVal)
      if (this.moneyVal) {
        this.disabledBl = false
      } else {
        this.disabledBl = true
        this.targetInde = -1
      }
    },
    // 选择金额
    chooseMoney (index) {
      // console.log(index)
      this.targetInde = index
      this.moneyVal = this.moneyButtonList[index].value
    },
    // 调用微信充值接口
    async wxPay () {
      if (+this.moneyVal < 20) {
        this.$vux.toast.text('单笔充值金额不得小于20元')
        return
      }
      let data = {
        money: +this.moneyVal,
        openId: JSON.parse(sessionStorage.getItem('userInform')).openId,
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber
      }
      const res = await ApiWeiXinPay(data)
      if (res.code === 200) {
        let wxPayData = res.data
        let payNumber = res.payNumber
        try {
          // 微信支付接口
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', {
            appId: wxPayData.appid, // 公众号名称，由商户传入
            timeStamp: wxPayData.timeStamp, // 时间戳
            nonceStr: wxPayData.nonce_str, // 随机串
            package: wxPayData.packageStr,
            signType: wxPayData.signType, // 微信签名方式
            paySign: wxPayData.sign // 微信签名
          }, res => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              this.$vux.toast.text('支付成功')
              // 修改订单状态
              this.updateOrder(payNumber)
            } else {
              this.$vux.toast.text('支付失败')
            }
          })
        } catch (error) {
        }
      }
      console.log(res)
    },
    // 充值成功后修改钱包余额
    async updateOrder (payNumber) {
      let data = {
        payNumber: payNumber,
        payStatus: 1
      }
      const res = await ApiUpdatePkPayStatus(data)
      console.log(res)
      if (res.code === 200) {
        this.$vux.toast.text('充值成功')
        this.$router.push({name: 'myWallet'})
      }
    }
  }
}
</script>

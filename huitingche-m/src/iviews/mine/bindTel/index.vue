<template>
  <div style="background:#f6f6f6;">
    <!-- 绑定手机号 -->
    <div class="bindTelTitle">首次登陆请绑定手机号</div>
    <div class="bindTelContent">
      <group>
      <!-- <x-input title="验证码">
        <img slot="right-full-height" src="https://ws1.sinaimg.cn/large/663d3650gy1fq684go3glj203m01hmwy.jpg">
      </x-input> -->
        <x-input title="手机号" class="weui-vcode" v-model="phoneNo">
        </x-input>
        <x-input title="验证码" class="weui-vcode" v-model="verificationCode">
          <x-button slot="right" @click.native="sendCode" type="primary" mini >发送验证码</x-button>
        </x-input>
      </group>
      <div class="agreement">
        <check-icon :value.sync="agreement1">我已阅读并同意<router-link to="/">路内停车服务协议</router-link></check-icon>
        <br>
        <check-icon :value.sync="agreement2">我已阅读并同意<router-link to="/">>销户退费说明</router-link></check-icon>
      </div>
      <x-button type="primary" style="margin-top: 1rem;" @click.native="submitFn">确定</x-button>
    </div>
    <div class="footMessg">
      <p>技术支持：深圳市云天数字科技有限公司</p>
    </div>
  </div>
</template>
<script>
import { XInput, Group, XButton, Cell, CheckIcon } from 'vux'
import {ApiGetVerificationCode, ApiUpdatePhone} from '@/api'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    CheckIcon
  },
  data () {
    return {
      agreement1: false,
      agreement2: false,
      phoneNo: '',
      verificationCode: ''
    }
  },
  methods: {
    async sendCode () {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNo))) {
        this.$vux.toast.text('输入的手机号有误,请核对后再试')
        return
      }
      const data = {
        phone: this.phoneNo
        // verificationCode: this.verificationCode
      }
      const res = await ApiGetVerificationCode(data)
      if (res.code === 200) {
        // 存储获得的验证码
        this.getCode = res.data
      } else {
        this.$vux.toast.text('短信发送失败请稍后再试')
      }
    },
    // 注册手机号
    async submitFn () {
      if (this.getCode === this.verificationCode) {
        let data = {
          id: +sessionStorage.getItem('state'),
          userId: this.phoneNo
        }
        const res = await ApiUpdatePhone(data)
        console.log(res)
      } else {
        this.$vux.toast.text('验证码不正确,请核对后再试')
      }
      console.log(1)
    }
  }
  // mounted () {
  //   this.submitFn()
  // }
}
</script>
<style>
.weui-cell{
  padding: 30px 20px!important;
  font-size: 24px!important;
}
.bindTelContent > .weui-btn{
  margin: 20px;
  width: 680px;
}
</style>
<style lang="less" scoped>
  .bindTelTitle{
    height: 160px;
    line-height: 160px;
    font-size: 30px;
    background: #fff;
    text-align: left;
    padding-left: 30px;
}
.agreement{
  text-align: left;
  padding-left: 30px;
  padding: 60px 0;
}
  .footMessg{
    position: absolute;
    bottom: 150px;
    text-align: center;
    width: 100%;
    color: #999;
    font-size: 30px;
  }
</style>

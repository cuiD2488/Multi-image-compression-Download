<template>
  <div style="text-align:left;background:#f6f6f6;">
    <div style="height:.5px;"></div>
    <!-- 智能停车 -->
    <div class="locationContent bgcontent defaultClass">
      <!-- <span>您已到达宝名二路（西乡东段）停车场</span> -->
    </div>
    <div class="payFn bgcontent">
      <!-- 付费方式 -->
      <!-- <div class="payFnTitle">付费方式</div>
      <div>
        <checker v-model="payVal" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item :value="item.key" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
        </checker>
      </div> -->
    </div>
    <div class="bgcontent">
      <!-- 泊位号 -->
      <div style="margin-bottom: .6px;">泊位编号</div>
      <div class="parkingSpaceContent">
        <input maxlength="1"
          v-focus="focusStatus === index"
          v-model="item.key"
          :ref="'input' + index"
          type="text"
          @keyup="changeInput"
          v-for="(item, index) in inputList"
          :key="index"
          @focus="targetFouse(index)"
         >
      </div>
      <div>
        请输入地面上标记的6位泊位数字
      </div>
    </div>
    <div class="bgcontent" style="margin-top:1px;">
      <div v-if="+payVal === 1">
        <!-- 预付费选择时间 -->
        <group class="popupPickerContent">
          <popup-picker class="popupPickerContent" title="购买时长" :data="timeList" v-model="timeVal" @on-hide="confirm"></popup-picker>
        </group>
        <div class="beforeParkingMessage">
          <h5>预付费停车信息</h5>
          <p><span>泊位编号：</span>{{parkingNo}}</p>
          <p><span>停车时长：</span>{{timeVal[0] + timeVal[1]}}</p>
          <p><span>费用合计：</span>{{parkingMoney}}元</p>
        </div>
        <div @click="gotorules">
          <span v-if="parkingLotNumber">收费规则</span>
        </div>
      </div>
      <div v-else class="afterParkingMessage">
        <!-- 后付费，查询钱包余额是否够一个小时，如果够则允许，超时为继续支付，就给管理人员发送消息。如果钱包不够就提示他无法后付费，并说明后付费需要满足的条件-->
        <p style="margin-bottom: 1px;">您钱包余额不足50元，无法使用后付费方式停车</p>
        <x-button mini>立即充值</x-button>
      </div>
      <x-button type="primary" @click.native="openKeyPssword" class="defaultClass btn">确认</x-button>
    </div>
    <popup v-if="deletePass" hide-on-blur v-model="closePayKeyBoard" height="270px" is-transparent @on-hide="deletePass">
      <div  class="payKeyboard">
        <div class="title" @click.stop="stop" v-text="title"></div>
        <ul class="password" @click.stop="stop">
          <li  v-for="(item, index) in passList" :key="index">
            <span v-if="show[index] || false"></span>
          </li>
        </ul>
        <ul class="pay-keyboard" >
          <li @click.stop="inputPass(item, index)" :class="touchNum===index?'touch':''" v-for="(item, index) in passKeyboard" :key="index" v-text="item"></li>
        </ul>
      </div>
      <div class="shade-white" v-show="loadingShow" @click.stop="stop">
        <loading :show="loadingShow" text="付款中...."></loading>
      </div>
    </popup>
  </div>
</template>
<script>
import {CheckIcon, Checker, CheckerItem, Popup, XInput, Group, Picker, PopupPicker, XButton, Loading, Toast} from 'vux'
import {ApiqueryChargingRules, ApipayFree, ApifindPositionByCondition, ApiQueryPkUser} from '@/api'
import md5 from 'js-md5'
export default {
  components: {
    CheckIcon,
    Checker,
    CheckerItem,
    XInput,
    Group,
    Picker,
    PopupPicker,
    XButton,
    Loading,
    Toast,
    Popup
  },
  data () {
    return {
      targetParkingNo: 0,
      closePayKeyBoard: false,
      payFn: false,
      payVal: '1',
      timeVal: ['0小时', '00分钟'],
      timeList: [['0小时', '1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时', '10小时', '11小时', '12小时'], ['00分钟', '30分钟']],
      focusStatus: 0,
      items1: [
        {
          key: '1',
          value: '预付费'
        }, {
          key: '2',
          value: '后付费'
        }
      ],
      inputList: [
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        }
      ],
      year4: ['2002', '4'],
      parkingNo: '',
      parkingMesaage: null,
      parkingMoney: null,
      // 用户信息
      userInform: sessionStorage.getItem('userInform') ? JSON.parse(sessionStorage.getItem('userInform')) : null,
      walletMsg: sessionStorage.getItem('walletMsg') ? JSON.parse(sessionStorage.getItem('walletMsg')) : null,
      targetTime: '',
      passList: [',', ',', ',', ',', ',', ','],
      passKeyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, '清空', 0, '删除'],
      touchNum: '',
      payPass: [],
      show: [],
      title: '请输入支付密码, 用于支付验证',
      payPassFirst: '',
      loadingShow: false,
      targetIndex: 0,
      parkingLotNumber: null
    }
  },
  directives: {
    focus: { // 自定义指令针对自动聚焦input
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods: {
    // 关闭选择时长弹框
    confirm (v) {
      // this.timeVal
      if (!this.parkingNo) {
        this.timeVal = ['', '']
        this.$vux.toast.text('请填写泊位编号')
        return false
      }
      this.getChargingRules()
    },
    // chakanguize
    gotorules () {
      if (this.parkingLotNumber) {
        this.$router.push({name: 'parkingRules', query: {parkingLotNumber: this.parkingLotNumber}})
      } else {
        this.$vux.toast.text('请输入正确的泊位编号')
        return false
      }
    },
    // 泊位号计算
    changeInput (v) {
      if (this.inputList[this.targetIndex].key && this.inputList[this.targetIndex].key.length > 0) {
        this.focusStatus = this.targetIndex + 1
      } else if (+v.keyCode === 8) {
        this.focusStatus = this.targetIndex - 1
      }
      this.parkingNo = ''
      for (let i in this.inputList) {
        this.parkingNo += this.inputList[i].key
      }
      if (this.targetIndex === 5 && this.parkingNo.length === 6) {
        // 如果是最后一位，就查询是否有该车位
        this.verificationParkingNo()
        this.getChargingRules()
      }
    },
    // 选择泊位号输入框
    targetFouse (index) {
      this.targetIndex = index
    },
    // 验证泊位号
    async verificationParkingNo () {
      const data = {
        positionNumber: this.parkingNo
      }
      const res = await ApifindPositionByCondition(data)
      // ；李德才说只判断code就可以了，有锅他背
      if (res.code !== 200 && this.inputList[5].key) {
        for (let i in this.inputList) {
          this.inputList[i].key = ''
        }
        this.parkingNo = ''
        this.$vux.toast.text(res.msg)
        this.focusStatus = 0
        return false
      } else {
        this.parkingLotNumber = res.data.parkingLotNumber
      }
    },
    // 获取时间停车时间
    async getChargingRules () {
      const data = {
        positionNumber: this.parkingNo
      }
      // 查询收费规则
      const res = await ApiqueryChargingRules(data)
      // this.timeVal = ['1小时', '00分钟']
      if (res.code === 200) {
        if (res.msg === '对不起没有数据,请您检查数据！') {
          this.$vux.toast.text('对不起没有数据,请您检查数据！')
          return false
        }
        this.parkingMesaage = res.data
        let targetHouse = this.timeVal[0].replace('小时', '')
        let targetMine = this.timeVal[1].replace('分钟', '') === '00' ? 0 : 0.5
        // console.log(this.timeVal[1])
        let targetTime = Number(targetHouse) + Number(targetMine)
        console.log(targetTime)
        this.targetTime = targetTime
        let item = res.data.pkChargingRulesVoList
        // 收费金额
        let targetMoney = 0
        // 白名单人员字段, 计算内直接用了三目了，如果是白名单内人员则应用白名单计费标准
        let isWhite = this.userInform.vip
        // 如果选择时段小于或等于第一档
        if (targetTime === (item[0].ruleEndTime - item[0].ruleStartTime) || targetTime < (item[0].ruleEndTime - item[0].ruleStartTime)) {
          targetMoney += (isWhite === 1 ? item[0].whiteRuleValue : item[0].ruleValue) * targetTime * 2
        } else if (targetTime > (item[0].ruleEndTime - item[0].ruleStartTime) && targetTime - (item[0].ruleEndTime - item[0].ruleStartTime) < (item[1].ruleEndTime - item[1].ruleStartTime)) {
          // 如果选择时段大于第一档时段 并且选择时段减去第一档剩余时段小于第二档
          // 第一档全时段
          targetMoney += (isWhite === 1 ? item[0].whiteRuleValue : item[0].ruleValue) * (item[0].ruleEndTime - item[0].ruleStartTime) * 2
          // 第二档部分时段
          targetMoney += (targetTime - (item[0].ruleEndTime - item[0].ruleStartTime)) * (isWhite === 1 ? item[1].whiteRuleValue : item[1].ruleValue) * 2
        } else if (targetTime - (item[0].ruleEndTime - item[0].ruleStartTime) > (item[1].ruleEndTime - item[1].ruleStartTime)) {
          // 第一档全时段
          targetMoney += (isWhite === 1 ? item[0].whiteRuleValue : item[0].ruleValue) * (item[0].ruleEndTime - item[0].ruleStartTime) * 2
          // 第二档全时段
          targetMoney += (item[1].ruleEndTime - item[1].ruleStartTime) * (isWhite === 1 ? item[1].whiteRuleValue : item[1].ruleValue) * 2
          // 第三档
          targetMoney += (targetTime - (item[0].ruleEndTime - item[0].ruleStartTime) - (item[1].ruleEndTime - item[1].ruleStartTime)) * (isWhite === 1 ? item[2].whiteRuleValue : item[2].ruleValue) * 2
        }
        // 得出最终价格
        this.parkingMoney = targetMoney
      } else {
        this.$vux.toast.text('网络请求失败')
      }
    },
    // 打开键盘
    openKeyPssword () {
      if (!this.parkingNo) {
        this.$vux.toast.text('请填写泊位编号')
        return false
      } else if (!this.parkingMoney) {
        this.$vux.toast.text('请选择时长')
        return false
      }
      this.clearPass()
      this.closePayKeyBoard = true
    },
    // 调用钱包支付
    async pay () {
      const data = {
        openId: this.userInform.openId,
        payType: 0,
        payPassword: md5(this.payPassFirst),
        positionNumber: this.parkingNo,
        time: Number(this.targetTime),
        userNumber: this.userInform.userNumber
      }
      const res = await ApipayFree(data)
      if (res.code === 200) {
        this.$vux.toast.text('支付成功')
        this.$router.push({name: 'parkingRecord', query: this.$route.query})
      } else {
        this.$vux.toast.text(res.msg)
      }
      this.clearPass()
      this.loadingShow = false
      this.closePayKeyBoard = false
    },
    stop () {
    },
    // 键盘事件
    inputPass (item, index) {
      this.touchNum = index
      this.$nextTick(() => {
        setTimeout(() => {
          this.touchNum = ''
        }, 100)
      })
      if (typeof (item) === 'number') {
        if (this.payPass.length >= 6) {
          return false
        }
        this.show.push(true)
        this.payPass.push(item)
        if (this.payPass.length === 6) {
          this.payPassFirst = this.payPass.join('')
          this.loadingShow = true
          this.pay()
        }
      } else if (index === 11) {
        this.deletePass()
      } else if (index === 9) {
        this.clearPass()
      }
    },
    async clearPass () {
      this.loadingShow = false
      this.show = []
      this.payPass = []
    }, // 清空密码
    deletePass () {
      this.show.splice(this.show.length - 1)
      this.payPass.splice(this.payPass.length - 1)
    },
    // 更新账户余额
    async updateBalance () {
      const data = {
        openId: this.userInform.openId,
        vendorId: this.userInform.vendorId
      }
      const res = await ApiQueryPkUser(data)
      if (res.code === 200 && res.data) {
        // this.walletMsg = res.data
        sessionStorage.removeItem('walletMsg')
        sessionStorage.setItem('walletMsg', JSON.stringify(res.data))
        // this.$router.push({name: 'myWallet'})
        this.$router.push({name: 'parkingRecord', query: this.$route.query})
      } else {
        this.$vux.toast.text('查询账户余额失败')
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .btn{
    margin-top: 20px;
    font-size: 32px !important;
  }
  .bgcontent{
    padding: 10px 48px;
    background: #fff;
    font-size: 28px;
  }
  .locationContent{
    padding: 20px 48px;
    background: #fff;
    font-size: 24px;
    margin: 1px 0;
  }
  // 支付方式
  .payFn{
    margin-bottom: 1px;
    .payFnTitle{
      margin-bottom: 12px;
    }
  }
  .parkingSpaceContent{
    position: relative;
    background-size: 100%;
    height: 100px;
    input{
      width: 16%;
      height: 80px;
      text-align:center;
      border: 1px solid #ddd;
    }
    ul{
      display: flex;
      list-style:none;
      border:1px solid #ddd;
      border-right: none;
      justify-content: space-between;
      margin: 0 50px;
      li {
        // width: 16.6%;
        height: 60px;
        border-right: 1px solid #ddd;
        flex: 1;
        line-height: 60px;
      }
      .parkingListItem{
        border: 1px solid green;
      }
    }
  }
  .demo1-item {
    border: 1px solid #ececec;
    padding: 10px 30px;
  }
  .demo1-item-selected {
    border: 1px solid green;
  }
  .beforeParkingMessage{
    margin-top: 20px;
    h5{
      font-size: 32px;
      padding-top: 50px;
    }
    p{
      font-size: 28px;
      padding: 15px 0;
    }
  }
  .afterParkingMessage{
    min-height: 15px;
    text-align: center;
  }
  // 密码框
  .payKeyboard{
  width: 101%;
  overflow: hidden;
  position: fixed;
  left: 0;
  bottom: 0;
  font-size: 28px;
}
.shade-white{
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  opacity: .9;
}
.shade{
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color:rgba(0,0,0,0.5)
}
.title{
  font-size: 24px;
  text-align: center;
  color: #333;
  line-height: 46px;
  margin-bottom: -1px;
  background: #fff;
}
li{
  list-style: none;
}
.password{
    display: flex;
    padding: 0.6rem;
    padding-top: 0.2rem;
    justify-content: center;
    background: #fff;
  li{
    float: left;
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    align-items:center;
    justify-content: center;
    border: 1px solid #ccc;
    border-left:none;
    text-align: center;
    span{
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      background: #000;
      border-radius: 50%;
    }
    &:first-child{
      border-left: 1px solid #ccc;
    }
  }
}
.pay-keyboard{
  li{
    float: left;
    width: 1rem;
    height: 1rem;
    border: 1px solid #ccc;
    border-top: none;
    background: #fff;
    width: 32.99999%;
    text-align: center;
    line-height: 1rem;
    &.touch{
      background: #bcbcbc;
    }
    &:nth-child(-n+3){
      border-top: 1px solid #ccc;
    }
    &:nth-child(10n){
      background: #d5d8db;
    }
    &:last-child{
      background: #d5d8db;
    }
    &:nth-child(3n){
      border-right: none;
      border-left: none;
    }
    &:nth-child(3n-2){
      border-right: none;
      border-left: none;
    }
  }
}
</style>

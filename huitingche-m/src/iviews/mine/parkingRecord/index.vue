<template>
  <div class="page">
    <tab>
      <tab-item selected @on-item-click="getParkRecord">全部订单</tab-item>
      <tab-item @on-item-click="getParkRecord(3)">已完成</tab-item>
      <tab-item @on-item-click="getParkRecord(2)">欠费记录</tab-item>
      <tab-item @on-item-click="illegalFlag = true">违章查询</tab-item>
    </tab>
    <!-- 停车记录 -->
    <div class="parkingRecordContent" v-if="recordList.length > 0 && !illegalFlag">
      <div v-for="(item, index) in recordList" :key="index">
        <div class="location">{{item.city + item.county + item.detailedAddress + item.parkingLotName}}</div>
        <div class="date">
          <span>停车时间：</span>
          <span>{{item.enterTime}}<span v-if="item.outTime"> 至 {{item.outTime}}</span></span>
        </div>
        <div class="date">
          <div v-if="item.orderStatus === 2">订单金额：<span style="color:#000">{{item.orderMoney}}元</span></div>
          <div v-else>预付金额：<span style="color:#000">{{item.orderMoney}}元</span></div>
          <div>实付金额：<span style="color:#000">{{item.actualPayMoney}}元</span></div>
        </div>
        <div class="delLine">
          <div>{{item.orderStatus === 0 ? '待支付' : item.orderStatus === 1 ? '支付成功' : '待补缴:' + item.orderRepairMoney + '元'}}</div>
          <div class="deleteDiv">
            <x-button v-if="item.orderStatus === 2" @click.native="payOrder(item.orderNumber, item.orderRepairMoney)" type="primary" mini text="支付" class="deleteBtn"></x-button>
            <x-button v-else-if="item.orderStatus === 3" @click.native="deleteOrder(item.orderNumber)" type="primary" mini text="删除" class="deleteBtn"></x-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 违停记录 -->
    <div v-else-if="illegalFlag">
      <div class="illegalDiv">
        <x-input class="weui-vcode before" v-model="carNumberBefore" :show-clear="false" placeholder="例:粤X"></x-input>
        <x-input class="weui-vcode after" v-model="carNumber" :show-clear="false" placeholder="请输入查询的车牌号 例: 123456">
          <x-button slot="right" @click.native="sureBtn" type="primary" mini text="确定"></x-button>
        </x-input>
      </div>
      <div v-if="illegalList.length < 1">前两位+后5-6位,例:粤B 123456</div>
      <div class="showDiv" v-if="illegalList.length > 0">
        <div v-for="(item, index) in illegalList" :key="index">
          <div class="location">{{item.city + item.county + item.detailedAddress + item.parkingLotName}}</div>
          <div class="date">
            <span>违停时间：</span>
            <span>{{item.violationCreateTime}}</span>
          </div>
          <div class="date">
            <div>违停原因：<span style="color:#000">{{item.reasons}}</span></div>
            <div>停车场编号：<span style="color:#000">{{item.parkingLotNumber}}</span></div>
          </div>
          <div class="illegaImg">
            <div class="title">违停拍照：</div>
            <swiper :list="illegalList[index].violationImage" style="width:85%;margin:0 auto;" :aspect-ratio="500/800" dots-position="center"></swiper>
            <!-- <div v-for="index1 of illegalList[index].violationImage" :key="index1">
              <img :src="index1" alt="">
            </div> -->
          </div>
          <!-- <div class="delLine">
            <div>{{item.orderStatus === 0 ? '待支付' : item.orderStatus === 1 ? '支付成功' : '待补缴'}}</div>
            <div class="deleteDiv">
              <x-button @click.native="deleteOrder(item.orderNumber)" type="primary" mini text="删除" class="deleteBtn"></x-button>
            </div>
          </div> -->
        </div>
      </div>
      <div v-else class="noData">
        <img src="@/assets/noData.png" alt="">
      </div>
    </div>
    <div v-else class="noData">
      <img src="@/assets/noData.png" alt="">
    </div>
    <!-- 密码键盘 -->
    <popup hide-on-blur v-model="closePayKeyBoard" height="270px" is-transparent @on-hide="deletePass">
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
import {ApiQueryPkOrder, ApiDeletePkOrder, ApiQueryPkViolation, ApMakeUpMoney, ApiQueryPkUser} from '@/api'
import { Tab, TabItem, XButton, XInput, Swiper, Popup, Loading, PopupPicker, Picker } from 'vux'
import md5 from 'js-md5'

export default {
  components: {
    Tab,
    TabItem,
    XButton,
    XInput,
    Swiper,
    Picker,
    PopupPicker,
    Loading,
    Popup
  },
  data () {
    return {
      recordList: [],
      illegalFlag: false,
      carNumber: null,
      illegalList: [],
      carNumberBefore: null,
      // 虚拟键盘展示/隐藏标识
      closePayKeyBoard: false,
      // 钱包密码支付
      payPass: [],
      show: [],
      title: '请输入支付密码, 用于支付验证',
      payPassFirst: '',
      loadingShow: false,
      passList: [',', ',', ',', ',', ',', ','],
      passKeyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, '清空', 0, '删除'],
      touchNum: '',
      // 存储支付的订单号
      saveOrderNumber: null,
      // 用户信息
      userInform: sessionStorage.getItem('userInform') ? JSON.parse(sessionStorage.getItem('userInform')) : null,
      walletMsg: sessionStorage.getItem('walletMsg') ? JSON.parse(sessionStorage.getItem('walletMsg')) : null
    }
  },
  methods: {
    // 获取停车记录
    async getParkRecord (n) {
      this.illegalFlag = false
      let data = {
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber,
        col: 1
      }
      if (n) {
        data.orderStatus = n
      }
      const res = await ApiQueryPkOrder(data)
      if (res.code === 200 && res.data) {
        // 清空展示数据重新写入
        this.recordList = []
        let data = res.data
        for (let index in data) {
          // 已完成订单,判断是否含有进出车时间,没有不展示
          if (data[index].enterTime && data[index].outTime && n === 3) {
            data[index].enterTime = data[index].enterTime.substring(0, data[index].enterTime.length - 5)
            data[index].outTime = data[index].outTime.substring(0, data[index].outTime.length - 5)
            this.recordList.push(data[index])
          } else {
            if (data[index].enterTime && data[index].outTime) {
              data[index].enterTime = data[index].enterTime.substring(0, data[index].enterTime.length - 5)
              data[index].outTime = data[index].outTime.substring(0, data[index].outTime.length - 5)
            }
            this.recordList.push(data[index])
          }
        }
        // this.$vux.toast.text(1)
        // console.log(this.recordList)
      } else {
        this.recordList = []
        this.$vux.toast.text(res.msg)
      }
    },
    // 删除停车记录
    async deleteOrder (orderNumber) {
      let data = {
        orderNumber: orderNumber
      }
      const res = await ApiDeletePkOrder(data)
      if (res.code === 200) {
        this.$vux.toast.text('删除成功')
        this.getParkRecord()
      } else {
        this.$vux.toast.text(res.msg)
      }
    },
    // 查询违章信息
    async sureBtn () {
      if (this.carNumber && this.carNumberBefore) {
        let data = {
          vendorId: +JSON.parse(sessionStorage.getItem('userInform')).vendorId,
          numberPlate: this.carNumber,
          abbreviation: this.carNumberBefore
        }
        const res = await ApiQueryPkViolation(data)
        if (res.code === 200 && res.data) {
          let imgArr = []
          let imgList = []
          let imgData = {}
          for (let index in res.data) {
            // 将图片字符串转换为数组
            imgArr = res.data[index].violationImage.split(',')
            // 将数组内容封装成list
            for (let index1 in imgArr) {
              imgData = {
                img: imgArr[index1]
              }
              imgList.push(imgData)
            }
            res.data[index].violationImage = imgList
            // 将图片存入展示数组
            this.illegalList.push(res.data[index])
          }
        } else {
          this.$vux.toast.text(res.msg)
        }
      } else {
        this.$vux.toast.text('请检查是否输入车牌的前两位和后5-6位')
      }
    },
    // 补缴支付接口
    payOrder (orderNumber, orderRepairMoney) {
      if (+JSON.parse(sessionStorage.getItem('walletMsg')).balance < orderRepairMoney) {
        this.$vux.toast.text('您钱包余额不足请充值')
        this.$router.push({name: 'recharge'})
      } else {
        // 存储支付的订单号
        this.saveOrderNumber = orderNumber
        // 清空密码
        this.clearPass()
        // 显示虚拟键盘
        this.closePayKeyBoard = true
      }
    },
    // 清空密码
    async clearPass () {
      this.loadingShow = false
      this.show = []
      this.payPass = []
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
    // 调用钱包支付
    async pay () {
      const data = {
        orderNumber: this.saveOrderNumber,
        payPassword: md5(this.payPassFirst)
      }
      const res = await ApMakeUpMoney(data)
      if (res.code === 200 && res.data) {
        this.$vux.toast.text('支付成功')
        this.saveOrderNumber = null
        // 更新钱包余额
        this.updateBalance()
        // this.$router.push({name: 'parkingRecord', query: this.$route.query})
      } else {
        this.$vux.toast.text(res.msg)
      }
      this.clearPass()
      this.loadingShow = false
      this.closePayKeyBoard = false
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
    // 挂载完成后调用获取停车信息接口
    this.getParkRecord()
  }
}
</script>
<style lang="less" scoped>
.page{
  background: #f6f6f6;
  // height:100%;
  padding-bottom: 120px;
}
.parkingRecordContent{
  text-align: left;
  padding: 20px 0;
  font-size: 28px;
  >div {
    margin-bottom: 20px;
    background: #fff;
    padding: 40px 30px;
  }
  .location{
    padding-bottom: 15px;
  }
  .date{
    display: flex;
    justify-content: space-between;
    color: #898989;
    font-size: 24px;
  }
}
.delLine{
  display: flex;
  padding-top: 20px;
  line-height: 54px;
  // justify-content: space-between;
  .deleteDiv{
    flex-grow: 1;
    position: relative;
    .deleteBtn{
      position: absolute;
      right: 0;
    }
  }
}
.noData{
  height: 100%;
  text-align: center;
  padding: 0 30px;
  padding-top: 45%;
  img{
    width: 60%;
  }
}
.showDiv{
  text-align: left;
  padding: 20px 0;
  font-size: 28px;
  >div {
    margin-bottom: 20px;
    background: #fff;
    padding: 40px 30px;
  }
  .location{
    padding-bottom: 15px;
  }
  .date{
    display: flex;
    justify-content: space-between;
    color: #898989;
    font-size: 24px;
  }
}
.illegaImg{
  img{
    width: 200px;
  }
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
<style>
.page{
  min-height: calc(100% - 120px);
}
.illegalDiv{
  display: flex;
  background: #fff;
  font-size: 28px;
  margin: 10px 20px;
  border: 1px solid #f5f5f5;
  border-radius: 10px;
}
.before{
  width: 100px;
  border-right: 1px solid #aaa;
}
.after{
  flex-grow: 1;
}
.weui-cell{
  background: #fff;
}
button.weui-btn, input.weui-btn{
  margin: 0;
}
</style>

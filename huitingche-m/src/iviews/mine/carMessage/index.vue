<template>
  <div>
    <!-- style="background:#f5f5f5;" -->
    <!-- 车辆信息 -->
    <div class="plateNumberMessage" v-if="!bindFlag">
      <div class="titleLine">请输入车牌号</div>
      <div class="plateNumberDiv">
        <!-- 车牌前两位 -->
        <div class="plateNumberFirst">
          <!-- <input maxlength="1" v-focus="focusStatusFirst === index" v-model="item.key" :ref="'input' + index" type="text" @keyup="changeInput(index, 1)" v-for="(item, index) in inputListFirst" :key="index"> -->
          <div class="insideInput">
            <input v-model="beforNumber" type="text">
            <!-- <input type="text"> -->
          </div>
        </div>
        <!-- 分割点 -->
        <div class="point">•</div>
        <!-- 车牌后五位 -->
        <div class="plateNumberLast">
          <input v-model="afterNumber" type="text">
          <!-- <input maxlength="1" v-focus="focusStatus === index" v-model="item.key" :ref="'input' + index" type="text" @keyup="changeInput(index, 2)" v-for="(item, index) in inputList" :key="index"> -->
        </div>
      </div>
      <!-- <div class="titleLine">请输入车架号</div>
      <div class="VINumberLine">
        <input v-model="VINumber" type="text">
      </div> -->
    </div>
    <!-- 绑定的车牌号信息 -->
    <div v-else class="bindCarMessage">
      <div>绑定的车牌号:{{bindCarMessage.abbreviation + bindCarMessage.carNumber}}</div>
    </div>
    <x-button v-if="!bindFlag" class="sureBtn" @click.native="sure">保存</x-button>
    <x-button v-else class="sureBtn" @click.native="delCarMessage">解绑</x-button>
    <div v-if="!bindFlag" class="remark">请绑定真实有效的车牌号,否则将无法正常使用车牌付费功能</div>
  </div>
</template>
<script>
import {ApiInsertPkCar, ApiQueryPkCar, ApiDeletePkCar} from '@/api'
import {XButton} from 'vux'
export default {
  components: {
    XButton
  },
  data () {
    return {
      userInform: JSON.parse(sessionStorage.getItem('userInform')),
      focusStatus: 0,
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
        }
      ],
      beforNumber: null,
      afterNumber: null,
      VINumber: null,
      // 绑定的车牌信息
      bindCarMessage: {},
      // 绑定标识
      bindFlag: false
    }
  },
  // directives: {
  //   focus: { // 自定义指令针对自动聚焦input
  //     update: function (el, {value}) {
  //       if (value) {
  //         el.focus()
  //       }
  //     }
  //   }
  // },
  methods: {
    // 点击保存按钮验证车牌号
    async sure () {
      if (this.beforNumber && this.afterNumber.length < 7) {
        let data = {
          abbreviation: this.beforNumber,
          carNumber: this.afterNumber,
          // frameNumber: this.VINumber,
          userNumber: this.userInform.userNumber,
          vendorId: +this.userInform.vendorId
        }
        const res = await ApiInsertPkCar(data)
        if (res.code === 200) {
          this.getCarMessage()
          // this.bindFlag = true
        }
        // console.log(res)
      } else {
        this.$vux.toast.text('输入的车牌号有误请核对后再试')
      }
    },
    // 获取车牌信息
    async getCarMessage () {
      let data = {
        userNumber: this.userInform.userNumber,
        vendorId: +this.userInform.vendorId
      }
      const res = await ApiQueryPkCar(data)
      if (res.code === 200 && res.data) {
        this.bindCarMessage = res.data
        // 绑定标识
        this.bindFlag = true
      } else {
        this.bindFlag = false
      }
    },
    // 解绑车牌信息
    async delCarMessage () {
      let data = {
        userNumber: this.userInform.userNumber,
        vendorId: +this.userInform.vendorId
      }
      const res = await ApiDeletePkCar(data)
      if (res.code === 200 && res.data) {
        this.getCarMessage()
      }
      // console.log(res)
    }
    // 车牌号输入计算
    // changeInput (index) {
    //   // let inputList
    //   if (this.inputList[index].key && this.inputList[index].key.length > 0) {
    //     this.focusStatus = index + 1
    //   } else {
    //     this.focusStatus = index - 1
    //   }
    //   if (index === 4) {
    //     // 如果是最后一位，就查询是否有该车位
    //     console.log('最后一位')
    //   }
    //   console.log(this.focusStatus)
    // }
  },
  mounted () {
    this.getCarMessage()
  }
}
</script>
<style lang="less" scoped>
.plateNumberMessage{
  padding: 75px 20px;
  .titleLine{
    text-align: left;
    font-size: 26px;
    color: #c7c7c7;
    padding-bottom: 10px;
  }
}
.plateNumberDiv{
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
  .point{
    padding: 0 10px;
    color: #c8c8c8;
    font-weight: bold;
  }
  .plateNumberFirst{
    height: 86px;
    border: 1px solid #cfcfd1;
    input{
      text-align: center;
      font-size: 40px;
      height: 86px;
      width: 148px;
    }
  }
  .plateNumberLast{
    // position: relative;
    // background-size: 100%;
    height: 86px;
    border: 1px solid #cfcfd1;
    input{
      font-size: 40px;
      width: 486px;
      height:86px;
      text-align:center;
    }
  }
}
.VINumberLine{
  input{
    height:86px;
    width: 670px;
    font-size: 40px;
    text-align:center;
  }
}
.sureBtn{
  height: 82px;
  width: 680px;
  margin: 0 20px;
  color: #fff;
  background-color: #7cd1ef;
  font-size: 34px;
  margin-bottom: 30px;
}
.remark{
  font-size: 24px;
  color: #c8c8c8;
  padding: 0 30px;
}
</style>

<template>
  <div style="text-align:left;background:#f6f6f6;">
    <div style="height:.5px;"></div>
    <!-- 智能停车 -->
    <div class="locationContent bgcontent defaultClass">
      <span>您已到达宝名二路（西乡东段）停车场</span>
    </div>
    <div class="payFn bgcontent">
      <!-- 付费方式 -->
      <div class="payFnTitle">付费方式</div>
      <div>
        <checker v-model="payVal" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item :value="item.key" v-for="(item, index) in items1" :key="index">{{item.value}}</checker-item>
        </checker>
      </div>
    </div>
    <div class="bgcontent">
      <!-- 泊位号 -->
      <div style="margin-bottom: .6px;">泊位编号号</div>
      <div class="parkingSpaceContent">
        <input maxlength="1" v-focus="focusStatus === index" v-model="item.key" :ref="'input' + index" type="text" @keyup="changeInput(index)" v-for="(item, index) in inputList" :key="index">
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
          <p><span>费用合计：</span>{{1}}</p>
        </div>
      </div>
      <div v-else class="afterParkingMessage">
        <!-- 后付费，查询钱包余额是否够一个小时，如果够则允许，超时为继续支付，就给管理人员发送消息。如果钱包不够就提示他无法后付费，并说明后付费需要满足的条件-->
        <p style="margin-bottom: 1px;">您钱包余额不足50元，无法使用后付费方式停车</p>
        <x-button mini>立即充值</x-button>
      </div>
      <x-button type="primary" @click.native="1" class="defaultClass">确认</x-button>
    </div>
  </div>
</template>
<script>
import {CheckIcon, Checker, CheckerItem, XInput, Group, Picker, PopupPicker, XButton} from 'vux'
export default {
  components: {
    CheckIcon,
    Checker,
    CheckerItem,
    XInput,
    Group,
    Picker,
    PopupPicker,
    XButton
  },
  data () {
    return {
      targetParkingNo: 0,
      payFn: false,
      payVal: '1',
      timeVal: ['1小时', '00分钟'],
      timeList: [['1小时', '2小时', '3小时', '4小时', '5小时', '6小时', '7小时', '8小时', '9小时', '10小时', '11小时', '12小时'], ['00分钟', '30分钟']],
      focusStatus: 0,
      items1: [{
        key: '1',
        value: '预付费'
      }, {
        key: '2',
        value: '后付费'
      }],
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
      parkingNo: '-'
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
      console.log(v)
      // this.timeVal
      let parkingNo = ''
      for (let i in this.inputList) {
        parkingNo += this.inputList[i].key
      }
      console.log(parkingNo)
      this.parkingNo = parkingNo
    },
    // 泊位号计算
    changeInput (index) {
      if (this.inputList[index].key && this.inputList[index].key.length > 0) {
        this.focusStatus = index + 1
      } else {
        this.focusStatus = index - 1
      }
      if (index === 5) {
        // 如果是最后一位，就查询是否有该车位
        console.log('最后一位')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
<style>
.defaultClass{
  font-size: 24px !important;
}
.popupPickerContent{
  height: 60px;
  line-height: 60px;
  font-size: 28px;
}
</style>

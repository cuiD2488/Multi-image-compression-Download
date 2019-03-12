<template>
  <div style="background: #f6f6f6;height:100%">
    <tab>
      <tab-item selected @on-item-click="getParkRecord">全部订单</tab-item>
      <tab-item @on-item-click="getParkRecord(1)">已完成</tab-item>
      <tab-item @on-item-click="getParkRecord(2)">欠费记录</tab-item>
      <tab-item @on-item-click="getParkRecord">违章查询</tab-item>
    </tab>
    <!-- 停车记录 -->
    <div class="parkingRecordContent">
      <div v-for="(item, index) in recordList" :key="index">
        <div class="location">{{item.city + item.county + item.detailedAddress + item.parkingLotName}}</div>
        <div class="date">
          <span>停车时间：</span>
          <span>{{item.enterTime}} 至 {{item.outTime}}</span>
        </div>
        <div class="date">
          <div>预付金额：<span style="color:#000">{{item.orderMoney}}元</span></div>
          <div>实付金额：<span style="color:#000">{{item.actualPayMoney}}元</span></div>
        </div>
        <div class="delLine">
          <div>{{item.orderStatus === 0 ? '待支付' : item.orderStatus === 1 ? '支付成功' : '待补缴'}}</div>
          <div class="deleteDiv">
            <x-button @click.native="sendCode" type="primary" mini text="删除" class="deleteBtn"></x-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ApiQueryPkOrder} from '@/api'
import { Tab, TabItem, XButton } from 'vux'

export default {
  components: {
    Tab,
    TabItem,
    XButton
  },
  data () {
    return {
      recordList: []
    }
  },
  methods: {
    // 获取停车记录
    async getParkRecord (n) {
      let data = {
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber
      }
      if (n) {
        data.orderStatus = n
      }
      const res = await ApiQueryPkOrder(data)
      if (res.code === 200) {
        let data = res.data.data
        for (let index in data) {
          data[index].enterTime = data[index].enterTime.substring(0, data[index].enterTime.length - 5)
          data[index].outTime = data[index].outTime.substring(0, data[index].outTime.length - 5)
          this.recordList.push(data[index])
        }
      }
    }
    // 删除停车记录
  },
  mounted () {
    // 挂载完成后调用获取停车信息接口
    this.getParkRecord()
  }
}
</script>
<style lang="less" scoped>
.parkingRecordContent{
  text-align: left;
  padding: 20px 0;
  font-size: 28px;
  >div {
    margin-bottom: 20px;
    background: #fff;
    padding: 40px 30px;
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
</style>

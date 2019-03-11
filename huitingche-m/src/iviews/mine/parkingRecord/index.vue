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
        <div class="location">{{item.location}}</div>
        <div class="date">
          <span>{{item.date}}</span>
          <span>{{item.begingTime}}至{{item.endTime}}</span>
        </div>
        <div class="stopTime">{{item.stopTime}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import {ApiQueryPkOrder} from '@/api'
import { Tab, TabItem } from 'vux'

export default {
  components: {
    Tab,
    TabItem
  },
  data () {
    return {
      recordList: [
        // {
        //   location: '深圳市宝安区西乡街道银田工业区停车场',
        //   date: '2019-02-16',
        //   begingTime: '10:00',
        //   endTime: '13:30',
        //   stopTime: '总停留3小时30分钟'
        // },
        // {
        //   location: '深圳市宝安区西乡街道银田工业区停车场',
        //   date: '2019-02-16',
        //   begingTime: '10:00',
        //   endTime: '13:30',
        //   stopTime: '总停留3小时30分钟'
        // }
      ]
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
        let 
        for (let index in data) {
          
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
    }
  }
</style>

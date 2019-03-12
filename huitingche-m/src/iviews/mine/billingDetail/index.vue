<template>
  <div class="page">
    <tab>
      <tab-item selected @on-item-click="getBillingDetail">全部</tab-item>
      <tab-item @on-item-click="getBillingDetail(1)">入账</tab-item>
      <tab-item @on-item-click="getBillingDetail(0)">支出</tab-item>
    </tab>
    <!-- 充值记录 -->
    <div class="billingContent">
      <div v-for="(item, index) in billingList" :key="index">
        <div class="itemLine">
          <div class="left">{{item.payCreateTime}}</div>
          <div class="right">{{item.payMoney}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {ApiQueryBill} from '@/api'
import { Tab, TabItem, XButton } from 'vux'

export default {
  components: {
    Tab,
    TabItem,
    XButton
  },
  data () {
    return {
      billingList: []
    }
  },
  methods: {
    // 获取账单明细
    async getBillingDetail (n) {
      let data = {
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber
      }
      if (n) {
        data.type = n
      }
      const res = await ApiQueryBill(data)
      if (res.errorCode === 200 && res.data) {
        // 清空展示数据重新写入
        this.billingList = []
        let data = res.data.data
        for (let index in data) {
          // 判断是否含有进出车时间,没有不展示
          if (data[index].enterTime && data[index].outTime) {
            data[index].enterTime = data[index].enterTime.substring(0, data[index].enterTime.length - 5)
            data[index].outTime = data[index].outTime.substring(0, data[index].outTime.length - 5)
            this.billingList.push(data[index])
          }
        }
      } else {
        this.$vux.toast.text(res.msg)
      }
    }
  },
  mounted () {
    // 挂载完成后调用获取账单明细
    this.getBillingDetail()
  }
}
</script>
<style lang="less" scoped>
.page{
  background: #f6f6f6;
  height:100%;
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
</style>

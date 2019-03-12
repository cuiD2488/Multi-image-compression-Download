<template>
  <div>
    <div class="parkingNumberContent" v-if="dataRules">
      <div>
        <div>目标停车场：{{dataRules.parkingLotName}}</div>
        <div>所在地址：{{dataRules.detailedAddress}}</div>
        <!-- <div>距离：>{{dataRules.parkingLotName}}</div> -->
      </div>
      <div>
        <div style="width: 50%;margin: 0 auto;">
          <x-circle
          :percent="percent"
          :stroke-width="5"
          stroke-color="#469fc9">
          <span>{{dataRules.freeParkingSpace}}/{{dataRules.parkingSpaceTotal}}</span>
          </x-circle>
          <p>车位</p>
        </div>
      </div>
    </div>
    <div class="tiemsSectionContent">
      <div class="title">收费时段</div>
      <div class="tiemsSectionTable">
        <div>
          <span>工作日</span>
        </div>
        <div>
          <div>
            <span>00:00-{{dataRules.pkChargingTimeVoList[0].chargingStartTime}}</span>
            <span>免费</span>
          </div>
          <div>
            <span>{{dataRules.pkChargingTimeVoList[0].chargingStartTime}}-{{dataRules.pkChargingTimeVoList[0].chargingEndTime}}</span>
            <span>收费</span>
          </div>
          <div>
            <span>{{dataRules.pkChargingTimeVoList[0].chargingEndTime}}-23:59</span>
            <span>免费</span>
          </div>
        </div>
      </div>
    </div>
    <div class="rulesContent">
      <div class="title">
        收费规则
      </div>
      <div class="rulesChildContent" v-for="(item, index) in dataRules.pkChargingRulesVoList" :key="index">
        <div>
          <span>{{item.ruleStartTime}}小时
            <span v-if="item.ruleEndTime">- {{item.ruleEndTime}}小时</span>
            <span v-else>以上</span></span>
          <span>{{item.ruleValue}}元</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XCircle, Range, Icon } from 'vux'
import {ApiqueryChargingRules} from '@/api'
export default {
  components: {
    XCircle,
    Range,
    Icon
  },
  data () {
    return {
      percent: 0,
      dataRules: {}
    }
  },
  methods: {
    async getChargingRules () {
      const data = {
        positionNumber: this.parkingNo
      }
      const res = await ApiqueryChargingRules(data)
      if (res.code === 200) {
        this.dataRules = res.data
        this.percent = ((res.data.freeParkingSpace / +res.data.parkingSpaceTotal) * 100)
      }
    }
  },
  mounted () {
    this.getChargingRules()
  }
}
</script>
<style lang="less" scoped>
.vux-circle-demo {
  text-align: center;
}
.vux-circle-demo > div {
  margin-left: auto;
  margin-right: auto;
}
.circle-demo-range {
  width: 250px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.parkingNumberContent{
  display: flex;
  justify-content: space-between;
  padding:40px;
  border-bottom: 1px solid #ddd;
  box-shadow: 2px 2px 2px 2px #ddd;
  >div {
    width: 50%;
  }
  >div:nth-child(1) {
    display: flex;
    text-align: left;
    align-items: center;
    flex-wrap: wrap;
  }
}
.title{
    padding: 0.277778rem;
    text-align: left;
    background: #469fc9;
    color: #fff;
}
.tiemsSectionContent{
  text-align: center;
  .tiemsSectionTable{
    display: flex;
    justify-content: space-around;
        border: 1px solid #ddd;
    >div:nth-child(1){
      width: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #ddd;
    }
    >div:nth-child(2) {
      width: 70%;
      >div{
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        padding: 20px;
      }
    }
  }
}
.rulesContent{
  .rulesChildContent{
    border: 1px solid #ddd;
    >div{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 20px;
    }
  }
}
</style>

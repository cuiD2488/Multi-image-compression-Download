<template>
  <div class="parkingrecord">
    <div class="pknav">
      <Input v-model="searchValue" @on-search="searchFind" class="search">
        <Select v-model="findeCondition" slot="prepend" style="width: 100px" placeholder="" >
          <Option v-for="item in conditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="searchFind"></Button>
      </Input>
      <Select style="width:200px" v-model="mergeConfition" @on-change="getStatus">
        <Option v-for="item in payStateList" :value="item.key" :key="item.value">{{ item.value }}</Option>
      </Select>
        <DatePicker type="daterange"
          :options="options"
          placeholder="请选择日期"
          placement="bottom-end"
          style="width: 200px;float: right"
          @on-change="handleDate">
        </DatePicker>
    </div>
    <tabledata
    ref="table"
    page-position="center"
    :columns="tableColumns"
    :queryUrl="queryUrl"
    :queryData="queryData"
    :axiosType="type"
    :current="page"
    :pageSize="num"
    :type="type"
    border
    ></tabledata>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {QUERYPkORDER} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '停车场编号',
          key: 'parkingLotNumber'
        },
        {
          title: '车位编号',
          key: 'positionNumber'
        },
        {
          title: '订单编号',
          key: 'orderNumber'
        },
        {
          title: '进车时间',
          key: 'enterTime'
        },
        {
          title: '出车时间',
          key: 'outTime'
        },
        {
          title: '订单总金额',
          key: 'orderMoney'
        },
        {
          title: '预付费金额',
          key: 'actualPayMoney'
        },
        {
          title: '购买时长',
          key: 'buyDuration'
        },
        {
          title: '状态',
          key: 'orderStatus'
        },
        {
          title: '预付费开始时间',
          key: 'buyStartTime'
        },
        {
          title: '创建时间',
          key: 'orderCreateTime'
        }
      ],
      queryUrl: QUERYPkORDER,
      queryData: {
        vendorId: 3,
        // vendorId: this.userInfo.vendorId,
        // vendorId: this.$store.getters.userInfo.vendorId,
        parkingLotNumber: '000002'
      },
      page: 1,
      num: 10,
      type: 'json',
      findeCondition: '',
      mergeConfition: '',
      searchValue: '',
      time: [],
      // 设置日期不能大于当天
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      conditionList: [
        {
          name: '停车场编号',
          key: 'parkingLotNumber'
        },
        {
          name: '车位编号',
          key: 'positionNumber'
        },
        {
          name: '订单编号',
          key: 'orderNumber'
        }
      ],
      payStateList: [
        {
          key: '1',
          value: '使用中'
        },
        {
          key: '2',
          value: '待补缴'
        },
        {
          key: '3',
          value: '已完成'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 选择日期
    handleDate (date) {
      this.time = date
      // if (this.time.length > 0) {
      //   data.startdate = this.time[0]
      //   data.enddate = this.time[0]
      // }
      console.log(this.time[0])
      console.log(this.time[1])
      this.queryData.startTime = this.time[0]
      this.queryData.endTime = this.time[1]
      console.log(this.queryData)
      // this.$refs.table.updateData()
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    searchFind () {
      console.log('条件搜索')
      this.queryData = {
        vendorId: 3
      }
      this.queryData[this.findeCondition] = this.searchValue
      // console.log(this.queryData)
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // getOrder (val) {
    //   // console.log('getOrderEvent')
    //   console.log(val)
    //   // this.queryData.push(val)
    //   // console.log(this.queryData)
    //   // this.queryData.orderStatus = val
    // },
    getStatus (val) {
      // console.log(val)
      // val == 每一个option对应的key值
      this.queryData.orderStatus = val
      console.log(this.queryData)
      this.$refs.table.updateData()
    }
  },
  mounted () {
    console.log(this.userInfo)
    // console.log('vendorId:' + this.userInfo.vendorId)
    // console.log(this.queryData)
    // this.$refs.table.updateData()
    // console.log(this.searchValue)
  }
}
</script>
<style lang="less" scoped>
.parkingrecord{
  // width: 200px;
  // height: 200px;
  // float: left;
  // background: red;
  position: absolute;
  top: 150px;
  left: 260px;
  height: 250px;
  width: 1100px;
  .pknav{
    display: flex;
    align-items: center;
    .search{
      width: 400px;
    }
  }
}
</style>

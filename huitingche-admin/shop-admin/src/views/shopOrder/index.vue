<template>
  <div class="shopOrder">
    <div class="btns">
      <div>
        <Select v-model="state" class="selectState" @on-change="selectState">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        <Input v-model="searchVal" style="width:400px;" placeholder="请输入订单号或者用户手机号搜索" >
         <Select v-model="searchItemVal" slot="prepend" style="width: 80px">
            <Option v-for="item in searchOptionList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="searchOrder"></Button>
      </Input>
      </div>
      <div>
        <Button style="float:right" type="info" class="mgl" @click="cancePage">{{num === 10000 ? '分页显示' : '全部显示'}}</Button>
        <Button style="float:right" type="warning" class="mgl" @click="clickExportOrder">导出订单</Button>
        <DatePicker type="daterange" 
                    :options="options"
                    placeholder="请选择日期"
                    placement="bottom-end"
                    style="width: 200px;float: right"
                    @on-change="handleDate">
        </DatePicker>
      </div>
    </div>
    <div class="orderList">
      <Order :columns="orderColumns"
             :data="listData"
             :checkList="checkList" 
             :stateList="stateList"
             :total="total"
             :current="page"
             :num="num"
             :distribution="true"
             @on-freash="handleFreash"></Order>
    </div>   
    <Modal
      v-model="modal2"
      title="物流信息">
      <div v-if="logisticsList === ''">暂无物流信息</div>
      <div v-else>
        <Timeline>
          <TimelineItem v-for="(item, index) in logisticsList.list" :key="index">
            <p class="time" v-text="item.time"></p>
            <p class="content" v-text="item.status"></p>
          </TimelineItem>
        </Timeline>
      </div>
    </Modal>
  </div>
</template>

<script>
import Order from '@/components/orderdata'
import { ApiGetOrderList, ApiExport } from '@/api'
export default{
  components: {
    Order
  },
  data () {
    return {
      searchVal: '',
      searchItemVal: 'orderNo',
      searchOptionList: [
        {
          value: 'orderNo',
          label: '订单号'
        },
        {
          value: 'userId',
          label: '手机号'
        }
      ],
      time: [],
      id: this.$cookies.get('userInfo').id,
      state: -1,
      num: 10,
      page: 1,
      total: 0,
      checkList: [],
      modal2: false,
      listData: [],
      logisticsList: [],
      // 设置日期不能大于当天
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      orderColumns: [
        {
          title: '全选',
          key: 'all'
        },
        {
          title: '商品名称',
          width: 300,
          key: 'goodsName'
        },
        {
          title: '单价',
          width: 120,
          key: 'price'
        },
        {
          title: '数量',
          width: 120,
          key: 'number'
        },
        {
          title: '交易状态',
          width: 140,
          key: 'state'
        },
        // {
        //   title: '是否需要终端机',
        //   width: 160,
        //   key: 'isNeedMachine'
        // },
        // {
        //   title: '终端设备号',
        //   width: 150,
        //   key: 'machinecode'
        // },
        {
          title: '物流单号',
          width: 150,
          key: 'logistics'
        },
        {
          title: '操作',
          width: 150
        }
      ],
      stateList: [
        {
          value: -1,
          label: '全部订单'
        },
        {
          value: 0,
          label: '待支付'
        },
        {
          value: 1,
          label: '支付成功待发货'
        },
        {
          value: 2,
          label: '商家处理中'
        },
        {
          value: 3,
          label: '已发货'
        },
        {
          value: 4,
          label: '已收货'
        },
        {
          value: 5,
          label: '退货'
        },
        {
          value: 6,
          label: '取消订单'
        }
      ]
    }
  },
  methods: {
    // 搜索订单
    searchOrder () {
      this.getOrderList(1)
    },
    cancePage () {
      if (this.num === 10000) {
        this.num = 10
      } else {
        this.num = 10000
      }
      this.getOrderList()
    },
    // 选择日期
    handleDate (date) {
      this.time = date
    },
    // 选择订单状态
    selectState (value) {
      this.state = value
      this.getOrderList()
    },
    // 点击导出订单
    clickExportOrder () {
      this.$Modal.confirm({
        content: '确认导出订单吗？',
        onOk: () => {
          this.exportOrder()
        }
      })
    },
    // 导出订单
    async exportOrder () {
      const list = []
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i]) {
          list.push(this.listData[i].id)
        }
      }
      const data = {}
      data.integer = this.id
      if (this.state != -1) {
        data.state = this.state
      }
      if (list.length > 0) {
        data.ids = list.join(',')
      }
      if (this.time.length > 0) {
        data.startdate = this.time[0]
        data.enddate = this.time[0]
      }
      console.log(data)
      const res = await ApiExport(data)
    },
    handleFreash () {
      this.getOrderList()
    },
    // 获取订单列表
    async getOrderList (state) {
      const loading = this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      const data = {
        eid: this.$cookies.get('userInfo').id,
        page: this.page,
        num: this.num,
        state: this.state
      }
      if (this.searchVal && state === 1) {
        data[this.searchItemVal] = this.searchVal
      }
      const res = await ApiGetOrderList(data)
      setTimeout(loading, 500)
      if (res.errorCode > 0) {
        this.listData = res.data
        this.total = +res.msg
      }
      var number = 0
      for (var i of this.listData) {
        this.checkList[number] = false
        number++
        i.createtime = this.utils.timeFormat(i.createtime)
        // this.listData[i].createtime = this.utils.timeFormat(this.listData[i].createtime)
        // console.log(this.listData[i].createtime)
      }
    },
    // 换页更新表数据
    changePage (item) {
    }
  },
  watch: {
    page () {
      this.getOrderList()
    }
  },
  mounted () {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>

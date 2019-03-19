<template>
  <div class="parkingrecord">
    <!-- 搜索导航 -->
    <div class="pknav">
      <Input v-model="searchValue" @on-enter="searchFind" @on-search="searchFind" class="search" placeholder="手机号查询">
        <Button slot="append" icon="ios-search" @click="searchFind"></Button>
      </Input>
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
import {URLfindVendorIdByPkUser} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '头像',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.headImgUrl,
                  style: 'border-radius: 50%;width: 30%;'
                }
              })
            ], params.row.headImgUrl)
          }
        },
        {
          title: '微信名',
          key: 'nickName'
        },
        // {
        //   title: '性别',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', params.row.sex === 1 ? '男' : '女')
        //   }
        // },
        {
          title: '手机号',
          align: 'center',
          key: 'userId'
        },
        {
          title: '车牌号',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.abbreviation && params.row.carNumber ? params.row.abbreviation + params.row.carNumber : '未绑定')
          }
        },
        {
          title: '余额 (元)',
          key: 'balance'
        },
        {
          title: '是否管理员',
          render: (h, params) => {
            return h('div', params.row.whetherAdmin ? '是' : '否')
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', params.row.createTime.slice(0, params.row.createTime.length - 5))
          }
        }
      ],
      queryUrl: URLfindVendorIdByPkUser,
      queryData: {},
      page: 1,
      num: 10,
      type: 'json',
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
          key: '0',
          value: '全部状态'
        },
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
        vendorId: this.userInfo.vendorId
      }
      if (this.searchValue !== '') {
        this.queryData.userId = this.searchValue
      } else {
        this.$Message.info('您输入的内容有误')
      }
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
      // this.queryData.orderStatus = val
      if (val === 0) {
        this.queryData.orderStatus = null
      } else {
        this.queryData.orderStatus = val
      }
      console.log(this.queryData)
      this.$refs.table.updateData()
    }
  },
  created () {
    // 在create周期内向组件添加参数
    this.queryData = {
      vendorId: this.userInfo.vendorId
    }
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
    justify-content: space-between;
    .search{
      width: 400px;
    }
    // >div:nth-child(0) {
    // width:400px;
    // }
    // >div:nth-child(1) {
    // width:400px;
    // }
  }
}
</style>

<template>
  <div class="parkingrecord">
    <div class="pknav">
      <Input v-model="searchValue" @on-search="searchFind" class="search">
        <Select v-model="findeCondition" slot="prepend" style="width: 100px">
          <Option v-for="item in conditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="searchFind"></Button>
      </Input>
      <Select style="width:200px" v-model="mergeConfition" @on-change="optionChange">
        <Option v-for="item in payStateList" :value="item.key" :key="item.name">{{ item.name }}</Option>
      </Select>
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
        },
        {
          title: '操作',
          align: 'center',
          width: 220,
          render: (h, param) => {
            // return (<div>操作</div>)
            return h('div', [
              h('Button', {
                style: {
                  'margin-right': '10px'
                }
              }, '删除'),
              h('Button', {}, '编辑')
            ])
          }
        }
      ],
      queryUrl: QUERYPkORDER,
      queryData: {
        vendorId: 3,
        // vendorId: this.$store.getters.userInfo.vendorId,
        parkingLotNumber: '000001'
      },
      page: 1,
      num: 10,
      type: 'json',
      findeCondition: '',
      mergeConfition: '',
      searchValue: '',
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
          name: '使用中'
        },
        {
          key: '2',
          name: '待补缴'
        },
        {
          key: '3',
          name: '已完成'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    searchFind () {
      console.log('条件搜索')
    },
    optionChange () {
      console.log('optionchange')
    }
  },
  mounted () {
    console.log(this.userInfo)
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

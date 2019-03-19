<template>
  <div class="parkingrecord">
    <!-- 搜索导航 -->
    <div class="pknav">
      <Input v-model="searchValue" @on-enter="searchFind" @on-search="searchFind" class="search">
        <Select v-model="findeCondition" slot="prepend" style="width: 100px">
          <Option v-for="item in conditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
        </Select>
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
import {URLqueryParkingLotManager, ApiDisableParkingLotManager} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      // 表格列信息
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
          title: '姓名',
          key: 'managerName'
        },
        {
          title: '手机号',
          align: 'center',
          key: 'phone'
        },
        {
          title: '角色',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.role === 1 ? '系统管理员' : params.row.role === 2 ? '停车场管理员' : '路段管理员')
          }
        },
        {
          title: '上级姓名',
          key: 'superiorManagerName'
        },
        {
          title: '注册时间',
          render: (h, params) => {
            return h('div', params.row.createTime.slice(0, params.row.createTime.length - 5))
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                prop: {
                  disabled: params.row.status === 1
                },
                // 按钮点击事件
                on: {
                  click: () => {
                    // 调用停用管理员接口
                    this.delManager(params.row.managerNumber)
                  }
                }
              }, params.row.status === 0 ? '停用该管理员' : '已停用')
            ])
          }
        }
      ],
      // 选择框信息
      conditionList: [
        {
          name: '手机号',
          key: 'phone'
        },
        {
          name: '管理员姓名',
          key: 'managerName'
        }
      ],
      queryUrl: URLqueryParkingLotManager,
      queryData: {},
      page: 1,
      num: 10,
      type: 'json',
      mergeConfition: '',
      searchValue: '',
      time: [],
      findeCondition: '',
      // 设置日期不能大于当天
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 搜索框
    searchFind () {
      this.queryData = {
        vendorId: this.userInfo.vendorId
      }
      if (this.findeCondition === 'phone') {
        this.queryData.phone = this.searchValue
      } else {
        this.queryData.managerName = this.searchValue
      }
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 停用管理员
    async delManager (managerNumber) {
      let data = {
        vendorId: this.userInfo.vendorId,
        managerNumber: managerNumber,
        status: 1
      }
      const res = await ApiDisableParkingLotManager(data)
      if (res.code === 200 && res.msg === 'success') {
        this.$nextTick(() => {
          this.$refs.table.updateData()
        })
      }
    }
  },
  created () {
    // 在create周期内向组件添加参数
    this.queryData = {
      vendorId: this.userInfo.vendorId
    }
    if (this.userInfo.role === 2) {
      this.queryData.superiorNumber = this.userInfo.superiorNumber
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

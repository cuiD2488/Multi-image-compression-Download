<template>
  <div class="parkingrecord">
    <div class="searchContent">
      <Input search v-model="searchValue" @on-search="searchFind">
        <Select v-model="findeCondition" slot="prepend" style="width: 80px">
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
      :current="page"
      :pageSize="num"
      :type="type"
    ></tabledata>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLfindParkingLotByCondition} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '停车场名称',
          align: 'center',
          key: 'parkingLotName'
        },
        {
          title: '停车场地址',
          align: 'center',
          key: 'detailedAddress'
        },
        {
          title: '停车场编号',
          align: 'center',
          key: 'parkingLotNumber'
        },
        {
          title: '管理员',
          align: 'center',
          key: 'managerName'
        },
        {
          title: '管理员联系方式',
          align: 'center',
          key: 'enterTime'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
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
      queryUrl: URLfindParkingLotByCondition,
      queryData: {
        vendorId: 3
      },
      page: 1,
      num: 10,
      type: 'json',
      findeCondition: '',
      searchValue: '',
      conditionList: [
        {
          name: '停车场名称',
          key: 'parkingLotName'
        },
        {
          name: '停车场编号',
          key: 'parkingLotNumber'
        },
        {
          name: '管理员',
          key: 'managerName'
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
}
.searchContent{
  width: 400px;
}
</style>

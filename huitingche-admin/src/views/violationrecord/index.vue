<template>
  <div class="violationrecord">
    <div class="searchContent">
      <Input v-model="searchValue" @on-enter="searchFind" @on-search="searchFind" class="search">
        <Select v-model="findeCondition" slot="prepend" style="width: 100px" placeholder="请选择" >
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
    <Modal
      v-model="showViolationIMG"
      width= 100%
      align="center"
      title="展示违停图片"
      @on-cancel="showViolationIMG = false">
        <Carousel loop>
          <CarouselItem v-for="item in imgArr" :key="item.id">
              <img :src="item" alt="">
          </CarouselItem>
        </Carousel>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLqueryPkViolation} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '违停编号',
          key: 'violationNumber'
        },
        {
          title: '车位编号',
          key: 'positionNumber'
        },
        {
          title: '车牌号',
          render: (h, param) => {
            return h('div', [
              h('p', {
                style: {
                  'margin-right': '10px'
                }
              }, param.row.abbreviation + param.row.numberPlate)
            ])
          }
        },
        {
          title: '操作人',
          key: 'managerNumber'
        },
        {
          title: '违停图片',
          align: 'center',
          width: 220,
          render: (h, param) => {
            return h('div', [
              h('p', {
                style: {
                  'margin-right': '10px'
                },
                on: {
                  click: () => {
                    // console.log('点击查看图片')
                    this.showViolationIMG = true
                    let violationImage = param.row.violationImage
                    this.imgArr = violationImage.split(',')
                    console.log(this.imgArr)
                  }
                }
              }, '点击查看图片')
            ])
          }
        },
        {
          title: '违停原因',
          key: 'reasons'
        },
        {
          title: '订单编号',
          key: 'violationCreateTime'
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
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '操作确认',
                      content: '确认删除吗？',
                      onOk: () => {
                        alert('删除成功')
                      }
                    })
                  }
                }
              }, '删除'),
              h('Button', {
                on: {
                  click: () => {
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      conditionList: [
        {
          name: '车牌号',
          key: 'numberPlate'
        },
        {
          name: '车位编号',
          key: 'positionNumber'
        },
        {
          name: '操作人',
          key: 'managerNumber'
        }
      ],
      imgArr: [],
      showViolationIMG: false,
      searchValue: '',
      findeCondition: '',
      queryUrl: URLqueryPkViolation,
      queryData: {
        vendorId: 3
      },
      page: 1,
      num: 10,
      type: 'json'
    }
  },
  methods: {
    searchFind () {
      console.log('条件搜索')
      this.queryData = {
        vendorId: 3
      }
      this.queryData[this.findeCondition] = this.searchValue
      // let order = this.queryData.orderStatus
      // 加上状态作为参数一并传到后台
      // this.queryData.orderStatus = this.order
      // console.log(this.queryData)
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    console.log(this.userInfo)
    console.log('vendorId:' + this.userInfo.vendorId)
    // console.log('this.queryData:' + this.queryData)
    // this.$refs.table.updateData()
    // console.log(this.searchValue)
  }
}
</script>
<style lang="less" scoped>
.violationrecord{
  // width: 200px;
  // height: 200px;
  // float: left;
  // background: red;
  position: absolute;
  top: 150px;
  left: 260px;
  height: 250px;
  width: 1100px;
  .search{
    width: 400px;
  }
}
</style>

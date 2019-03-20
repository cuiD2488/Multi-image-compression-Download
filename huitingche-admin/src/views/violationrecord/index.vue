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
      width= "500"
      align="center"
      title="展示违停图片"
      @on-cancel="showViolationIMG = false">
        <Carousel loop v-if="showViolationIMG">
          <CarouselItem v-for="item in imgArr" :key="item.id">
            <img :src="item">
          </CarouselItem>
        </Carousel>
    </Modal>
    <!-- <Modal
      v-model="showEditBox"
      title="编辑"
      @on-ok="editViolation"
      @on-cancel="showEditBox = false">
      <div>
          <Form ref="formValidate" :model="editViolationForm" :rules="editViolationFormRule" :label-width="100">
            <FormItem label="违停编号" prop="violationNumber">
              <Input v-model="editViolationForm.reasons" placeholder="请输入违停原因"></Input>
            </FormItem>
            <FormItem label="车位编号" prop="positionNumber">
              <Input v-model="editViolationForm.positionNumber" placeholder="请输入车位编号"></Input>
            </FormItem>
            <FormItem label="车牌号" prop="numberPlate">
              <Input v-model="editViolationForm.numberPlate" placeholder="请输入车牌号"></Input>
            </FormItem>
            <FormItem label="操作人" prop="managerName">
              <Input v-model="editViolationForm.reasons" placeholder="请输入违停原因"></Input>
            </FormItem>
            <FormItem label="违停原因" prop="reasons">
              <Input v-model="editViolationForm.reasons" placeholder="请输入违停原因"></Input>
            </FormItem>
        </Form>
      </div>
    </Modal> -->
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLqueryPkViolation, ApiDeletePkViolation, ApiUpdatePkViolation} from '@/api'
// , URLUpdatePkViolation, ApiupdatePkViolation, URLdeletePkViolation, ApiDeletePkViolation
import {mapGetters} from 'vuex'
// import { userInfo } from 'os'
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
          key: 'managerName'
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
          title: '违停创建时间',
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
                        // alert('删除成功')
                        this.deleteViolation(param.row)
                      }
                    })
                  }
                }
              }, '删除'),
              h('Button', {
                on: {
                  click: () => {
                    // 弹出模态框
                    // 把车位编号 车牌号 违停原因三个字段的值带过去
                    this.showEditBox = true
                    // this.targetParkingLotNumber = param.row.parkingLotNumber
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      conditionList: [
        {
          name: '选择全部',
          key: '0'
        },
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
      editViolationForm: {
        // 携带数据
      },
      showEditBox: '',
      imgArr: [],
      showViolationIMG: false,
      searchValue: '',
      findeCondition: '',
      queryUrl: URLqueryPkViolation,
      // queryData: {
      //   vendorId: 3
      // },
      queryData: {},
      page: 1,
      num: 10,
      type: 'json'
    }
  },
  methods: {
    editViolation () {
      console.log('showEidtModal')
    },
    searchFind () {
      console.log('条件搜索')
      this.queryData = {
        vendorId: this.userInfo.vendorId
      }
      this.queryData[this.findeCondition] = this.searchValue
      // 如果选择全部，则列表展示原始拉取状态
      if (this.searchValue === '0') {
        this.queryData = {
          vendorId: this.userInfo.vendorId
        }
      }
      // let order = this.queryData.orderStatus
      // 加上状态作为参数一并传到后台
      // this.queryData.orderStatus = this.order
      // console.log(this.queryData)
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 删除违停记录
    async deleteViolation (item) {
      const data = {
        // vendorId: this.userInfo.vendorId,
        violationNumber: item.violationNumber
      }
      const res = await ApiDeletePkViolation(data)
      console.log(res)
      // 删除后更新表单
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 编辑违停记录
    async eaditViolation (item) {
      console.log(222222)
      const data = {
        positionNumber: item.positionNumber,
        numberPlate: item.numberPlate,
        reasons: item.reasons
      }
      const res = await ApiUpdatePkViolation(data)
      if (res.Code > 0) {
        this.$Message.success('编辑成功')
        this.$nextTick(() => {
          this.$refs.table.updateDate()
        })
        // this.eaditObj = null
      }
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
  },
  created () {
    this.queryData.vendorId = this.userInfo.vendorId
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

<template>
  <div class="parkinglist">
    <div class="searchContent">
      <div>
        <Input search v-model="searchValue" @on-search="searchFind">
          <Select v-model="findeCondition" slot="prepend" style="width: 120px">
            <Option v-for="item in conditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
          </Select>
          <Button slot="append" icon="ios-search" @click="searchFind"></Button>
        </Input>
      </div>
      <div>
        <Input search placeholder="输入单次查询条数" style="width: auto" @on-search="changeTableNum" v-model="num">
          <Icon type="ios-search" slot="suffix" />
        </Input>
      </div>
      <div v-if="userInfo.role === 2">
        <Button @click="distributionShow = true" type="primary">分配车位</Button>
        <Button @click="getAuother" type="primary">授权路段管理员</Button>
        <Button @click="showParkingAddBox = true" type="primary">新增车位</Button>
      </div>
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
      @on-select="onSelect"
      @on-select-all="onSelectAll"
    ></tabledata>
    <!-- 新增车位 -->
    <Modal
      v-model="showParkingAddBox"
      title="新增车位"
      @on-ok="addPosition"
      @on-cancel="showParkingAddBox = false">
      <div>
          <Form ref="formValidate" :model="addPositionForm" :rules="addPositionFormRule" :label-width="100">
            <FormItem label="车位编号" prop="positionNumber">
              <Input v-model="addPositionForm.positionNumber" placeholder="请输入车位编号"></Input>
            </FormItem>
            <FormItem label="设备编号" prop="deviceId">
              <Input v-model="addPositionForm.deviceId" placeholder="请输入设备编号"></Input>
            </FormItem>
            <FormItem label="地磁编号" prop="geomagnetismNumber">
              <Input v-model="addPositionForm.geomagnetismNumber" placeholder="请输入地磁编号"></Input>
            </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 停车位管理授权 -->
    <Modal
      v-model="autherButtonShow"
      width="220"
      align="center"
      title="授权停车场管理"
      @on-ok="autherButtonShow = false"
      @on-cancel="autherButtonShow = false"
    >
      <div id="qrCodeContent">
      </div>
    </Modal>
    <!-- 分配车位 -->
    <Modal
      v-model="distributionShow"
      width="220"
      align="center"
      title="选择分配给谁"
      @on-ok="distributionConfrim"
      @on-cancel="distributionShow = false"
    >
      <div>
        <Select v-model="targetParkingManager" size="small" style="width:100px">
          <Option v-for="item in parkingLogManagerList" :value="item.managerNumber" :key="item.managerNumber">{{ item.managerName }}</Option>
        </Select>
      </div>
    </Modal>
    <Modal
      v-model="showEditParkingPositionBox"
      title="编辑车位信息"
      @on-ok="editParkingPosition"
      @on-cancel="showEditParkingPositionBox = false">
      <div>
          <Form ref="formValidate" :model="editParkingPositionForm" :label-width="100">
            <FormItem label="停车场名称">
              <Input v-model="editParkingPositionForm.parkingLotName" placeholder="请输入停车场名称" disabled></Input>
            </FormItem>
            <FormItem label="停车场编号">
              <Input v-model="editParkingPositionForm.parkingLotNumber" placeholder="请输入停车场编号" disabled></Input>
            </FormItem>
            <FormItem label="泊位号">
              <Input v-model="editParkingPositionForm.positionNumber" placeholder="请输入泊位号"></Input>
            </FormItem>
            <FormItem label="设备编号">
              <Input v-model="editParkingPositionForm.deviceId" placeholder="请输入设备编号"></Input>
            </FormItem>
            <FormItem label="地磁编号">
              <Input v-model="editParkingPositionForm.geomagnetismNumber" placeholder="请输入地磁编号"></Input>
            </FormItem>
            <FormItem label="路段管理员">
              <Input v-model="editParkingPositionForm.managerName" placeholder="请输入路段管理员" disabled></Input>
            </FormItem>
            <FormItem label="管理员联系方式">
              <Input v-model="editParkingPositionForm.managerNumber" placeholder="请输入管理员联系方式" disabled></Input>
            </FormItem>
            <FormItem label="创建时间">
              <Input v-model="editParkingPositionForm.createTime" placeholder="请输入创建时间" disabled></Input>
            </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {
  URLfindPositionByCondition,
  // ApiAddParkingLot,
  ApiAddParkingPosition,
  ApigetQrCodeByManageNumber,
  ApiQueryParkingLotManager,
  ApiaddPositionManager,
  ApiUpdateParkingPosition
} from '@/api'
import {mapGetters} from 'vuex'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    tabledata,
    VDistpicker
  },
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '停车场名称',
          align: 'center',
          key: 'parkingLotName'
        },
        // {
        //   title: '停车场地址',
        //   align: 'center',
        //   key: 'detailedAddress'
        // },
        {
          title: '停车场编号',
          align: 'center',
          key: 'parkingLotNumber'
        },
        {
          title: '泊位号',
          align: 'center',
          key: 'positionNumber'
        },
        {
          title: '设备编号',
          align: 'center',
          key: 'deviceId'
        },
        {
          title: '地磁编号',
          align: 'center',
          key: 'geomagnetismNumber'
        },
        {
          title: '路段管理员',
          align: 'center',
          render: (h, params) => {
            return (<div>{params.row.managerName ? params.row.managerName : '暂无'}</div>)
          },
          key: 'managerName'
        },
        // {
        //   title: '路段管理员',
        //   align: 'center',
        //   key: 'managerName',
        //   render: (h, param) => {
        //     return h('div', [
        //       param.row.managerName ? h('span', param.row.managerName) : h('Button', {
        //         on: {
        //           click: async () => {
        //             document.getElementById('qrCodeContent').innerHTML = ''
        //             this.autherButtonShow = true
        //             const data = {
        //               manageNumber: param.row.manageNumber
        //             }
        //             const res = await ApigetQrCodeByManageNumber(data)
        //             if (res.code === 200) {
        //               console.log(3)
        //               this.$nextTick(() => {
        //                 this.utils.qrcode('qrCodeContent', res.data, 150)
        //               })
        //             } else {
        //               this.$Message.error('获取二维码失败')
        //             }
        //           }
        //         }
        //       }, '授权管理员')
        //     ])
        //   }
        // },
        {
          title: '管理员联系方式',
          align: 'center',
          key: 'phone'
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
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '操作确认',
                      content: '确认删除吗？',
                      onOk: () => {
                        // alert('删除成功')
                        // console.log('hello')
                        this.deleteParkingPosition(param.row)
                      }
                    })
                  }
                }
              }, '删除'),
              h('Button', {
                on: {
                  click: () => {
                    // console.log('hello')
                    this.editParkingPositionForm = param.row
                    this.showEditParkingPositionBox = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      queryUrl: URLfindPositionByCondition,
      queryData: {},
      page: 1,
      num: 10,
      type: 'json',
      findeCondition: '',
      searchValue: '',
      conditionList: [
        {
          name: '查看全部',
          key: '0'
        },
        {
          name: '车位编号',
          key: 'positionNumber'
        },
        {
          name: '停车场编号',
          key: 'parkingLotNumber'
        },
        {
          name: '管理员名称',
          key: 'managerName'
        }
      ],
      addPositionForm: {
        // vendorId: 3,
        // vendorId: this.userInfo.vendorId,
        positionNumber: '',
        deviceId: '',
        geomagnetismNumber: ''
        // detailedAddress: '',
        // parkingLotName: ''
      },
      showParkingAddBox: false,
      addPositionFormRule: {
        positionNumber: [
          { required: true, message: '请输入6位车位编号', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        geomagnetismNumber: [
          { required: true, message: '请输入地磁编号', trigger: 'blur' }
        ]
      },
      autherButtonShow: false,
      distributionShow: false,
      parkingLogManagerList: null,
      targetParkingManager: '',
      targetManagerNumberList: [],
      showEditParkingPositionBox: false,
      editParkingPositionForm: {
        // 存放从param.row传递过来的数据
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 编辑车位
    async editParkingPosition () {
      const data = {
        vendorId: this.userInfo.vendorId,
        // 车位号码 泊位号
        positionNumber: this.editParkingPositionForm.positionNumber,
        // 设备号
        deviceId: this.editParkingPositionForm.deviceId,
        // 地磁编号
        geomagnetismNumber: this.editParkingPositionForm.geomagnetismNumber
      }
      const res = await ApiUpdateParkingPosition(data)
      if (res.code === 200) {
        this.$Message.success('编辑提交成功')
        this.$refs.table.updateData()
      } else {
        this.$Message.info('编辑违停信息失败')
      }
      // 更新表格
      this.$refs.table.updateData()
    },
    // 查询停车场管理员下的路段管理员
    async findParkingLotManager () {
      const data = {
        vendorId: this.userInfo.vendorId,
        superiorNumber: this.userInfo.managerNumber
      }
      const res = await ApiQueryParkingLotManager(data)
      console.log(res)
      if (res.code === 200) {
        this.parkingLogManagerList = res.data
      } else {
        this.$Message.error('查询失败')
      }
    },
    // 单独点击选择框
    onSelect (v, i) {
      this.targetManagerNumberList = []
      for (let i in v) {
        this.targetManagerNumberList.push(v[i].positionNumber)
      }
    },
    // 选择全部
    onSelectAll (v, i) {
      console.log(v)
      console.log(i)
    },
    // 改变table单页查询总条数
    changeTableNum () {
      this.$refs.table.updateData()
      // this.num = this.pageSize
    },
    // 分配完成，提交
    async distributionConfrim () {
      console.log(this.targetManagerNumberList)
      if (this.targetManagerNumberList.length === 0) {
        this.$Message.error('请选择车位')
        return false
      }
      if (!this.targetParkingManager) {
        this.$Message.error('请选择分配给谁')
        return false
      }
      const data = {
        parkingLotNumber: '000002',
        managerNumber: this.targetParkingManager,
        positionNumberList: this.targetManagerNumberList.toString()
      }
      const res = await ApiaddPositionManager(data)
      if (res.code === 200) {
        this.$Message.success('分配成功')
      }
    },
    searchFind () {
      delete this.queryData.positionNumber
      delete this.queryData.parkingLotNumber
      delete this.queryData.managerName
      this.queryData = {
        vendorId: this.userInfo.vendorId
      }
      this.queryData[this.findeCondition] = this.searchValue
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 授权完成
    autherConfrim () {
      this.autherButtonShow = false
      this.$refs.table.updateData()
    },
    // 授权路段管理员
    async getAuother () {
      const msg = this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      document.getElementById('qrCodeContent').innerHTML = ''
      const data = {
        manageNumber: this.userInfo.managerNumber
      }
      const res = await ApigetQrCodeByManageNumber(data)
      if (res.code === 200) {
        console.log(3)
        // this.$nextTick(() => {
        this.utils.qrcode('qrCodeContent', res.data, 150)
        this.autherButtonShow = true
        setTimeout(msg, 0)
        // })
      } else {
        this.$Message.error('获取二维码失败')
      }
    },
    // 新增停车场
    async addPosition () {
      console.log('新增车位')
      let data = {...this.addPositionForm}
      console.log(data)
      const res = await ApiAddParkingPosition(data)
      if (res.code === 200) {
        this.$Message.success('新增成功')
      } else {
        this.$Message.success(res.msg)
      }
      // 更新表格
      // this.$refs.table.updateData()
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 删除车位
    async deleteParkingPosition (item) {
      const data = {
        // vendorId: this.userInfo.vendorId,
        // violationNumber: item.violationNumber
        status: 1,
        positionNumber: item.positionNumber
      }
      const res = await ApiUpdateParkingPosition(data)
      console.log(res)
      // 删除后更新表单
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    }
  },
  mounted () {
    this.findParkingLotManager()
    console.log(this.userInfo)
  },
  created () {
    // 初始化查询参数
    this.queryData.vendorId = this.userInfo.vendorId
    if (this.userInfo.role === 2) {
      this.queryData.superiorNumber = this.userInfo.managerNumber
    }
  }
}
</script>
<style lang="less" scoped>
.parkinglist{
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  >div:nth-child(1) {
    width:400px;
  }
}
</style>

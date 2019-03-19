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
      <div v-if="userInfo.role === 1">
        <Button @click="getAuother" type="primary">分配车位</Button>
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
    <!-- 新增停车场 -->
    <Modal
      v-model="showParkingAddBox"
      title="新增停车场"
      @on-ok="addParking"
      @on-cancel="showParkingAddBox = false">
      <div>
          <Form ref="formValidate" :model="addParkingForm" :rules="addParkingFormRule" :label-width="100">
            <FormItem label="停车场名字" prop="parkingLotName">
              <Input v-model="addParkingForm.parkingLotName" placeholder="请输入停车场名字"></Input>
            </FormItem>
            <FormItem label="详细地址" prop="detailedAddress">
              <Input v-model="addParkingForm.detailedAddress" placeholder="请输入详细地址"></Input>
            </FormItem>
            <FormItem label="详细地址" prop="detailedAddress">
              <v-distpicker :province="select.province" :city="select.city" :area="select.county"></v-distpicker>
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
      v-model="autherButtonShow"
      width="220"
      align="center"
      title="分配车位"
      @on-ok="autherButtonShow = false"
      @on-cancel="autherButtonShow = false"
    >
      <div id="qrCodeContent">
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLfindPositionByCondition, ApiAddParkingLot, ApigetQrCodeByManageNumber} from '@/api'
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
        // {
        //   title: '地磁编号',
        //   align: 'center',
        //   key: 'geomagnetismNumber'
        // },
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
      queryUrl: URLfindPositionByCondition,
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
      addParkingForm: {
        vendorId: 3,
        detailedAddress: '',
        parkingLotName: ''
      },
      showParkingAddBox: false,
      addParkingFormRule: {
        parkingLotName: [
          { required: true, message: '请输入停车场名字', trigger: 'blur' }
        ],
        detailedAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      select: { province: '广东省', city: '广州市', county: '海珠区' },
      autherButtonShow: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 单独点击选择框
    onSelect (v, i) {
      console.log(v)
      console.log(i)
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
    searchFind () {
      this.queryData = {
        vendorId: 3
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
    async addParking () {
      let data = {...this.addParkingForm, ...this.select}
      console.log(data)
      const res = await ApiAddParkingLot(data)
      if (res.code === 200) {
        this.$Message.success('新增成功')
      } else {
        this.$Message.success(res.msg)
      }
      // 更新表格
      this.$refs.table.updateData()
    }
  },
  mounted () {
    console.log(this.userInfo)
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

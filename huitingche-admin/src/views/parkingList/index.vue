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
        <Button @click="showParkingAddBox = true" type="primary">新增停车场</Button>
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
    <!-- 授权二维码 -->
    <Modal
      v-model="autherButtonShow"
      width="220"
      align="center"
      title="授权停车场管理"
      @on-ok="autherConfrim"
      @on-cancel="autherButtonShow = false"
    >
    <!-- 查看规则 -->
     <Modal
      v-model="showRule"
      title="停车场规则"
      @on-ok="ruleConfrim"
      width="550"
      @on-cancel="showRule = false">
      <div>
        <Form ref="formValidate" :model="aruleForm" :rules="aruleFormRule" :label-width="100">
          <FormItem label="收费日期" prop="isCharge">
            <RadioGroup v-model="aruleForm.isCharge">
              <Radio label="全天" :disabled="targetShowRule === 1">全天收费</Radio>
              <Radio label="工作日" :disabled="targetShowRule === 1">工作日收费</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="收费时段" prop="date">
            <Col span="12">
              <TimePicker :disabled="targetShowRule === 1" v-model="aruleForm.date" confirm  format="HH:mm" type="timerange" placement="bottom-end" placeholder="请选择收费时间段" style="width: 168px"></TimePicker>
            </Col>
          </FormItem>
          <FormItem label="一档计价标准" prop="detailedAddress">
            <Input disabled v-model="valuationList[0].ruleStartTime" placeholder="起始时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleEndTime" placeholder="截止时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleValue" placeholder="普通单价价格" style="width:100px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].whiteRuleValue" placeholder="白名单单价" style="width:100px;"></Input>
          </FormItem>
           <FormItem label="二档计价标准" prop="detailedAddress">
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleEndTime" placeholder="起始时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleEndTime" placeholder="截止时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleValue" placeholder="普通单价价格" style="width:100px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].whiteRuleValue" placeholder="白名单单价" style="width:100px;"></Input>
          </FormItem>
           <FormItem label="三档计价标准" prop="detailedAddress">
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleEndTime" placeholder="起始时间" style="width:80px;"></Input>
            -
            <Input disabled v-model="valuationList[2].ruleEndTime" placeholder="截止时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[2].ruleValue" placeholder="普通单价价格" style="width:100px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[2].whiteRuleValue" placeholder="白名单单价" style="width:100px;"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
      <div id="qrCodeContent">
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLfindParkingLotByCondition, ApiAddParkingLot, ApigetQrCode, ApiAddChargingRules, ApiQueryChargingRules, ApiUpdateChargingRules} from '@/api'
import {mapGetters} from 'vuex'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    tabledata,
    VDistpicker
  },
  data () {
    return {
      targetShowRule: 0,
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
          key: 'managerName',
          render: (h, params) => {
            return h('div', [
              params.row.managerName ? h('span', params.row.managerName) : h('Button', {
                on: {
                  click: async () => {
                    document.getElementById('qrCodeContent').innerHTML = ''
                    this.autherButtonShow = true
                    const data = {
                      parkingLotNumber: params.row.parkingLotNumber
                    }
                    const res = await ApigetQrCode(data)
                    if (res.code === 200) {
                      console.log(3)
                      this.$nextTick(() => {
                        this.utils.qrcode('qrCodeContent', res.data, 150)
                      })
                    } else {
                      this.$Message.error('获取二维码失败')
                    }
                  }
                }
              }, '授权管理员')
            ])
          }
        },
        {
          title: '管理员联系方式',
          align: 'center',
          key: 'phone'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'lotCreateTime'
        },
        {
          title: '操作',
          align: 'center',
          width: 220,
          render: (h, param) => {
            // return (<div>操作</div>)
            return h('div', {
              style: {
                'display': 'flex',
                'flex-wrap': 'wrap'
              }
            }, [
              h('Button', {
                style: {
                  'width': '80px',
                  'margin': '4px'
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
                style: {
                  'width': '80px',
                  'margin': '4px'
                },
                on: {
                  click: () => {
                  }
                }
              }, '编辑'),
              h('Button', {
                style: {
                  'width': '80px',
                  'margin': '4px'
                },
                on: {
                  click: () => {
                    this.targetParkingLotNumber = param.row.parkingLotNumber
                    if (param.row.whetherRule !== 0) {
                      this.findRule(param.row)
                      this.targetShowRule = 1
                    } else {
                      this.targetShowRule = 0
                      this.clarRuleAll()
                    }
                    this.showRule = true
                  }
                }
              }, param.row.whetherRule === 0 ? '新增规则' : '查看规则'),
              param.row.whetherRule !== 0 ? h('Button', {
                style: {
                  'width': '80px',
                  'margin': '4px'
                },
                on: {
                  click: () => {
                    this.targetParkingLotNumber = param.row.parkingLotNumber
                    this.targetShowRule = 2
                    if (param.row.whetherRule !== 0) {
                      this.findRule(param.row)
                    }
                    this.showRule = true
                  }
                }
              }, '编辑规则') : ''
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
      aruleFormRule: {
        date: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
      select: { province: '广东省', city: '广州市', county: '海珠区' },
      autherButtonShow: false,
      showRule: false,
      aruleForm: {
        isCharge: '全天',
        date: ''
      },
      valuationList: [
        {
          'ruleStartTime': '0',
          'ruleEndTime': '',
          'ruleValue': '',
          'whiteRuleValue': ''
        },
        {
          'ruleStartTime': '',
          'ruleEndTime': '',
          'ruleValue': '',
          'whiteRuleValue': ''
        },
        {
          'ruleStartTime': '',
          'ruleEndTime': '以上',
          'ruleValue': '',
          'whiteRuleValue': ''
        }
      ],
      targetParkingLotNumber: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 条件查询停车场
    searchFind () {
      console.log('条件搜索')
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
    // 查询停车场规则
    async findRule (item) {
      const data = {
        parkingLotNumber: item.parkingLotNumber,
        positionNumber: item.positionNumber
      }
      const res = await ApiQueryChargingRules(data)
      console.log(res)
      if (res.code === 200) {
        this.iviewRuleData = res.data
        this.valuationList = res.data.pkChargingRulesVoList
        for (let i in this.valuationList) {
          delete this.valuationList[i].id
          delete this.valuationList[i].parkingLotNumber
          delete this.valuationList[i].ruleCreateTime
        }
        this.aruleForm.date = [res.data.pkChargingTimeVoList[0].chargingEndTime, res.data.pkChargingTimeVoList[0].chargingStartTime]
        this.aruleForm.isCharge = res.data.pkChargingTimeVoList[0].chargingDate
        // this.aruleForm = res.data
      }
      console.log(33333333333)
    },
    // 初始化规则输入框数据
    clarRuleAll () {
      this.valuationList = [
        {
          'ruleStartTime': '0',
          'ruleEndTime': '',
          'ruleValue': '',
          'whiteRuleValue': ''
        },
        {
          'ruleStartTime': '',
          'ruleEndTime': '',
          'ruleValue': '',
          'whiteRuleValue': ''
        },
        {
          'ruleStartTime': '',
          'ruleEndTime': '以上',
          'ruleValue': '',
          'whiteRuleValue': ''
        }
      ]
      this.aruleForm = {
        isCharge: '全天',
        date: ''
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
    },
    // 规则设置/编辑完成
    async ruleConfrim () {
      if (this.targetShowRule === 1) {
        return false
      }
      for (let i in this.valuationList) {
        for (let j in this.valuationList[i]) {
          if (!this.valuationList[i][j]) {
            console.log(this.valuationList[i][j])
            console.log(this.valuationList[i])
            this.$Message.error('规则设置不能为空')
            return false
          }
        }
      }
      const data = {
        'parkingLotNumber': this.targetParkingLotNumber,
        'pkChargingRulesVoList': this.valuationList,
        'pkChargingTimeVoList': [
          {
            'chargingDate': this.aruleForm.isCharge,
            'chargingStartTime': this.aruleForm.date[0],
            'chargingEndTime': this.aruleForm.date[1]
          }
        ]
      }
      console.log(JSON.stringify(data))
      let res
      let codeText
      if (this.targetShowRule === 0) {
        res = await ApiAddChargingRules(data)
        codeText = '新增成功'
      } else {
        res = await ApiUpdateChargingRules(data)
        codeText = '编辑成功'
      }
      if (res.code === 200) {
        this.$Message.success(codeText)
      }
      console.log(res)
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

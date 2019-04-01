<template>
  <div class="parkinglist">
    <!-- 搜索栏 -->
    <div class="searchContent">
      <div>
        <!-- <Input search v-model="searchValue" @on-search="searchFind">
          <Button slot="append" icon="ios-search" @click="searchFind"></Button>
        </Input> -->
        <Input v-model="searchValue" @on-enter="searchFind" @on-search="searchFind" class="search">
          <Select v-model="findeCondition" slot="prepend" style="width: 100px" placeholder="请选择" >
            <Option v-for="item in conditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
          </Select>
          <Button slot="append" icon="ios-search" @click="searchFind"></Button>
        </Input>
      </div>
      <div>
        <Button @click="showParkingAddBox = true" type="primary">新增停车场</Button>
      </div>
    </div>
    <!-- 表格展示 -->
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
      width="40"
      @on-ok="addParking"
      @on-cancel="showParkingAddBox = false">
      <div>
          <Form ref="formValidate" :model="addParkingForm" :rules="addParkingFormRule" :label-width="100">
            <FormItem label="停车场名字" prop="parkingLotName">
              <Input v-model="addParkingForm.parkingLotName" placeholder="请输入停车场名字"></Input>
            </FormItem>
            <FormItem label="省市区" prop="detailedAddress">
              <v-distpicker :province="select.province" :city="select.city" :area="select.county" @selected="changeSelect"></v-distpicker>
            </FormItem>
            <FormItem label="详细地址" prop="detailedAddress">
              <Input v-model="addParkingForm.detailedAddress" placeholder="请输入详细地址"></Input>
            </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 编辑停车场 -->
    <Modal
      v-model="editParkFlag"
      title="编辑停车场"
      width="40"
      @on-ok="editPark"
      @on-cancel="editParkFlag = false">
      <div>
          <Form ref="formValidate" :model="editParkInform" :rules="editParkingFormRule" :label-width="100">
            <!--  -->
            <FormItem label="停车场名字" prop="parkingLotName">
              <!--  -->
              <Input v-model="editParkInform.parkingLotName" placeholder="请输入停车场名字"></Input>
            </FormItem>
            <FormItem label="省市区">
              <!--  -->
              <!-- <v-distpicker :province="select.province" :city="select.city" :area="select.county" @selected="changeSelect"></v-distpicker> -->
              <v-distpicker :province="select.province" :city="select.city" :area="select.county" @selected="changeSelect"></v-distpicker>
            </FormItem>
            <FormItem label="详细地址" prop="detailedAddress">
              <!--  -->
              <Input v-model="editParkInform.detailedAddress"></Input>
            </FormItem>
            <FormItem label="停车场编号">
              <Input disabled v-model="editParkInform.parkingLotNumber"></Input>
            </FormItem>
            <FormItem label="管理员">
              <Input disabled v-model="editParkInform.managerName"></Input>
            </FormItem>
            <FormItem label="管理员联系方式">
              <Input disabled v-model="editParkInform.phone"></Input>
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
      @on-cancel="autherButtonShow = false">
      <div id="qrCodeContent">
      </div>
    </Modal>
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
              <!-- 添加时间间隔 -->
              <TimePicker :disabled="targetShowRule === 1" v-model="aruleForm.date" confirm :steps="[1, 30]" format="HH:mm" type="timerange" placement="bottom-end" placeholder="请选择收费时间段" style="width: 168px"></TimePicker>
            </Col>
          </FormItem>
          <FormItem>
            <div style="color: red;">填写规则:</div>
            <div style="color: red; line-height: 1.5;">例: 0 - 1 - 1 - 0 表示1在收费时间段内停车1小时,普通用户1元/半小时,白名单用户为0元/半小时</div>
          </FormItem>
          <FormItem label="一档计价标准" prop="detailedAddress">
            <Input disabled v-model="valuationList[0].ruleStartTime" placeholder="起始时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleEndTime" placeholder="截止时间" style="width:80px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleValue" placeholder="普通单价价格" style="width:100px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].whiteRuleValue" placeholder="白名单单价" style="width:100px;" number></Input>
          </FormItem>
           <FormItem label="二档计价标准" prop="detailedAddress">
            <Input :disabled="targetShowRule === 1" v-model="valuationList[0].ruleEndTime" placeholder="起始时间" style="width:80px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleEndTime" placeholder="截止时间" style="width:80px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleValue" placeholder="普通单价价格" style="width:100px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].whiteRuleValue" placeholder="白名单单价" style="width:100px;" number></Input>
          </FormItem>
           <FormItem label="三档计价标准" prop="detailedAddress">
            <Input :disabled="targetShowRule === 1" v-model="valuationList[1].ruleEndTime" placeholder="起始时间" style="width:80px;" number></Input>
            -
            <Input disabled v-model="valuationList[2].ruleEndTime" placeholder="截止时间" style="width:80px;"></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[2].ruleValue" placeholder="普通单价价格" style="width:100px;" number></Input>
            -
            <Input :disabled="targetShowRule === 1" v-model="valuationList[2].whiteRuleValue" placeholder="白名单单价" style="width:100px;" number></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLfindParkingLotByCondition, ApiAddParkingLot, ApigetQrCode, ApiAddChargingRules, ApiQueryChargingRules, ApiUpdateChargingRules, ApiDeleteParkingLot, ApiUpdateParkingLot} from '@/api'
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
                    const msg = this.$Message.loading({
                      content: '加载中...',
                      duration: 0
                    })
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
                    setTimeout(msg, 0)
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
          render: (h, params) => {
            // 增加判断
            return h('div', params.row.lotCreateTime ? (params.row.lotCreateTime.slice(0, params.row.lotCreateTime.length - 5)) : '')
            // return h('div', params.row.lotCreateTime.slice(0, params.row.lotCreateTime.length - 5))
          }
          // key: 'lotCreateTime'
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
                        this.deleteParking(param.row)
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
                    this.editParkInform = JSON.parse(JSON.stringify(param.row))
                    this.editParkFlag = true
                    this.select.province = param.row.province
                    this.select.city = param.row.city
                    this.select.county = param.row.county
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
          name: '停车场名称',
          key: 'parkingLotName'
        },
        {
          name: '管理员',
          key: 'managerName'
        }
      ],
      addParkingForm: {
        // vendorId: this.userInfo.vendorId,
        detailedAddress: '',
        parkingLotName: ''
      },
      showParkingAddBox: false,
      editParkingFormRule: {
        parkingLotName: [
          { required: true, message: '请输入停车场名字', trigger: 'blur' }
        ],
        detailedAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
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
      // select: { province: '广东省', city: '广州市', county: '海珠区' },
      select: {
        province: '',
        city: '',
        county: ''
      },
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
      targetParkingLotNumber: '',
      // 编辑停车场信息
      editParkFlag: false,
      // 编辑弹窗中展示的信息
      editParkInform: {}
    }
  },
  computed: {
    // queryData () {
    //   const data = {
    //     vendorId: this.userInfo.vendorId
    //   }
    //   return data
    // },
    ...mapGetters(['userInfo'])
  },
  created () {
    this.queryData = {
      vendorId: this.userInfo.vendorId
    }
    console.log(this.queryData)
  },
  methods: {
    searchFind () {
      // 如果未选择下拉框
      console.log('条件搜索')
      delete this.queryData.parkingLotNumber
      delete this.queryData.positionName
      // 增加.trim()方法去除两边空格
      this.queryData[this.findeCondition] = this.searchValue.trim()
      // 如果选择 查看全部 ，则列表展示原始拉取状态
      // if(this.searchValue){}
      if (this.findeCondition === '0') {
        // 选择全部时 清空输入框的值
        this.searchValue = ''
        // 选择 查看全部  queryData的其他参数不变
        this.queryData = {
          vendorId: this.userInfo.vendorId
        }
      }
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 条件查询停车场
    // searchFind () {
    //   console.log('条件搜索')
    //   // console.log(this.conditionList)
    //   // delete this.queryData.parkingLotName
    //   // delete this.queryData.managerName
    //   this.queryData[this.findeCondition] = this.searchValue
    //   // console.log(this.searchValue)
    //   if (this.findeCondition === '0') {
    //     // 选择全部时 清空输入框的值
    //     this.searchValue = ''
    //     // 选择 查看全部  queryData的其他参数不变
    //     this.queryData = {
    //       vendorId: this.userInfo.vendorId
    //     }
    //   }
    // },
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
      // console.log(33333333333)
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
      console.log('add')
      // 设置省市选择为空
      // 循环设置对象里面的属性为空
      // for (let i = 0; i < this.select.length; i++) {
      //   this.select[i] = ''
      // }
      let data = {
        ...this.addParkingForm,
        ...this.select,
        vendorId: this.userInfo.vendorId
      }
      console.log(this.select)
      const res = await ApiAddParkingLot(data)
      if (res.code === 200) {
        this.$Message.success('新增成功')
      } else {
        this.$Message.success(res.msg)
      }
      // 更新表格
      this.$refs.table.updateData()
      // 清缓存
      // this.select.province = ''
      // this.select.city = ''
      // this.select.county = ''
      // this.addParkingForm.parkingLotName = ''
      // this.addParkingForm.detailedAddress = ''
      for (let i in this.select) {
        this.select[i] = ''
      }
      for (let i in this.addParkingForm) {
        this.addParkingForm[i] = ''
      }
    },
    // 删除停车场
    async deleteParking (item) {
      const data = {
        // vendorId: this.userInfo.vendorId,
        vendorId: this.userInfo.vendorId,
        parkingLotNumber: item.parkingLotNumber
      }
      const res = await ApiDeleteParkingLot(data)
      console.log(res)
      // 更新表格
      this.$refs.table.updateData()
    },
    // 规则设置/编辑完成
    async ruleConfrim () {
      if (this.targetShowRule === 1) {
        this.$Message.error('规则设置不能为空')
        return false
      }
      console.log(this.aruleForm.data)
      if (!this.aruleForm.data) {
        this.$Message.error('收费时段不能为空')
        return false
      }
      // 将用户输入的上一档的结束时间赋值给下一档的开始时间
      this.valuationList[1].ruleStartTime = this.valuationList[0].ruleEndTime
      this.valuationList[2].ruleStartTime = this.valuationList[1].ruleEndTime
      this.valuationList[2].ruleEndTime = 9999
      for (let i in this.valuationList) {
        for (let j in this.valuationList[i]) {
          if (!this.valuationList[i][j]) {
            // console.log('进入判断1')
            // console.log(i)
            // console.log('进入判断2')
            // console.log(j)
            // console.log('进入判断3')
            // console.log(this.valuationList[i][j])
            // console.log('进入判断4')
            // console.log(this.valuationList[i])
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
      // console.log(JSON.stringify(data))
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
        // 更新表格
        this.$refs.table.updateData()
      }
      console.log(res)
    },
    // 编辑停车场信息
    async editPark () {
      console.log(this.editParkInform)
      let data = {
        parkingLotName: this.editParkInform.parkingLotName,
        detailedAddress: this.editParkInform.detailedAddress,
        parkingLotNumber: this.editParkInform.parkingLotNumber,
        vendorId: this.userInfo.vendorId,
        // id
        id: this.editParkInform.id,
        // this.select 拿到当前选择的省市
        ...this.select
      }
      const res = await ApiUpdateParkingLot(data)
      if (res.code === 200) {
        this.$Message.success('提交成功')
        this.$refs.table.updateData()
      } else {
        this.$Message.info('编辑停车场信息失败')
      }
    },
    // 修改v-distpicker地址信息
    changeSelect (selected) {
      this.select.county = selected.area.value // 注意参数名与组件方法的区别
      this.select.city = selected.city.value
      this.select.province = selected.province.value
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

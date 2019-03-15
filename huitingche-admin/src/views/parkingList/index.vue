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
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLfindParkingLotByCondition, ApiAddParkingLot} from '@/api'
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
      select: { province: '广东省', city: '广州市', county: '海珠区' }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
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

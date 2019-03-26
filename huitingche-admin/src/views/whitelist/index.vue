<template>
  <div class="whitelist">
    <div class="whitenav">
      <Button type="primary" @click="showWhitelistAddBox = true">新增白名单</Button>
        <Input v-model="searchValue" @on-enter="searchFind" @on-search="searchFind" placeholder="车牌号查询" class="search">
        <!-- @on-enter="searchFind" @on-search="searchFind" class="search" -->
          <Button slot="append" icon="ios-search" @click="searchFind"></Button>
          <!-- @click="searchFind" -->
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
    <!-- 新增白名单 -->
    <Modal
      v-model="showWhitelistAddBox"
      title="新增白名单"
      @on-ok="addWhitelist"
      @on-cancel="showWhitelistAddBox = false">
      <div>
        <!-- :rules="editViolationFormRule" -->
          <Form ref="formValidate" :model="addWhitelistForm" :rules="addWhitelistFormRule" :label-width="100">
             <!-- :rules="editWhitlistFormRule" -->
            <!-- <FormItem label="操作人" prop="operator" >
              <Input v-model="addWhitelistForm.operator" placeholder="请输入操作人"></Input>
            </FormItem> -->
            <FormItem label="车牌号" prop="abbreviationcarNumber">
              <Input v-model="addWhitelistForm.abbreviationcarNumber" placeholder="请输入车牌号" maxlength="10"></Input>
            </FormItem>
            <FormItem label="备注" prop="remark">
              <Input v-model="addWhitelistForm.remark" placeholder="请输入备注"></Input>
            </FormItem>
            <!-- <FormItem label="车牌号">
              <Input :value="addWhitelistForm.abbreviation + addWhitelistForm.carNumber" placeholder="请输入车牌号"></Input>
            </FormItem> -->
        </Form>
      </div>
    </Modal>
    <!-- 编辑白名单 -->
    <Modal
      v-model="showEditBox"
      title="编辑"
      @on-ok="editWhitelist"
      @on-cancel="showEditBox = false">
      <div>
        <!-- :rules="editViolationFormRule" -->
          <Form ref="formValidate" :model="editWhitelistForm" :label-width="100">
             <!-- :rules="editWhitlistFormRule" -->
            <FormItem label="操作人">
              <Input v-model="editWhitelistForm.operator" placeholder="请输入操作人" disabled></Input>
            </FormItem>
            <FormItem label="车牌号">
              <Input :value="editWhitelistForm.abbreviation + editWhitelistForm.carNumber" placeholder="请输入车牌号"></Input>
            </FormItem>
            <FormItem label="备注">
              <Input v-model="editWhitelistForm.remark" placeholder="请输入备注"></Input>
            </FormItem>
            <FormItem label="创建时间">
              <Input v-model="editWhitelistForm.whiteCreateTime" placeholder="创建时间" disabled></Input>
            </FormItem>
            <!-- <FormItem label="创建时间">
              <Input :value="editWhitlistForm.whiteCreateTime.slice(0, editWhitlistForm.whiteCreateTime.length-5)" placeholder="创建时间"></Input>
            </FormItem> -->
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {URLqueryPkWhitelist, ApiDeletePkWhitelist, ApiUpdatePkWhitelist, ApiAddPkWhitelist} from '@/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '车牌号',
          render: (h, param) => {
            return h('div', [
              h('p', {
                style: {
                  'margin-right': '10px'
                }
              }, param.row.abbreviation + param.row.carNumber)
            ])
          }
        },
        {
          title: '操作人',
          key: 'operator'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return h('div', params.row.whiteCreateTime.slice(0, params.row.whiteCreateTime.length - 5))
          }
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
                        this.deleteWhiteList(param.row)
                      }
                    })
                  }
                }
              }, '删除'),
              h('Button', {
                on: {
                  click: () => {
                    // 弹出模态框
                    // 把该行所有的字段的值带过去
                    // param.row就是这一行的所有字段
                    this.editWhitelistForm = param.row
                    this.editWhitelistForm.whiteCreateTime = param.row.whiteCreateTime.slice(0, param.row.whiteCreateTime.length - 5)
                    this.showEditBox = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      showWhitelistAddBox: false,
      addWhitelistForm: {
        operator: '',
        remark: '',
        abbreviationcarNumber: ''
      },
      addWhitelistFormRule: {
        // operator: [
        //   { required: true, message: '请输入操作人', trigger: 'blur' }
        // ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        // 车牌号非必传
        abbreviationcarNumber: [
          // { required: true, message: '请输入车牌号（10位）', min: 6, max: 10, trigger: 'blur' }
          { required: true, message: '请输入车牌号', min: 6, max: 10, trigger: 'blur' }
          // { }
        ]
      },
      searchValue: '',
      showEditBox: false,
      editWhitelistForm: {
        abbreviationcarNumber: ''
      },
      queryUrl: URLqueryPkWhitelist,
      queryData: {},
      page: 1,
      num: 10,
      type: 'json'
    }
  },
  methods: {
    searchFind () {
      console.log('条件搜索')
      // this.queryData = {
      //   vendorId: this.userInfo.vendorId
      // }
      if (this.searchValue !== '') {
        // 简称 前两位
        this.queryData.abbreviation = this.searchValue.substring(0, 2)
        // console.log(this.queryData.abbreviation)
        // 车牌号 5位或6位
        this.queryData.carNumber = this.searchValue.substring(2)
        console.log(this.queryData.carNumber)
        this.queryData = {
          vendorId: this.userInfo.vendorId,
          abbreviation: this.queryData.abbreviation,
          carNumber: this.queryData.carNumber
        }
      } else {
        // this.$Message.info('您输入的内容有误')
        delete this.queryData.abbreviation
        delete this.queryData.carNumber
        this.queryData.vendorId = this.userInfo.vendorId
      }
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 新增白名单
    async addWhitelist () {
      // console.log(this.userInfo)
      // console.log(325)
      console.log(this.addWhitelistForm.abbreviationcarNumber)
      let data = {
        // 需要传递的参数
        vendorId: this.userInfo.vendorId,
        managerNumber: this.userInfo.managerNumber,
        remark: this.addWhitelistForm.remark,
        whiteCreateTime: this.addWhitelistForm.whiteCreateTime,
        abbreviation: this.addWhitelistForm.abbreviationcarNumber.substring(0, 2),
        carNumber: this.addWhitelistForm.abbreviationcarNumber.substring(2)
        // abbreviation: this.addWhitelistForm.abbreviation,
        // carNumber: this.addWhitelistForm.carNumber
      }
      const res = await ApiAddPkWhitelist(data)
      if (res.code === 200) {
        this.$Message.success('新增成功')
      } else {
        this.$Message.success(res.msg)
      }
      // 更新表格
      this.$refs.table.updateData()
    },
    // 删除白名单
    async deleteWhiteList (item) {
      const data = {
        vendorId: this.userInfo.vendorId,
        id: item.id
        // vendorId: 3
        // violationNumber: item.violationNumber
      }
      const res = await ApiDeletePkWhitelist(data)
      console.log(res)
      // 删除后更新表单
      this.$nextTick(() => {
        this.$refs.table.updateData()
      })
    },
    // 编辑白名单
    async editWhitelist () {
      const data = {
        vendorId: this.userInfo.vendorId,
        // 白名单id
        id: this.editWhitelistForm.id,
        // 车牌
        abbreviation: this.editWhitlistForm.abbreviation,
        carNumber: this.editWhitelistForm.carNumber,
        // 备注
        remark: this.editWhitelistForm.remark
        // // 操作人
        // managerName: this.editWhitlistForm.managerName
      }
      const res = await ApiUpdatePkWhitelist(data)
      if (res.code === 200) {
        this.$Message.success('编辑提交成功')
        this.$refs.table.updateData()
      } else {
        this.$Message.info('编辑违停信息失败')
      }
      // 更新表格
      this.$refs.table.updateData()
    }
    // searchFind () {
    //   console.log(1)
    // }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.queryData.vendorId = this.userInfo.vendorId
    // typeof (this.editWhitlistForm.abbreviationcarNumber)
  }
}
</script>
<style lang="less" scoped>
.whitelist{
  // width: 200px;
  // height: 200px;
  // float: left;
  // background: red;
  position: absolute;
  top: 150px;
  left: 260px;
  height: 250px;
  width: 1100px;
  .whitenav{
    display: flex;
    justify-content: space-between;
    .search{
      width: 400px;
    }
  }
}
</style>

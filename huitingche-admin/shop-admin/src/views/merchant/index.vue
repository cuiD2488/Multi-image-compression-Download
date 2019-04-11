<style lang="less">
  @import './index.less';
</style>

<template lang="html">
  <div class="merchant">
    <div class="merchant-operation shercHead">
      <Select v-model="statusVal" style="width:150px" @on-change="changeState">
        <Option v-for="item in statusData" :value="item.value" :key="item.value" v-text="item.label"></Option>
      </Select>
      <Input v-model="serchVal" style="width:450px;" placeholder="请输入手机号或公司名称">
        <Select v-model="serchKey" slot="prepend" style="width:100px;" placeholder>
          <Option v-for="item in serchSelects" :key="item.value" :value="item.value" v-text="item.label"></Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="findChild"></Button>
      </Input>
      <Button type="primary" size="large" @click="handleAddMerchant">添加子公司/商户</Button>
    </div>
    <tabledata border 
    :columns="merchantColumns" 
    pagePosition="center" 
    :queryUrl="url"
    :queryData="data"
    :pageSize="num"
    :current="page"
    type="json"
    ref="merchantTable"></tabledata>
    <!-- 添加子商户弹框 -->
    <Modal
      title="添加子公司/商户"
      @on-cancel="handleAddMerchantCancel"
      @on-ok="submit"
      :loading="loading"
      v-model="modalVisibility">
      <div class="notice">温馨提示：邮箱和电话为登录账号</div>
      <Form ref="merchantForm" :label-width="100" :model="addMerchantForm" :rules="addMerchantRules">
        <FormItem prop="name" label="公司/商户名称">
          <Input v-model="addMerchantForm.name"></Input>
        </FormItem>
        <FormItem prop="creator" label="联系人姓名">
          <Input v-model="addMerchantForm.creator"></Input>
        </FormItem>
        <FormItem prop="account" label="邮箱">
          <Input v-model="addMerchantForm.account"></Input>
        </FormItem>
        <FormItem prop="phone" label="电话">
          <Input v-model="addMerchantForm.phone"></Input>
        </FormItem>
        <FormItem prop="address" label="地址">
          <Input v-model="addMerchantForm.address"></Input>
        </FormItem>
        <FormItem prop="password" label="密码">
          <Input v-model="addMerchantForm.password" type="password"></Input>
        </FormItem>
        <FormItem prop="passwd" label="确认密码">
          <Input v-model="addMerchantForm.passwd" type="password"></Input>
        </FormItem>
        <FormItem prop="logo" label="logo">
          <Upload
          :action="addPicAdress"
          :data="{ imgType: 'shop' }"
          name="image"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png']"
          :on-success="hanldeUploadSuccess"
          :on-error="handleUploadError">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传主图</Button>
          </Upload>
          <img style="width: 50%;" :src="addMerchantForm.image" alt="">
        </FormItem>
      </Form>
    </Modal>
    <!-- 修改子商户弹框 -->
    <Modal
      title="修改子公司/商户信息"
      @on-cancel="handleAddMerchantCancel"
      @on-ok="submitEdit"
      :loading="loading"
      v-model="modalEdit">
      <Form ref="editChildren" :label-width="100" :model="editMerchantForm" :rules="EditMerchantRules">
        <FormItem prop="name" label="公司/商户名称">
          <Input v-model="editMerchantForm.name"></Input>
        </FormItem>
        <FormItem prop="creator" label="联系人姓名">
          <Input v-model="editMerchantForm.creator"></Input>
        </FormItem>
        <FormItem prop="address" label="地址">
          <Input v-model="editMerchantForm.address"></Input>
        </FormItem>
        <FormItem prop="image" label="logo">
          <Upload
          :action="addPicAdress"
          :data="{ imgType: 'shop' }"
          name="image"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png']"
          :on-success="hanldeUploadSuccess_edit"
          :on-error="handleUploadError">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传主图</Button>
          </Upload>
          <img style="width: 50%;" :src="editMerchantForm.image" alt="">
        </FormItem>
        <FormItem label="修改密码">
          <i-switch v-model="isEditPsw" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="密码" v-show="isEditPsw">
          <Input v-model="editMerchantForm.password" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码" v-show="isEditPsw">
          <Input v-model="editMerchantForm.passwd" type="password"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- // 设置提点弹框 -->
    <Modal
        v-model="royaltyModal"
        title="设置平台提点"
        @on-ok="addRoyalty"
        @on-cancel="royaltyModal = false">
          <Form
            ref="addRoyaltyDom"
            :model="addRoyaltyForm"
            :label-width="100" 
            style="width:65%;margin: 0 auto;"
          >
            <FormItem label="提点类型">
              <RadioGroup v-model="addRoyaltyForm.Royaltyfunction">
                  <Radio label="2">
                    <Icon type="logo-apple"></Icon>
                    <span>按固定值提点</span>
                  </Radio>
                  <Radio label="1">
                    <Icon type="logo-android"></Icon>
                    <span>按比例提点</span>
                  </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem :label="+addRoyaltyForm.Royaltyfunction === 2 ? '固定值提点' : '百分比提点'">
              <InputNumber :max="10" :min="1" v-model="addRoyaltyForm.RoyaltyVal" v-if="+addRoyaltyForm.Royaltyfunction === 2"></InputNumber>
               <InputNumber label="easdf"
                v-else
                :min="0"
                :max="100"
                v-model="addRoyaltyForm.RoyaltyVal"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"></InputNumber>
            </FormItem>
          </Form>
    </Modal>
    <!-- 审核框 -->
    <Modal
      v-model="checkModal"
      title="审核子商户"
      @on-ok="checkModalOk"
      @on-cancel="checkModalCancel"
      width="800">
      <div>
        <Card class="cardItem">
          <label v-text="'商家名称：'"></label>
          <span v-text="checkTargetData.name"></span>
        </Card>
        <Card class="cardItem">
          <label v-text="'邮箱：'"></label>
          <span v-text="checkTargetData.account"></span>
        </Card>
        <Card class="cardItem">
          <label v-text="'商家地址：'"></label>
          <span v-text="checkTargetData.address"></span>
        </Card>
        <Card class="cardItem">
          <label v-text="'身份证正面：'"></label>
          <img :src="'http://' + checkTargetData.identityCardFront"/>
        </Card>
        <Card class="cardItem">
          <label v-text="'身份证反面：'"></label>
          <img :src="'http://' + checkTargetData.identityCardVerso"/>
        </Card>
        <Card class="cardItem">
          <label v-text="'营业执照：'"></label>
          <img :src="'http://' + checkTargetData.businessLicense"/>
        </Card>
        <Card class="cardItem">
          <label v-text="'联系方式：'"></label>
          <span v-text="checkTargetData.phone"></span>
        </Card>
        <Card class="cardItem">
          <label v-text="'审核状态：'"></label>
          <span v-text="checkTargetData.status === 1 ? '待审核' : checkTargetData.status === 2 ? '驳回申请' : '已通过'"></span>
        </Card>
        <div>
          <i-switch v-model="checkSwitch" size="large">
            <span slot="open">通过</span>
            <span slot="close">驳回</span>
          </i-switch>
          <div style="padding:10px 0;" v-if="!checkSwitch">
            <Input v-model="rejectCause" type="textarea" placeholder="请输入驳回原因" />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  ApiGetAddChildren,
  ApiGetPhoneIsExist,
  ApiGetAccountIsExist,
  ApiGetDeleteChildren,
  ApiGetEditChildren,
  API_UPLOADPIC,
  ApisettingSalesPoint,
  ApicheckSubEnterprise
} from '@/api'
import {mapGetters} from 'vuex'
import tabledata from '@/components/tabledata'

export default {
  components: {
    tabledata
  },
  data () {
    return {
      checkSwitch: false,
      rejectCause: '',
      checkModal: false,
      // 状态查询下拉框
      statusData: [
        {
          value: -1,
          label: '选择状态'
        },
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '待审核'
        }
      ],
      statusVal: 0,
      // 搜索框查询子商户
      serchVal: null,
      serchKey:  0,
      serchSelects: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '公司名称',
          value: 2
        },
        {
          label: '手机号',
          value: 3
        }
      ],
      addRoyaltyForm: {
        Royaltyfunction: '2',
        RoyaltyVal: 1
      },
      royaltyModal: false,
      RoyaltyVal: '',
      isEditPsw: false,
      loading: true,
      modalVisibility: false,
      modalEdit: false,
      // url: '/getEnterpriseByParentId.json',
      url: '/getSubEnterprise.json',
      addPicAdress: API_UPLOADPIC,
      page: 1,
      num: 16,
      data: {
        // uid: JSON.parse(this.$cookies.get('userInfo')).id
        enterpriseId: this.$cookies.get('userInfo').id
      },
      addMerchantForm: {
        name: '',
        account: '',
        creator: '',
        phone: '',
        address: '',
        image: '',
        password: '',
        passwd: ''
      },
      editMerchantForm: {
        name: '',
        account: '',
        creator: '',
        phone: '',
        image: '',
        address: '',
        password: '',
        passwd: ''
      },
      EditMerchantRules: {
        name: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      addMerchantRules: {
        name: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        account: [
          {
            required: true,
            validator: async (rule, value, callback) => {
              const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
              if (value === '') {
                callback(new Error('请输入账户'))
              } else if (!emailReg.test(value)) {
                callback(new Error('请输入正确的邮箱'))
              } else {
                const res = await ApiGetAccountIsExist(value)
                if (res.errorCode === 1) {
                  callback(new Error(res.msg))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        creator: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        passwd: [
          { required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请确认密码'))
              } else {
                if (value !== this.addMerchantForm.password) {
                  callback(new Error('两次密码不一致'))
                } else {
                  callback()
                }
              }
            },
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: async (rule, value, callback) => {
              const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
              if (value === '') {
                callback(new Error('请输入电话'))
              } else if (!phoneReg.test(value)) {
                callback(new Error('请输入正确的电话号码'))
              } else {
                const res = await ApiGetPhoneIsExist(value)
                if (res.errorCode === 1) {
                  callback(new Error(res.msg))
                }
              }
            },
            trigger: 'blur'
          }
        ]
      },
      merchantColumns: [
        {
          title: '编号',
          type: 'index',
          align: 'center',
          width: 80,
          key: 'id'
        },
        {
          title: '公司/商户名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '邮箱',
          align: 'center',
          key: 'account'
        },
        {
          title: '联系人',
          align: 'center',
          key: 'creator'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'phone'
        },
        {
          title: '地址',
          align: 'center',
          key: 'address'
        },
        {
          title: '创建日期',
          align: 'center',
          render: (h, params) => {
            return h('span', this.utils.timeFormat((params.row.createTime)))
          }
        },
        {
          title: '审核状态',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === 1 ? '待审核' : params.row.status === 2 ? '驳回申请' : '已通过'),
              params.row.status === 2 ?
              h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      console.log('立即审核')
                      this.checkModal = true
                      // this.checkSubEnterprise(0, params.row.id)
                      this.checkTargetId = params.row.id
                      this.checkTargetData = params.row
                    }
                  }
                }, '立即审核')
              ]) : ''
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('p', [
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.editChildren(params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.deleteChildren(params.row)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    console.log('设置提点')
                    this.royaltyModal = true
                  }
                }
              }, '设置提点')
            ])
          }
        }
      ],
      userInfo: this.$cookies.get('userInfo'),
      checkTargetId: '',
      checkTargetData: ''
    }
  },
  methods: {
    checkModalOk () {
      let state = this.checkSwitch ? 0 : 2
      alert(state)
      this.checkModal = false
      this.checkSubEnterprise(state, this.checkTargetId)
    },
    // 驳回
    checkModalCancel () {
      this.checkModal = false
    },
    // 审核子商户
    async checkSubEnterprise (state, id) {
      const data = {
        status: state,
        id: id,
        rejectCause: this.rejectCause
      }
      const res = await ApicheckSubEnterprise(data)
      if (res.errorCode === 1) {
        this.$Message.success(res.msg)
      } else {
        this.$Message.error(res.msg)
      }
      this.$refs.merchantTable.updateData()
    },
    // 选择审核状态查询
    changeState (val) {
      console.log(val)
      if (val !== -1) {
        this.data['status'] = val
      } else {
        if (this.data['status']) {
          delete this.data.status
        }
        this.data = {
          enterpriseId: this.$cookies.get('userInfo').id
        }
      }
      this.$refs.merchantTable.updateData()
    },
    // 输入框条件查询子商户
    findChild () {
      if (!this.serchVal) {
        this.$Message.warning('请输入查询条件')
        return false
      }
      let data = {
          enterpriseId: this.$cookies.get('userInfo').id
      }
      // 根据下拉框确定是根据手机号查询还是公司名称查询2为公司名称1为手机号查询
      if (this.serchKey === 2) {
        this.data['name'] = this.serchVal
      } else if (this.serchKey === 3) {
        this.data['phone'] = this.serchVal
      } else {
        this.data = data
      }
      setTimeout(() => {
        this.$refs.merchantTable.updateData()
      }, 200)
    },
    // 设置提点
    async addRoyalty () {
      const data = {
        enterpriseId: this.$cookies.get('userInfo').id,
        royaltyMode: +this.addRoyaltyForm.Royaltyfunction,
        royaltyValue: +this.addRoyaltyForm.RoyaltyVal
      }
      const res = await ApisettingSalesPoint(data)
      console.log(res)
    },
    changeRoyalty (v) {
      console.log(v)
    },
    handleAddMerchant () {
      this.$refs.merchantForm.resetFields()
      this.modalVisibility = true
    },
    handleAddMerchantCancel () {
      this.$refs.merchantForm.resetFields()
    },
    // 上传Logo成功
    hanldeUploadSuccess (file) {
      this.addMerchantForm.image = 'http://' + file.imgPath
      return false
    },
    hanldeUploadSuccess_edit (file) {
      this.editMerchantForm.image = 'http://' + file.imgPath
      return false
    },
    // 上传logo失败
    handleUploadError (file) {
      console.log(file)
    },
    // 修改子商户信息
    editChildren (row) {
      this.$refs.editChildren.resetFields()
      this.modalEdit = true
      this.isEditPsw = false
      for (var i in this.addMerchantForm) {
        this.editMerchantForm[i] = row[i] ? row[i] : ''
      }
      this.editMerchantForm['id'] = row.id
    },
    // 删除子商户
    deleteChildren (row) {
      this.$Modal.confirm({
          content: '<p>确认删除吗？</p>',
          onOk: async () => {
            const res = await ApiGetDeleteChildren(row.id)
            if (res.errorCode > 0) {
              this.$Message.success(res.msg)
              this.$refs['merchantTable'].updateData()
            }
          }
      })
    },
    // 提交修改的子商户信息
    submitEdit () {
      if (this.editMerchantForm.password !== this.editMerchantForm.passwd) {
        this.$Message.warning('两次密码不一致，请重新输入')
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
        return
      }
      this.$refs.editChildren.validate(async (valid) => {
        if (valid) {
          const data = this.editMerchantForm
          delete data.passwd
          data.uid = this.data.enterpriseId
          const res = await ApiGetEditChildren(data)
          if (res.errorCode > 0) {
            this.$Message.success(res.msg)
            this.loading = false
            this.modalVisibility = false
            this.$refs['merchantTable'].updateData()
          } else {
            this.$Message.warning(res.msg)
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 提交子商户信息
    submit () {
      this.$refs.merchantForm.validate(async (valid) => {
        if (valid) {
          const data = this.addMerchantForm
          delete data.passwd
          data.configId = this.data.enterpriseId // 随便传出问题找李德才
          data.projectName = this.data.enterpriseId // 随便传出问题找李德才
          data.parentid = this.data.enterpriseId
          const res = await ApiGetAddChildren(data)
          if (res.errorCode > 0) {
            this.$Message.success(res.msg)
            this.loading = false
            this.modalVisibility = false
            this.$refs['merchantForm'].resetFields()
            this.$refs['merchantTable'].updateData()
          } else {
            this.$Message.warning(res.msg)
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        } else {
          this.loading = false
          // this.$nextTick(() => {
          //   this.loading = true
          // })
        }
      })
    }
  },
  watch: {
    isEditPsw () {
      if (this.isEditPsw === false) {
        this.editMerchantForm.password = ''
        this.editMerchantForm.passwd = ''
      }
    }
  }
}
</script>

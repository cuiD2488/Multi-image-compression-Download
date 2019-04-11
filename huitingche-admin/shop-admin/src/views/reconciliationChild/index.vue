<template>
  <div>
    <div class="head"></div>
    <div class="section">
      <tabledata 
       :columns="tableColumns" 
        pagePosition="center" 
        :queryUrl="tableUrl"
        :queryData="tableData"
        :pageSize="tableNum"
        :current="tablePage"
        :type="type"
        ref="reconciliation">
      </tabledata>
    </div>
    <Modal
      v-model="royaltyModal"
      title="设置平台提点"
      @on-ok="eaditRoyalty"
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
  </div>
</template>
<script>
import tabledata from '@/components/tabledata'
import {URLgetSalesPoint, ApidelSalesPoint, ApiUpdateSalesPoint } from '@/api'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableUrl: URLgetSalesPoint,
      tableData: {
        enterpriseId: -5
      },
      type: 'json',
      tableNum: 10,
      tablePage: 1,
      eaditObj: null,
      tableColumns: [
        {
          title: '所属商户',
          key: 'name',
          align: 'center'
        },
        {
          title: '商品名称',
          key: 'goodsName',
          align: 'center',
          render: (h, param) => {
            return h('div', param.row.goodsName ? param.row.goodsName : '统一提点')
          }
        },
        {
          title: '提点方式',
          align: 'center',
          render: (h, param) => {
            return h('div', [
              h('div', param.row.royaltyMode === 2 ? '百分比提点' : '固定差价提点')
            ])
          }
        },
        {
          title: '提点值',
          align: 'center',
          render: (h, param) => {
            return h('div', [
              h('div', param.row.royaltyValue + (param.row.royaltyMode === 2 ? '%' : ''))
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, param) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.royaltyModal = true
                    this.eaditObj = param.row
                    // this.eaditRoyalty(param.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.removeRoyalty(param.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      addRoyaltyForm: {
        Royaltyfunction: '2',
        RoyaltyVal: 1
      },
      royaltyModal: false,
      RoyaltyVal: '',
    }
  },
  methods: {
    //删除提点
    async removeRoyalty (id) {
      const data = {
        id
      }
      const res = await ApidelSalesPoint(data)
      console.log(res)
      if (res.errorCode > 0) {
        this.$Message.success('删除成功')
        this.$refs.reconciliation.updateData()
      }
    },
    // 编辑提点
    async eaditRoyalty () {
      console.log(this.eaditObj)
      const data = {
        id: this.eaditObj.id,
        royaltyMode: this.eaditObj.royaltyMode,
        royaltyValue: this.eaditObj.royaltyValue
      }
      const res = await ApiUpdateSalesPoint(data)
      if (res.errorCode > 0) {
        this.$Message.success('编辑成功')
        this.$refs.reconciliation.updateData()
        this.eaditObj = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .section{
    padding:10px;
  }
</style>



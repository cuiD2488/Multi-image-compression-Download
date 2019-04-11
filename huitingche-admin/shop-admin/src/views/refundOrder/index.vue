<template>
  <div class="refundContent">
    <div class="refundHead">
      <Select v-model="statusVal" style="width:150px" @on-change="changeState">
        <Option v-for="item in statusData" :value="item.value" :key="item.value" v-text="item.label"></Option>
      </Select>
      <Input v-model="serchVal" style="width:450px;" placeholder="请输入手机号或订单号">
        <Select v-model="serchKey" slot="prepend" style="width:100px;" placeholder>
          <Option v-for="item in serchSelects" :key="item.value" :value="item.value" v-text="item.label"></Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="findChild"></Button>
      </Input>
      <!-- <Button type="primary" size="large" @click="findChild">导出订单</Button> -->
    </div>
    <tabledata
      ref="table"
      page-position="center" 
      border 
      :columns="tableColumns"
      :queryUrl="queryUrl"
      :queryData="queryData"
      :type="type"
      :current="page"
      @on-select="chooseCeckbox"
      @on-select-all="chooseCeckbox"
    :pageSize="num"
    ></tabledata>
    <!-- 预览主图图片 -->
    <Modal
      title="预览主图"
      v-model="showPreview">
      <Carousel
        v-if="showPreview"
        :autoplay-speed="5000"
        autoplay>
        <CarouselItem v-for="img in previewList" :key="img">
          <div class="carouselDiv">
            <img :src="`${utils.handleImgPrefix(img)}`" alt="">
          </div>
        </CarouselItem>
      </Carousel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
// import tabledata from '@/components/tabledata'
import tabledata from '@/components/tabledata'
import {URLgetRefundOrder, ApiGetRefundOrder, ApiUpdateRefundRecord} from '@/api'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      // 表结构
      tableColumns: [
        {
          title: '微信昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '商品图片',
          key: 'imgURL',
          align: 'center',
          render: (h, params)=> {
            return h('goodPreview', {
              props: {
                imgURLStr: params.row.imgURL
              },
              on: {
                'on-click': (list) => {
                  // console.log(list)
                  this.previewList = list
                  this.showPreview = true
                  this.$nextTick()
                }
              }
              // 'on-click': (list) => {
              //   console.log(list)
              // // this.previewList = list
              // // this.showPreview = true
              // // this.$nextTick()
              // }
            })
          }
        },
        {
          title: '商品名称',
          key: 'goodsName',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'userId',
          align: 'center'
        },
        {
          title: '退款编号',
          key: 'outRefundNo',
          align: 'center'
        },
        {
          title: '退款金额',
          key: 'orderMoney',
          align: 'center'
        },
        {
          title: '退款时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.refundState === 0 && params.row.orderStatus !== 6 ? '待处理' : params.row.refundState === 1 && params.row.orderStatus !== 6 ? '退款失败' : params.row.refundState === 2 && params.row.orderStatus !== 6 ? '退款成功' : '同意申请退款')
          }
        },
         {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [ // 操作按钮集合
              params.row.refundState === 0 && params.row.orderStatus === 1 ?
              // 同意退款按钮
              h('Button', {
                style: {
                  margin: '0 0 5px 0'
                },
                on: {
                  click: async () => {
                    let data = {
                      refundState: 2,
                      outRefundNo: params.row.outRefundNo
                    }
                    const res = await ApiUpdateRefundRecord(data)
                    if (res.errorCode === 1) {
                      this.$Message.info(res.msg)
                      this.refresh()
                    }
                  }
                }
              }, '同意退款申请') : '',
              params.row.refundState === 0 && params.row.orderStatus === 1 ?
              // 拒绝退款按钮
              h('Button', {
                style: {
                  margin: '0 0 5px 0'
                },
                on: {
                  click: async () => {
                    let data = {
                      refundState: 1,
                      outRefundNo: params.row.outRefundNo
                    }
                    const res = await ApiUpdateRefundRecord(data)
                    if (res.errorCode === 1) {
                      this.$Message.info(res.msg)
                      this.refresh()
                    }
                  }
                }
              }, '拒绝退款申请') : '',
              params.row.refundState === 0 && params.row.orderStatus > 1 && params.row.orderStatus < 4 ?
              // 用户填写物流
              h('Button', {
                style: {
                  'margin': '0 0 5px 0'
                },
                on: {
                  click: async () => {
                    let data = {
                      refundState: 3,
                      outRefundNo: params.row.outRefundNo
                    }
                    const res = await ApiUpdateRefundRecord(data)
                    if (res.errorCode === 1) {
                      this.$Message.info(res.msg)
                      this.refresh()
                    }
                  }
                }
              }, '填写物流') : '',
              // 查看详情
              h('Button', {
                on: {
                  click: () => {
                    sessionStorage.setItem('refundOrder', JSON.stringify(params.row))
                    this.$router.push({name: 'refundOrderInfo', params: {refundOrder: params.row}})
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ],
      queryUrl: URLgetRefundOrder,
      queryData: {
        enterpriseId: this.$cookies.get('userInfo').id
      },
      type: 'json',
      page: 1,
      num: 10,
      // 条件查询
      serchSelects: [
        {
          label: '用户手机号',
          value: 0
        },
        {
          label: '订单号',
          value: 1
        }
      ],
      serchKey: 0,
      serchVal: '',
      statusData: [
        {
          label: '待处理',
          value: 0
        },
        {
          label: '退款关闭',
          value: 1
        },
        {
          label: '退款成功',
          value: 2
        },
        {
          label: '处理中',
          value: 3
        }
      ],
      statusVal: 0,
      // 预览主图弹框控制
      showPreview: false
    }
  },
  methods: {
    // 状态查询
    async changeState (v) {
      this.queryData['refundState'] = v
      setTimeout(() => {
        this.$refs.table.updateData()
      }, 200)
      // const res = await ApiGetRefundOrder(data)
    },
    chooseCeckbox () {
    },
    // 输入框搜索
    async findChild () {
      if (this.serchKey === 0) {
        this.queryData['userId'] = this.serchVal
      } else {
        this.queryData['orderNo'] = this.serchVal
      }
      setTimeout(() => {
        this.$refs.table.updateData()
      }, 200)
      // const res = await ApiGetRefundOrder(data)
    },
    // 刷新列表
    refresh () {
      this.$refs.table.updateData()
    },
  }
}
</script>
<style lang="less" scoped>
.refundContent{
  padding: 20px;
  .refundHead{
    display:flex;
    justify-content: space-between;
  }
}
</style>


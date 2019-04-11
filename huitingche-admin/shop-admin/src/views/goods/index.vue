<style lang="less" scoped>
@import './index.less';
.carouselDiv {
  overflow: hidden;
  text-align: center;
  img {
    margin: 0 auto;
    width: 100%;
  }
}
</style>

<template>
  <div class="goods">
    <div class="goods-operation">
      <Button @click="handleAddNewGood" type="primary">新增商品</Button>
      <Button @click="uploadGoods(3)" type="ghost">批量上架</Button>
      <Button @click="uploadGoods(4)" type="ghost">批量下架</Button>
      <Button @click="uploadGoods(0)" type="ghost">批量删除</Button>
      <Button style="margin-left: 20px" v-if="userInfo && userInfo.parentid > 0" @click="handleUpdateGood" type="primary">更新总公司商品</Button>
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
    <Modal
      v-model="cuponAlert"
      title="选择优惠券"
      @on-ok="cuponAlertOk"
      @on-cancel="cuponAlert = !cuponAlert">
      <div>
        <span>选择优惠券</span>
        <Select v-model="cupoonList" @on-change="cuponChoose" style="width:300px;margin-left:5px;" filterable multiple>
           <Option v-for="item in cityList" :value="item.coupon_id" :key="item.coupon_id">{{ item.coupon_name }}</Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import { ApiUpdateStatus, ApiDeleteGoods, FINDGOODS, ApiUpdateGoods, ApiCopyGoods, ApiSetHotSale, ApiCancelHotSale, ApiFindCouponList, ApiSetGoodsShopCoupon} from '@/api'

export default {
  components: {
    tabledata
  },
  data () {
    return {
      cityList: [
      ],
      cupoonList: [],
      showPreview: false,
      cuponAlert: false,
      previewList: [],
      previewIndex: 0,
      deleteKeyList: ['brandName', 'categoryName', 'enterpriseName', 'refuseContents', 'salesVolume', 'goodsAttributeList'],
      userInfo: this.$cookies.get('userInfo'),
      queryUrl: FINDGOODS,
      queryData: {
        enterpriseId: this.$cookies.get('userInfo').id
      },
      type: 'json',
      page: 1,
      num: 16,
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          type: 'index',
          align: 'center',
          width: 80,
          key: 'id'
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'goodsName'
        },
        {
          title: '商品主图',
          align: 'center',
          render: (h, params) => {
            return h('goodPreview', {
              props: {
                imgURLStr: params.row.imgURL
              },
              on: {
                'on-click': (list) => {
                  console.log(3333333)
                  this.previewList = list
                  this.showPreview = true
                  this.$nextTick()
                }
              }
            })
          }
        },
        {
          title: '商品价格',
          align: 'center',
          key: 'price'
        },
        {
          title: '商品库存',
          align: 'center',
          key: 'amount',
          render: (h, params) => {
            return params.row.amount === 0 ? <span style={"color:red"} >缺货</span> : <span>{params.row.amount}</span>
          }
        },
        {
          title: +this.$cookies.get('userInfo').id === -5 || +this.$cookies.get('userInfo').parentid === -5 ? '最高可抵扣积分' : '最低折扣价',
          align: 'center',
          render: (h,params) => {
            return <span>{params.row.goodsAttributeList ? params.row.goodsAttributeList[0].integralDeduction : '暂无'}</span>
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'state',
          render: (h, params) => {
            const stateName = params.row.state === 0 ? '待审核'
                            : params.row.state === 1 ? '已审核'
                            : params.row.state === 2 ? '审核未通过:' + params.row.refuseContents
                            : params.row.state === 3 ? '上架'
                            : params.row.state === 4 ? '下架' 
                            : params.row.mainGoodsType === 1 ? '热销商品':''
            const stateColor = params.row.state === 0 ? '#2d8cf0'
                            : params.row.state === 1 ? 'green'
                            : params.row.mainGoodsType === 1 ? 'red'
                            : params.row.state === 2 ? 'red'
                            : params.row.state === 3 ? 'green'
                            : params.row.state === 4 ? 'red' 
                            : params.row.state === 5 ? 'green' : ''
              if(params.row.mainGoodsType === 1){
                    return (
                       <span style={"color:red"} >热销商品</span>
                  )
              }else{
                  return (
                       <span style={`color: ${stateColor}`}>{ stateName }</span>
                  )
              }
            
          }
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return (
              <div>
                <i-button type="text" onClick={
                  () => {
                    if (params.row.state === 0 || params.row.state === 2 || params.row.state === 3) {
                      this.$Message.info('该商品已上架或未通过审核')
                      return
                    }
                    this.$Modal.confirm({
                      title: '上架商品',
                      content: '确定要上架该商品吗？',
                      onOk: async () => {
                        const data = {...params.row, state: 3}
                        for (let i of this.deleteKeyList) {
                          delete data[i]
                        }
                        delete data._index
                        delete data._rowKey
                        delete data.createTime
                        delete data.inventoryGoodsModel
                        const res = await ApiUpdateGoods(data, 2)
                        if (res.errorCode === 1) {
                          this.$Message.success('上架成功')
                        } else {
                          this.$Message.info(res.msg)
                        }
                        this.refresh()
                      }
                    })
                  }
                }>上架</i-button>
                <i-button type="text" onClick={
                  () => {
                    if (params.row.state !== 3) {
                      this.$Message.info('该商品并未处于上架状态')
                      return
                    }
                    this.$Modal.confirm({
                      title: '下架商品',
                      content: '确定要下架该商品吗？',
                      onOk: async () => {
                        params.row.mainGoodsType = 0
                        const data = {...params.row, state: 4}
                        for (let i of this.deleteKeyList) {
                          delete data[i]
                        }
                        delete data._index
                        delete data._rowKey
                        delete data.createTime
                        delete data.inventoryGoodsModel
                        const res = await ApiUpdateGoods(data,1)
                        if (res.errorCode === 1) {
                          this.$Message.success('下架成功')
                        } else {
                          this.$Message.info(res.msg)
                        }
                        this.refresh()
                      }
                    })
                  }
                }>下架</i-button>
                <i-button type="text" onClick={
                  () => {
                    if (params.row.state === 3) {
                      this.$Message.warning('请先下架再进行编辑')
                      return
                    }
                    sessionStorage.setItem('activeGoods', JSON.stringify(params.row))
                    this.$router.push({name: 'new_good', query: {goodsEvents: 'edit'}})
                  }
                }>编辑</i-button>
                <i-button type="text" onClick={
                  () => {
                    if (params.row.state === 3) {
                      this.$Message.warning('请先下架再进行删除操作')
                      return
                    }
                    this.$Modal.confirm({
                      content: '确认删除吗？',
                      onOk: () => {
                        this.deleteProd(params)
                      }
                    })
                  }
                }>删除</i-button>
                <i-button type="text" onClick={
                  () => {
                    console.log(params)
                    if (params.row.state !== 3) {
                      this.$Message.warning('请先上架再进行热销操作')
                      return
                    }
                    this.$Modal.confirm({
                      content: params.row.mainGoodsType === 1 ? '是否取消热销？' : '确认将该商品设置为热销商品吗？',
                      onOk: () => {
                        this.setHotSale(params)
                      }
                    })
                  }
                }>{params.row.mainGoodsType === 1 ? '取消热销' : '设为热销'}</i-button>
                <i-button type="text" onClick={
                  () => {
                    this.cuponSetUp(params)
                  }
                }>{this.$cookies.get('userInfo').id === -1 ? '选择优惠券' : ''}</i-button>
              </div>
            )
          }
        }
      ],
      targetCouponObj: {},
      coupon_ids: [],
      checkSelectionIdList: null
    }
  },
  methods: {
    // 批量上架商品
    async uploadGoods (state) {
      let mesgText
      if (state === 3) {
        mesgText = '上架'
      } else if (state === 4) {
        mesgText = '下架'
      } else {
        mesgText = '删除'
      }
      if (!this.checkSelectionIdList) {
        this.$Message.error('请选择商品')
        return false
      }
      let idList = []
      for (let i in this.checkSelectionIdList) {
        if (+this.checkSelectionIdList[i].state === 3) {
          this.$Message.error('所选商品含有已上架商品，请先下架再删除！')
          return false
        }
        if (state === +this.checkSelectionIdList[i].state) {
          this.$Message.error('所选商品含有已' + mesgText + '商品，请检查确认后再' + mesgText)
          return false
        }
        idList.push(this.checkSelectionIdList[i].id)
      }
      idList = idList.join(',')
      console.log(idList)
      const data = {
        id: idList,
        state
      }
      const res = await ApiUpdateStatus(data)
      if (res.errorCode === 1) {
        this.$Message.success('批量' + mesgText + '成功')
        this.$refs.table.updateData()
      } else {
        this.$Message.success('批量' + mesgText + '失败')
      }
      this.checkSelectionIdList = []
    },
    // 勾选框时
    chooseCeckbox (selection, row) {
      this.checkSelectionIdList = selection
    },
    // 下架商品
    downloadGoods () {
      console.log('下架')
    },
    // 删除产品
    async deleteProd (params) {
      const para = {
        goodsId: params.row.id,
        enterpriseId: params.row.enterpriseId
      }
      const res = await ApiDeleteGoods({}, para)
      if (res.errorCode > 0) {
        this.$Message.success('删除成功')
        this.$refs.table.updateData()
      } else {
        this.$Message.warning(res.msg)
      }
    },
    // 设置优惠券
    async cuponAlertOk (item) {
      this.cuponAlert = false
      const data = {
        enterpriseId: this.$cookies.get('userInfo').id,
        coupon_ids: this.coupon_ids,
        goodsId: this.targetCouponObj.id
      }
      const res = await ApiSetGoodsShopCoupon(data)
      if (res.errorCode === 1) {
        this.coupon_ids = []
      } else {
        this.$Message.error('设置失败')
      }
    },
    // 选择优惠券
    cuponChoose (value) {
      this.coupon_ids = value.toString()
    },
    // 开启选择优惠券弹框
    cuponSetUp(params) {
      this.coupon_ids = []
      this.targetCouponObj = params.row
      this.cuponAlert = true
      this.getCouponList()
    },
    // 查询优惠券列表
    async getCouponList () {
      const data = {
        enterpriseId: this.$cookies.get('userInfo').id,
        coupon_status: 1,
        num: 1000000,
        page:1
      }
      console.log(data)
      const res = await ApiFindCouponList(data)
      console.log(res)
      if (res.errorCode > 0) {
        this.cityList = res.data
      }
    },
    // 热销商品
    async setHotSale(params){
      let res 
      if(params.row.mainGoodsType === 0){
        res = await ApiSetHotSale({id: params.row.id}, 1);
      }else{
       res = await ApiCancelHotSale({id: params.row.id}, 0);
      }
      if(res.errorCode > 0) {
        this.$Message.success('设置成功')
        this.$refs.table.updateData();
      }else{
        this.$Message.warning(res.msg)
      }
    },
    // 更新商品
    async handleUpdateGood () {
      this.$Message.loading({
        content: '更新中',
        duration: 0
      })
      const res = await ApiCopyGoods({ enterpriseId: this.userInfo.id })
      this.$Message.destroy()
      if (res.errorCode > 0) {
        this.$Message.success('更新成功')
        this.refresh()
      } else {
        this.$Message.error(res.msg)
      }
    },
    // 刷新列表
    refresh () {
      this.$refs.table.updateData()
    },
    handleAddNewGood () {
      this.$router.push({name: 'new_good', query: {goodsEvents: 'add'}})
    }
  }
}
</script>

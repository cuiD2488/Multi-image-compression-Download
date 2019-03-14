<template>
  <div class="parkingrecord">
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
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import {QUERYPkORDER} from '@/api'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '停车场编号',
          key: 'parkingLotNumber'
        },
        {
          title: '车位编号',
          key: 'positionNumber'
        },
        {
          title: '订单编号',
          key: 'orderNumber'
        },
        {
          title: '进车时间',
          key: 'enterTime'
        },
        {
          title: '出车时间',
          key: 'outTime'
        },
        {
          title: '订单总金额',
          key: 'orderMoney'
        },
        {
          title: '预付费金额',
          key: 'actualPayMoney'
        },
        {
          title: '购买时长',
          key: 'buyDuration'
        },
        {
          title: '状态',
          key: 'orderStatus'
        },
        {
          title: '预付费开始时间',
          key: 'buyStartTime'
        },
        {
          title: '创建时间',
          key: 'orderCreateTime'
        }
      ],
      queryUrl: QUERYPkORDER,
      queryData: {
        vendorId: 3,
        // vendorId: this.$store.getters.userInfo.vendorId,
        parkingLotNumber: '000001'
      },
      page: 1,
      num: 10,
      type: 'json'
    }
  }
}
</script>
<style lang="less" scoped>
.parkingrecord{
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
</style>

<template>
  <div class="parkingrecord">
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
          title: '用户编号',
          key: 'vendorId'
        },
        {
          title: '手机号',
          key: 'Id'
        },
        {
          title: '停车场名称',
          key: 'parkingLotNumber'
        },
        {
          title: '车位编号',
          key: 'positionNumber'
        },
        {
          title: '进车时间',
          key: 'enterTime'
        },
        {
          title: '订单编号',
          key: 'orderNumber'
        },
        {
          title: '状态',
          key: 'orderStatus'
        },
        {
          title: '付费金额',
          key: 'actualPayMoney'
        },
        {
          title: '创建时间',
          key: 'orderCreateTime'
        }
      ],
      queryUrl: QUERYPkORDER,
      queryData: {
        vendorId: 3
        // parkingLotNumber: '000001'
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

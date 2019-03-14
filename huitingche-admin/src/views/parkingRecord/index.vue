<template>
  <div class="parkingRecord">
    <!-- <i-table border :columns="columns1" :data="data1"></i-table> -->
    <tabledata
    ref="table"
    page-position="center"
    :columns="tableColumns"
    :queryUrl="queryUrl"
    :queryData="queryData"
    :current="page"
    :pageSize="num"
    ></tabledata>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
import QUERYPkORDER from '@/api'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      tableColumns: [
        {
          title: '用户编号',
          key: 'id',
        },
        {
          title: '手机号'
        },
        {
          title: '停车场名称'
        },
        {
          title: '车位编号'
        },
        {
          title: '进车时间'
        },
        {
          title: '出车时间'
        },
        {
          title: '订单编号'
        },
        {
          title: '状态'
        },
        {
          title: '付费金额'
        },
        {
          title: '创建时间'
        }
      ],
      queryUrl: QUERYPkORDER,
      // queryData:
      page: 1,
      num: 10
    }
  }
}
</script>
<style lang="less" scoped>
.parkingRecord{
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

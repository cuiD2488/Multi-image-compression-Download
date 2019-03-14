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
          title: '停车场名称',
          key: 'id'
        },
        {
          title: '地址'
        },
        {
          title: '管理人'
        },
        {
          title: '车位编号'
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
.pakingmgt{
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

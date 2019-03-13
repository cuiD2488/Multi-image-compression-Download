<template>
    <div class="roadside">
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
          title: '序号',
          key: 'id',
          align: 'center'
        },
        {
          title: '车牌号'
        },
        {
          title: '停车场'
        },
        {
          title: '停车车位'
        }
      ],
      queryUrl: QUERYPkORDER,
      page: 1,
      num: 10
    }
  }
}
</script>
<style lang="less" scoped>
.roadside{
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

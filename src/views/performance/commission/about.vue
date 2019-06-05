<template>
  <div class="content-view p-20">
    <el-row class="h-title">
      <span style="font-size: 18px">职位提点测算表</span>
      <el-button name="btnBack" @click="toBack" size="small" style="float: right">返回</el-button>
    </el-row>
    <el-row>
      <el-col>
        零成本珠宝行业销售岗位提点测算表说明
        <el-button name="btnDownload" type="primary" @click="download">马上下载</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col><br/></el-col>
    </el-row>
    <el-row>
      <el-col>
        职位提点测算表主要用于测算销售人员提成比例和管理人员提成倍率，如下图：
      </el-col>
    </el-row>
    <el-row>
      <el-col><br/></el-col>
    </el-row>
    <el-row>
      <el-col>
        <img src="/static/images/ticheng.jpg" alt="职位提点测算表">
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  methods: {
    data () {
      return {
        positionName: ''
      }
    },
    toBack () {
      this.positionName = this.$route.params.position
      this.$router.go(-1)
    },
    download() {
      window.open('/static/attachment/零成本珠宝行业销售岗位提点测算表.xlsx')
    }
  }
}
</script>
<style scoped>
.table th,
td {
  border: 1px solid;
  height: 40px;
  text-align: center;
}
.h-title{
  border-bottom: 1px solid #eee;
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
}

/* .table td{
  border:1px solid;
  height:50px;
} */
</style>

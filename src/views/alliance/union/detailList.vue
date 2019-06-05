<template>
  <div class="content">
    <div class="el-table tables el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition f12">
      <div class="el-table__body-wrapper" style="overflow-x: auto;">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
          <tbody>
            <tr>
              <td class="label tit">
                <div class="cell tit m-l-5">卡券ID</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
              <td class="label tit">
                <div class="cell tit m-l-5">联盟商编码</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
            </tr>
            <tr>
              <td class="label tit">
                <div class="cell tit m-l-5">卡券名称</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
              <td class="label tit">
                <div class="cell tit m-l-5">联盟商</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template class="detail">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="结算单号" min-width="120"></el-table-column>
        <el-table-column prop="name" label="推广数" min-width="120"></el-table-column>
        <el-table-column prop="address" label="结算设置" min-width="120"></el-table-column>
        <el-table-column prop="address" label="推广结算" min-width="120"></el-table-column>
        <el-table-column prop="address" label="推广奖励金额" min-width="120"></el-table-column>
        <el-table-column prop="address" label="结算状态" min-width="120"></el-table-column>
        <el-table-column prop="address" label="实际结算金额" min-width="120"></el-table-column>
        <el-table-column prop="address" label="结算时间" min-width="120"></el-table-column>
      </el-table>
    </template>
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="结算单号" min-width="120"></el-table-column>
        <el-table-column prop="date" label="已使用数" min-width="120"></el-table-column>
        <el-table-column prop="date" label="已退货数" min-width="120"></el-table-column>
        <el-table-column prop="date" label="订单应付金额" min-width="120"></el-table-column>
        <el-table-column prop="date" label="订单实付金额" min-width="120"></el-table-column>
        <el-table-column prop="date" label="奖励设置" min-width="120"></el-table-column>
        <el-table-column prop="date" label="转化结算" min-width="120"></el-table-column>
        <el-table-column prop="date" label="转化结算金额" min-width="120"></el-table-column>
        <el-table-column prop="date" label="结算状态" min-width="120"></el-table-column>
        <el-table-column prop="date" label="实际结算金额" min-width="120"></el-table-column>
        <el-table-column prop="address" label="结算时间" min-width="120">
          <template slot-scope="scope">{{scope.row.address | filterDateMinutes}}</template>
        </el-table-column>
      </el-table>
    </template>
    <el-button type="primary" round>关闭</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tableData:[]
    }
  }

}
</script>

<style lang="scss" scope>
.content{
  .detail{
    margin-top: 30px;
    margin-bottom: 30px;
  }

}
</style>

<template>
  <div class="content">
    <div class="el-table tables el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition f12">
      <div class="el-table__body-wrapper" style="overflow-x: auto;">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
          <tbody>
            <tr>
              <td class="label tit">
                <div class="cell tit m-l-5">珠宝商编码</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
              <td class="label tit">
                <div class="cell tit m-l-5">珠宝商名称</div>
              </td>
              <td class="value">
                <div class="cell"></div>
              </td>
            </tr>
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
    <div class="bon-title">推广奖励</div>
    <el-table :data="tableData" class="extension">
      <el-table-column show-overflow-tooltip min-width="100" fixed prop="NeiborCode" label="结算单号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" fixed prop="SharedQty" label="推广数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TicketCode" label="结算设置"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="SharedPaidPrice" label="推广结算"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="SharedQty" label="推广奖励金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="UnusedQty" label="结算状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="LockedQty" label="实际结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" label="结算时间"></el-table-column>
      
    </el-table>
    <div class="bon-title">转化奖励</div>
    <el-table :data="tableData">
      <el-table-column show-overflow-tooltip min-width="100" fixed prop="NeiborCode" label="结算单号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" fixed prop="NeiborName" label="已使用数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TicketCode" label="已退货数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TicketName" label="订单应付金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="SharedQty" label="订单实付金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="UnusedQty" label="奖励设置"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="LockedQty" label="转换结算"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" label="转换结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" label="结算状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" label="实际结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" label="结算时间">
        <template slot-scope="scope">{{scope.row.TransfQty | filterDateMinutes}}</template>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style lang="scss" scope>
.content{
  .extension{
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
</style>

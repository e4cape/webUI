<template>
  <el-dialog title="联盟券结算单" width="1000px" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog" @close="resetForm">
    <div class="times">
      <span>创建时间：{{detail.CreateTime | filterDateTime}}</span>
      <span>审核时间：{{detail.CreateTime | filterDateTime}}</span>
      <span>结算时间：{{detail.CreateTime | filterDateTime}}</span>
    </div>
    <div class="bon-title">结算卡券</div>
    <el-table :data="tableData1" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="卡券ID" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="卡券名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="推广数" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="结算设置" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="推广结算" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="结算金额" min-width="120"></el-table-column>
    </el-table>
    <div class="bon-title">结算信息</div>
    <el-table :data="tableData2" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="结算单类型" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="结算单号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="联盟商编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="联盟商" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="应结算金额" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="结算状态" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketType" label="审核备注" min-width="120"></el-table-column>
    </el-table>
    <div class="bon-title">结算账户</div>
    <el-table :data="tableData3" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="支付方式" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="收款人昵称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="银行账号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="账户" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="开户行" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="实际结算金额" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketType" label="支付单号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ActiveDays" label="支付时间" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ActiveDays" label="支付备注" min-width="120"></el-table-column>
    </el-table>
    <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ALLIANCE_API_SETTLETICKETBILLBASIC_GET } from '@/apis/alliance'
export default {
  props: {
    id: {
      type: String
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detail: {},
      tableData1: [],
      tableData2: [],
      tableData3: [],
    }
  },
  methods: {
    getDetail() {
      ALLIANCE_API_SETTLETICKETBILLBASIC_GET({
        BillId: this.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    }
  },
  mounted() {
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDetail()
      }
    }
  },
}
</script>
<style lang="scss" scoped>
</style>

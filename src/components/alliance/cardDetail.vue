<template>
  <el-dialog title="卡卷详情" width="650px" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog">
    <div class="stone-bd">
      <div class="el-table tables el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
        <div class="el-table__body-wrapper" style="overflow-x: auto;">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
            <tbody>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">卡卷ID</div>
                </td>
                <td class="value">
                  <div class="cell">656522222222222222222222222222222222222222222222222222</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">卡卷名称</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">投放日期</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">投放数量</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">卡券类型</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">赠送数量</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">卡券面额</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">适用及抵扣</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">有效期</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">到期提醒</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">使用限制</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">使用说明</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">适用门店</div>
                </td>
                <td class="value">
                  <el-table :data="adressData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="门店编码" min-width="120" fixed></el-table-column>
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="门店名称" min-width="120" fixed></el-table-column>
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="地区" min-width="220" fixed></el-table-column>
                  </el-table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ALLIANCE_API_TICKETBASIC_GET } from '@/apis/alliance'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ticketId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      activeIndex: 0,
      nick: '',
      adressData: []
    }
  },
  methods: {
    getDetail() {
      ALLIANCE_API_TICKETBASIC_GET({
        ticketId: this.ticketId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
        }
      })
    }
  },
  mounted() {
    // this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.label {
  width: 100px;
}
</style>


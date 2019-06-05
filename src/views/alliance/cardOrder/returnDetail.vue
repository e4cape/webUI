<template>
  <el-dialog title="退款详情" width="650px" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog">
    <div class="stone-bd">
      <div class="el-table tables el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition f12">
        <div class="el-table__body-wrapper" style="overflow-x: auto;">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
            <tbody>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">退款原因</div>
                </td>
                <td class="value">
                  <div class="cell">656522222222222222222222222222222222222222222222222222</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">应退金额</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">实退金额</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">退款方式</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">支付单号</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">支付时间</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td class="label">
                  <div class="cell">支付备注</div>
                </td>
                <td class="value">
                  <div class="cell">6565</div>
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
  width: 120px;
  background-color: #f5f5f5;
}
.f12 {
  font-size: 12px;
}
</style>


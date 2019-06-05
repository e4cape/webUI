<template>
  <div
    class="content-view"
    v-loading="loading"
  >
    <ul>
      <li><span>授权设备序号：</span><span>{{detail.EquipmentId}}</span></li>
      <li><span>授权角色序号：</span><span>{{detail.CharacterId}}</span></li>
      <li><span>门店名称：</span><span>{{detail.StoreTitle}}</span></li>
      <li><span>主板序列：</span><span>{{detail.BIOS}}</span></li>
      <li><span>CPU序列：</span><span>{{detail.Processor}}</span></li>
      <li><span>网卡地址：</span><span>{{detail.Network}}</span></li>
      <li><span>硬盘序列：</span><span>{{detail.Diskdrive}}</span></li>
      <li><span>状态：</span><span>{{cashierStatus.Types[detail.Status]}}</span></li>
      <li><span>最后操作时间：</span><span>{{detail.LastTime | filterDate}}</span></li>
      <li><span>最后操作人：</span><span>{{detail.LastUser}}</span></li>
    </ul>
  </div>
</template>

<script>
import {
  MARKETING_API_CASHIER_EQUIPMENT_GET // 设备服务 详情
} from '@/apis/marketing.js'
import { CashierEquipmentStatus } from '@/enums/marketing.js'
export default {
  data() {
    return {
      detail: {},
      cashierStatus: CashierEquipmentStatus,
      loading: false
    }
  },
  methods: {
    getDetail() {
      this.loading = true
      MARKETING_API_CASHIER_EQUIPMENT_GET({
        EquipmentId: this.$route.query.id
      }).then(res => {
        this.detail = res.data.Data
        this.loading = false
      })
    }
  },
  mounted() {
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
.content-view {
  ul {
    li {
      height: 40px;
      line-height: 40px;
      display: flex;
      span {
        &:first-of-type {
          margin-right: 15px;
          width: 120px;
          text-align: right;
        }
      }
    }
  }
}
</style>

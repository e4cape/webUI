<template>
  <el-dialog
    :title="title + '手工赠送优惠券'"
    :visible.sync="visible"
    width="800px"
  >
    <el-table
      :data="data"
      ref="tagsTable"
      class="visitTaskTagsTable"
      highlight-current-row
      v-loading="tableLoading"
      @select="handleSelectionChange"
      element-loading-text="拼命加载中"
      @row-click="selectCoupon"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed="left"
      ></el-table-column>
      <el-table-column
        prop="CouponId"
        label="优惠券ID"
        min-width="80"
        show-overflow-tooltip
        fixed="left"
      ></el-table-column>
      <el-table-column
        prop="CouponName"
        label="优惠券名称"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="CouponType"
        :formatter="formatter"
        label="优惠券类型"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="GivePriceType"
        label="优惠券面额"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">
          <el-button
            name="btnOnCheck"
            type="text"
            v-if="scoped.row.CouponType==couponSettingType.Voucher&&scoped.row.IsHistory == YNStatus.No"
            @click="onCheck(scoped.row.CouponId)"
          >查看</el-button>
          <span v-else-if="scoped.row.CouponType==couponSettingType.Sale">{{scoped.row.Price.toFixed(2)}}</span>
          <span v-else>{{givePriceType.Types[scoped.row.GivePriceType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="EventType"
        label="赠送规则"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">{{scoped.row.CouponType == couponSettingType.Voucher ? '购买指定材质达指定金额自动赠送' : eventType.Types[scoped.row.EventType]}}</template>
      </el-table-column>
      <el-table-column
        prop="ExpireType"
        label="有效期"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.ExpireType == ExpireType.Designated ? $options.filters.filterDate(scope.row.Expireb)+'至'+ (scope.row.ExpireStop.substring(0,4)=='2100' ? '长期' : $options.filters.filterDate(scope.row.ExpireStop)): scope.row.ExpireDays+ '天' }}
        </template>
      </el-table-column>
      <el-table-column
        label="投放时间"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{$options.filters.filterDate(scope.row.Expireb)+'至'+ (scope.row.Expiree.substring(0,4)=='2100'? '长期': $options.filters.filterDate(scope.row.Expiree))}}
        </template>
      </el-table-column>
      <el-table-column
        prop="GiveAmt"
        label="投放数量"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.GiveAmt == 0?'不限':$route.path=='/market/coupon/salecardslist'?scope.row.GiveAmt-scope.row.PickedAmt:scope.row.GiveAmt}}</template>
      </el-table-column>
    </el-table>
    <pagination
      :pg="pg"
      :size="size"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnCreateCoupon"
        type="primary"
        @click="createCoupon"
        :loading="$store.getters.is_loading"
      >下一步</el-button>
      <el-button
        name="btnCancel"
        @click="visible = false"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import pagination from '@/components/pagination'
import { SCORING_API_COUPON_BASIC_GETS } from '@/apis/scoring'
import { YNStatus } from '@/enums/common'
import {
  EventType,
  CouponSettingType,
  GivePriceType,
  CardType,
  CouponSaleType,
  CouponLaunchStatus,
  CouponAuditStatus,
  ExpireType
} from '@/enums/scoring'

export default {
  props: {
    beforeCreateDialog: {
      type: Boolean,
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      ExpireType,
      couponSettingType: CouponSettingType,
      givePriceType: GivePriceType,
      couponLaunchStatus: CouponLaunchStatus,
      couponAuditStatus: CouponAuditStatus,
      cardType: CardType,
      eventType: EventType,
      couponSaleType: CouponSaleType,
      visible: this.beforeCreateDialog,
      tableLoading: false,
      data: [],
      row: {},
      total: 0,
      size: 20,
      pg: 1,
      YNStatus
    }
  },
  methods: {
    createCoupon() {
      if (!this.row.CharacterId) {
        this.$message.error('请选择优惠券')
        return false
      }
      this.$emit('listenCreateDialog', this.row)
    },
    getData() {
      this.tableLoading = true // table loading
      SCORING_API_COUPON_BASIC_GETS({
        CharacterId: '',
        CouponType: '',
        CouponId: '',
        CouponName: '',
        Expireb: '',
        Expiree: '',
        CheckStatus: CouponAuditStatus.Audit,
        EventType: this.eventType.Manual,
        CouponStatus: CouponLaunchStatus.Audit,
        PageIndex: this.pg,
        PageSize: this.size,
        IsAsced: YNStatus.No
      })
        .then(res => {
          this.tableLoading = false // table loading
          if (res.data.Code === 'CORRECT') {
            // 只展示审核通过的卡券
            this.data = res.data.Data.Rows.filter(
              ({ CheckStatus, CouponStatus }) =>
                +CheckStatus === CouponAuditStatus.Audit &&
                +CouponStatus === CouponLaunchStatus.Audit
            )
            this.total = this.data.length
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(() => {
          this.tableLoading = false // table loading
        })
    },
    selectCoupon(row) {
      this.handleSelectionChange(false, row)
    },
    handleSelectionChange(selection, row) {
      if (row) {
        this.$refs.tagsTable.clearSelection()
        this.$refs.tagsTable.toggleRowSelection(row)
        this.row = row
      }
    },
    sizeChange(val) {
      if (val == this.size) {
        return false
      }
      this.size = val
      this.pg = 1
      this.getData()
    },
    currentChange(val) {
      if (this.pg == val) {
        return false
      }
      this.pg = val
      this.getData()
    },
    formatter(row, column, value) {
      // 格式化表格
      let tpr
      switch (column.property) {
        case 'CardType':
          tpr = this.cardType.Types[row['CardType']]
          break
        case 'GiveAmt':
          tpr = row['GiveAmt'] == 0 ? '不限' : row['GiveAmt']
          break
        case 'CouponStatus':
          if (
            row.CheckStatus == this.couponAuditStatus.Abandon ||
            row.CheckStatus == this.couponAuditStatus.Origin
          ) {
            tpr = '-'
          } else {
            if (this.$route.path == '/market/coupon/salecardslist') {
              tpr =
                value == this.couponLaunchStatus.Origin
                  ? '未开始'
                  : value == this.couponLaunchStatus.Audit
                    ? '已开始'
                    : '已结束'
            } else {
              tpr = this.couponLaunchStatus.Types[value]
            }
          }
          break
        case 'CheckStatus':
          tpr = this.couponAuditStatus.Types[value]
          break
        case 'GivePriceType':
          tpr = this.givePriceType.Types[value]
          break

        case 'CouponType':
          tpr =
            this.couponSettingType.Sale != value
              ? this.couponSettingType.Types[value]
              : this.couponSaleType.Types[row.CouponSaleType]
          break
        case 'Price':
          tpr = `￥${this.$root.toFloat(value)}`
          break
        case 'SalePrice':
          tpr = `￥${this.$root.toFloat(value)}`
          break
        default:
          break
      }
      return tpr
    }
  },
  mounted() {
    this.getData()
    // this.row = {}
  },
  watch: {
    visible() {
      this.$emit('listenCreateDialog', false)
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss">
.visitTaskTagsTable {
  .el-table__header {
    .el-checkbox {
      display: none;
    }
  }
}
</style>

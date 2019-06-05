<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col class="franchs" v-loading="franchiseeLoading">
        <div class="title-fmis">加盟商</div>
        <template v-for="(item,index) in franchisees">
          <div class="franch" :class="{'active':queryForm.UnitId == item.UnitId}" :key="index" @click="franchiseeChange(item)">{{item.PartnerName}}</div>
        </template>
        <div class="myPagination-bar" v-if="totalCount">
          <el-select v-model="franchiseeQuery.PageSize" placeholder="20" @change="franSizeChange" name="pageSize">
            <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
          </el-select>
          <div class="pagination-controller">
            <button name="btnPrev" class="prev-btn" @click="prevPage" :disabled="franchiseeQuery.PageIndex === 1" :class="{'isDisabled': franchiseeQuery.PageIndex === 1}">
              <i class="el-icon-arrow-left"></i>
            </button>
            <span class="current-page">{{franchiseeQuery.PageIndex}}/{{pages}}</span>
            <button name="btnNext" class="next-btn" @click="nextPage" :disabled="franchiseeQuery.PageIndex === pages" :class="{'isDisabled': franchiseeQuery.PageIndex === pages}">
              <i class="el-icon-arrow-right"></i>
            </button>
          </div>
          <span class="total">共{{totalCount}}条</span>
        </div>
        <el-button type="primary" name="btnExportALL" v-if="totalCount" class="all-export" @click="exportData(0)">全部导出</el-button>
      </el-col>
      <el-col style="width: calc(100% - 250px);">
        <div class="fix-row">
          <el-button name="btnExportOne" @click="exportData(queryForm.UnitId)" :disabled="!data.length">导出</el-button>
          <div :span="12" class="tr">
            <span class="detail-info-num-item">
              货品数量：
              <b class="num">{{joinTotal.TotalGoodsQty}}</b>
            </span>
            <span class="detail-info-num-item">
              货品金重：
              <b class="num">{{joinTotal.TotalGoldWeight | initWight}}</b>
            </span>
            <span class="detail-info-num-item">
              结算金额：
              <b class="num">￥{{$root.toFloat(joinTotal.TotalCostPrice)}}</b>
            </span>
          </div>
        </div>

        <!-- Data Table -->
        <el-table :data="data" v-loading="$store.getters.tb_loading" class="have-border" element-loading-text="拼命加载中" @sort-change="sortChange">
          <el-table-column prop="OrderType" label="来源" min-width="120" show-overflow-tooltip fixed>
            <template slot-scope="scope">{{SettleMonthlyBillJoiningOrderType.Types[scope.row.OrderType]}}</template>
          </el-table-column>
          <el-table-column prop="PreviousCode" label="来源单号" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="UnitedName1" label="发货单位" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="UnitedName2" label="收货单位" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ActualDate" label="业务日期" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="scope">{{scope.row.ActualDate | filterDateTime}}</template>
          </el-table-column>
          <el-table-column prop="OrderTime" label="创建时间" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="scope">{{scope.row.OrderTime | filterDateTime}}</template>
          </el-table-column>
          <el-table-column prop="GoodsQty" label="货品数量" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column prop="GoldWeight" label="货品金重" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">{{scope.row.GoldWeight | initWight}}</template>
          </el-table-column>
          <el-table-column prop="CostPrice" label="结算金额" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">{{scope.row.CostPrice | initPrice}}</template>
          </el-table-column>
        </el-table>
        <!-- end Table -->

        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common'
import { SettleMonthlyBillJoiningOrderType, SettleMonthlyBillUnitType } from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_MONTHLY_BILL_UNIT_GETS,
  STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETS,
  STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETSTOTAL,
  STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_EXPORT
} from '@/apis/stocking'
import pagination from '@/components/pagination'
export default {
  props: {
    billId: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      SettleMonthlyBillJoiningOrderType,
      franchiseeLoading: false,
      franchiseeQuery: {
        UnitType: SettleMonthlyBillUnitType.Joining,
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      franchisees: [], // 加盟商数据
      paginationSizes: [10, 15, 20], // 加盟商分页数据条数数组
      totalCount: 0, // 加盟商总数据条数
      data: [],
      queryForm: {
        UnitId: '',
        BillId: '',
        StorechterId: '',
        CharacterId: '',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      joinTotal: {
        TotalGoodsQty: 0,
        TotalGoldWeight: 0,
        TotalCostPrice: 0
      }
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.franchiseeQuery.PageSize === 0
          ? Math.ceil(this.totalCount / this.franchiseeQuery.PageSize)
          : parseInt(this.totalCount / this.franchiseeQuery.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    getFranchisees(first) {
      this.franchiseeLoading = true
      STOCKING_API_SETTLE_MONTHLY_BILL_UNIT_GETS(Object.assign(this.franchiseeQuery, { BillId: this.billId }))
        .then(res => {
          this.franchiseeLoading = false
          if (res.data.Code === 'CORRECT') {
            this.franchisees = res.data.Data.Rows
            this.totalCount = res.data.Data.Count
            if (first && this.franchisees.length) {
              this.franchiseeChange(this.franchisees[0])
            }
          }
        })
        .catch(() => {
          this.franchiseeLoading = false
        })
    },
    franSizeChange() {
      this.franchiseeQuery.PageIndex = 1
      this.getFranchisees()
    },
    prevPage() {
      this.franchiseeQuery.PageIndex -= 1
      this.getFranchisees()
    },
    nextPage() {
      this.franchiseeQuery.PageIndex += 1
      this.getFranchisees()
    },
    franchiseeChange(item) {
      this.queryForm = Object.assign(this.queryForm, {
        UnitId: item.UnitId,
        BillId: item.BillId
      })
      this.getTotal()
      this.getData()
    },
    getTotal() {
      STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETSTOTAL(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.joinTotal = res.data.Data
          } else {
            this.joinTotal = {
              TotalGoodsQty: 0,
              TotalGoldWeight: 0,
              TotalCostPrice: 0
            }
          }
        }
      )
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETS(this.queryForm).then(
        res => {
          this.$store.commit('SET_TB_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.Rows || []
            this.total = res.data.Data.Count
          }
        }
      )
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'ActualDate':
          this.queryForm.OrderBy = 0
          break
        case 'OrderTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    },
    exportData(id) {
      this.$store.commit('SET_TB_LOADING', true)
      var param = {
        OrderBy: this.queryForm.OrderBy,
        IsAsced: this.queryForm.IsAsced,
        UnitId: '', BillId: this.billId, ExportColumns: [{
          FieldEnName: 'OrderTypeName',
          FieldCnName: '来源'
        },
        {
          FieldEnName: 'PreviousCode',
          FieldCnName: '来源单号'
        },
        {
          FieldEnName: 'UnitedName1',
          FieldCnName: '发货单位'
        },
        {
          FieldEnName: 'UnitedName2',
          FieldCnName: '收货单位'
        },
        {
          FieldEnName: 'ActualDate',
          FieldCnName: '业务日期'
        },
        {
          FieldEnName: 'OrderTime',
          FieldCnName: '创建时间'
        },
        {
          FieldEnName: 'GoodsQty',
          FieldCnName: '货品数量'
        },
        {
          FieldEnName: 'GoldWeight',
          FieldCnName: '货品金重',
          Precision: 3
        },
        {
          FieldEnName: 'CostPrice',
          FieldCnName: '结算金额',
          Precision: 2
        }
        ]
      }
      param.PageIndex = this.queryForm.PageIndex
      param.PageSize = this.queryForm.PageSize
      if (id) {
        param.UnitId = id
      }
      STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_EXPORT(param).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
      })
    }
  },
  beforeMount() {
    this.getFranchisees(true)
  },
  mounted() { },
  components: {
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
.fix-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-left: 1px solid #e5e5e5;
  .r-num {
    line-height: 30px;
  }
}
.have-border {
  border-left: 1px solid #e5e5e5;
}
.franchs {
  width: 250px;
  .franch {
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 10px;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    text-align: center;
    cursor: pointer;
  }
  .active,
  .franch:hover {
    background-color: #3484c0;
    color: #fff;
    border-bottom: 1px solid #3484c0;
    border-right: 1px solid #3484c0;
  }
  .title-fmis {
    height: 40px;
    line-height: 40px;
    width: 100%;
    padding: 0 10px;
    font-weight: 800;
    text-align: left;
    font-size: 18px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
  }
  .all-export {
    width: 240px;
    margin-top: 10px;
  }
}
</style>

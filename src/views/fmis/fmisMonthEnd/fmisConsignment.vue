<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col class="franchs" v-loading="consignmentLoading">
        <div class="title-fmis">供应商</div>
        <template v-for="(item,index) in consignments">
          <div class="franch" :class="{'active':queryForm.UnitId == item.UnitId}" :key="index" @click="consignmentChange(item)">{{item.PartnerName}}</div>
        </template>
        <div class="myPagination-bar" v-if="totalCount">
          <el-select v-model="consignmentQuery.PageSize" placeholder="20" @change="conPageSizeChange" name="pageSize">
            <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
          </el-select>
          <div class="pagination-controller">
            <button name="btnPrev" class="prev-btn" @click="prevPage" :disabled="consignmentQuery.PageIndex === 1" :class="{'isDisabled': consignmentQuery.PageIndex === 1}">
              <i class="el-icon-arrow-left"></i>
            </button>
            <span class="current-page">{{consignmentQuery.PageIndex}}/{{pages}}</span>
            <button name="btnNext" class="next-btn" @click="nextPage" :disabled="consignmentQuery.PageIndex === pages" :class="{'isDisabled': consignmentQuery.PageIndex === pages}">
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
          <div class="r-num">
            <span class="detail-info-num-item">
              货品数量：
              <b class="num">{{agentTotal.TotalGoodsQty}}</b>
            </span>
            <span class="detail-info-num-item">
              货品金重：
              <b class="num">{{agentTotal.TotalGoldWeight | initWight}}</b>
            </span>
            <span class="detail-info-num-item">
              结算金额：
              <b class="num">￥{{$root.toFloat(agentTotal.TotalCostPrice)}}</b>
            </span>
          </div>
        </div>

        <!-- Data Table -->
        <el-table :data="data" v-loading="$store.getters.tb_loading" class="have-border" element-loading-text="拼命加载中" @sort-change="sortChange">
          <el-table-column prop="OrderType" label="来源" min-width="90" show-overflow-tooltip fixed>
            <template slot-scope="scope">{{settleMonthlyBillAgentOrderType.Types[scope.row.OrderType]}}</template>
          </el-table-column>
          <el-table-column prop="MasterCode" label="来源单号" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StoreName" label="门店" show-overflow-tooltip min-width="160"></el-table-column>
          <el-table-column prop="ActualDate" label="业务日期" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="OrderTime" label="创建时间" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="scope">{{scope.row.OrderTime | filterDateTime}}</template>
          </el-table-column>
          <el-table-column prop="BarCode" label="条码" sortable="custom" show-overflow-tooltip min-width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.GoodsId)">{{scope.row.BarCode}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip min-width="120"></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip min-width="120"></el-table-column>
          <el-table-column prop="GoldWeight" label="金重" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">{{scope.row.GoldWeight | initWight}}</template>
          </el-table-column>
          <el-table-column prop="ProductPrice" label="销售价" show-overflow-tooltip min-width="100">
            <template slot-scope="scope">{{scope.row.ProductPrice | initPrice}}</template>
          </el-table-column>
          <el-table-column prop="CostPrice" label="结算金额" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">{{scope.row.CostPrice | initPrice}}</template>
          </el-table-column>
        </el-table>
        <!-- end Table -->
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </el-col>
    </el-row>
    <good-detail :visible.sync="goodsVisible" :goodsId="goodsId"></good-detail>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common'
import { SettleMonthlyBillUnitType, SettleMonthlyBillAgentOrderType } from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_MONTHLY_BILL_UNIT_GETS,
  STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETS,
  STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETSTOTAL,
  STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_EXPORT
} from '@/apis/stocking'
import goodDetail from '@/components/erp/goodDetail'
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
      settleMonthlyBillAgentOrderType: SettleMonthlyBillAgentOrderType,
      consignmentLoading: false,
      goodsExportVisible: false,
      consignmentQuery: {
        UnitType: SettleMonthlyBillUnitType.Agent,
        PageIndex: 1,
        PageSize: 10
      },
      goodsId: '',
      goodsVisible: false,
      consignments: [], // 供应商数据
      paginationSizes: [10, 15, 20], // 供应商分页数据条数数组
      totalCount: 0, // 供应商总数据条数
      total: 0,
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
      agentTotal: {
        TotalGoodsQty: 0,
        TotalGoldWeight: 0,
        TotalCostPrice: 0
      }
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.consignmentQuery.PageSize === 0
          ? Math.ceil(this.totalCount / this.consignmentQuery.PageSize)
          : parseInt(this.totalCount / this.consignmentQuery.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    getConsignments(first) {
      this.consignmentLoading = true
      STOCKING_API_SETTLE_MONTHLY_BILL_UNIT_GETS(Object.assign(this.consignmentQuery, { BillId: this.billId }))
        .then(res => {
          this.consignmentLoading = false
          if (res.data.Code === 'CORRECT') {
            this.consignments = res.data.Data.Rows || []
            this.totalCount = res.data.Data.Count
            if (first && this.consignments.length) {
              this.consignmentChange(this.consignments[0])
            }
          }
        })
        .catch(() => {
          this.consignmentLoading = false
        })
    },
    showDetail(id) {
      this.goodsId = id
      this.goodsVisible = true
    },
    conPageSizeChange() {
      this.consignmentQuery.PageIndex = 1
      this.getConsignments()
    },
    prevPage() {
      this.consignmentQuery.PageIndex -= 1
      this.getConsignments()
    },
    nextPage() {
      this.consignmentQuery.PageIndex += 1
      this.getConsignments()
    },
    consignmentChange(item) {
      this.queryForm = Object.assign(this.queryForm, {
        UnitId: item.UnitId,
        BillId: item.BillId
      })
      this.getTotal()
      this.getData()
    },
    getTotal() {
      STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETSTOTAL(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.agentTotal = res.data.Data
          } else {
            this.agentTotal = {
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
      STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'ActualDate':
          this.queryForm.OrderBy = 0
          break
        case 'OrderTime':
          this.queryForm.OrderBy = 1
          break
        case 'BarCode':
          this.queryForm.OrderBy = 2
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
          FieldEnName: 'PartnerName',
          FieldCnName: '加盟商'
        }, {
          FieldEnName: 'OrderTypeName',
          FieldCnName: '来源'
        },
        {
          FieldEnName: 'MasterCode',
          FieldCnName: '来源单号'
        },
        {
          FieldEnName: 'StoreName',
          FieldCnName: '门店'
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
          FieldEnName: 'BarCode',
          FieldCnName: '条码'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号'
        },
        {
          FieldEnName: 'GoldWeight',
          FieldCnName: '金重',
          Precision: 3
        },
        {
          FieldEnName: 'ProductPrice',
          FieldCnName: '销售价',
          Precision: 2
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
      STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_EXPORT(param).then(res => {
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
    this.getConsignments(true)
  },
  mounted() { },
  components: {
    goodDetail,
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

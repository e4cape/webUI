<template>
  <div class="content" v-loading="$store.getters.tb_loading">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看资料完善单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.InfoState === GoodsQualityOrderBasicStepState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.InfoState === GoodsQualityOrderBasicStepState.Finish"
                  >
                  <div>{{GoodsQualityOrderBasicStepState.Types[detail.InfoState]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">来源</td>
                <td>{{GoodsQualityOrderBasicQualityType.Types[detail.QualityType]}}</td>
                <td class="tit">来源单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">完成时间</td>
                <td>{{detail.InfoTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <span class="order-list-text">货品列表</span>
        </div>
        <div class="goods-wrapper">
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="index"
                  :class="{active:item.ItemId === goodsId}"
                  @click="rowSelect(item)"
                >
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.StoreBarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select
                  filterable
                  name="pageSize"
                  v-model="parameters.PageSize"
                  placeholder="20"
                >
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="parameters.PageIndex === 1"
                    :class="{'isDisabled': parameters.PageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{parameters.PageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="parameters.PageIndex === pages"
                    :class="{'isDisabled': parameters.PageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.Quantity}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
              </div>
              <goods-details :itemId="goodsId" v-if="goodsId" :apis="apis" :option="detailOption"></goods-details>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <router-link
        :to="{path:'/purchase/perfectInformation/informationEdit',query:{id: detail.QualityId}}"
        name="btnEdit"
        v-if="detail.InfoState === GoodsQualityOrderBasicStepState.Wait"
      >
        <el-button type="primary">完善资料</el-button>
      </router-link>
      <el-button
        name="btnCompleted"
        type="primary"
        @click="markComplete($event, 'completed')"
        v-if="detail.InfoState === GoodsQualityOrderBasicStepState.Wait"
      >标记已完成</el-button>
      <el-button
        name="btnUnfinished"
        @click="markComplete($event, 'unfinished')"
        v-if="detail.InfoState === GoodsQualityOrderBasicStepState.Finish"
      >标记未完成</el-button>
      <el-button
        @click="downLoadGoods"
        :disabled="detailOption.KindTypeEk === 0"
        name="btnDownloadData"
      >导出列表</el-button>
      <el-button @click="showOperationRecords = true" name="btnPrint">操作日志</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>
    <!-- @module 操作记录 -->
    <el-dialog title="操作日志" :visible.sync="showOperationRecords" width="640px">
      <el-table :data="detail.Logs">
        <el-table-column property="CheckTime" label="操作时间" min-width="150">
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column property="CheckUser" label="操作人" min-width="100"></el-table-column>
        <el-table-column property="CheckState" label="操作类型" min-width="100">
          <template
            slot-scope="scope"
          >{{GoodsQualityOrderBasicStepState.Types[scope.row.CheckState]}}</template>
        </el-table-column>
        <el-table-column property="CheckNote" label="备注" min-width="150"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- End 操作记录 -->
  </div>
</template>

<script>
import {
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType
} from '@/enums/stocking'
import { YNStatus, EnableState } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORT
} from '@/apis/stocking'
import goodsDetails from '@/components/purchase/goodsDetails'
import pagination from '@/components/pagination'
import viewGoodTable from '@/components/purchase/viewGoodTable'

export default {
  data() {
    return {
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      apis: STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
      goodsData: [], // 货品数据
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      detail: {
        CostPrice: 0
      },
      goodsId: '', // 选中的货品id
      showOperationRecords: false, // 操作日志
      currentRow: {},
      showType: 1, // 显示类型
      detailOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsQualityOrderBasic2,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0,
        IsEnable: EnableState.Enable
      }
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.parameters.PageSize === 0
          ? this.totalCount / this.parameters.PageSize
          : parseInt(this.totalCount / this.parameters.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameters.QualityId = parseInt(query.id)
      if (!this.parameters.QualityId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
          this.detailOption.KindTypeEk = this.detail.KindTypeEk
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.currentRow =
            this.goodsData && this.goodsData.length && this.goodsData[0]
          this.indexPageSize = this.parameters.PageSize
          this.indexPageIndex = this.parameters.PageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    typeChange() {
      if (this.showType === 2) {
        this.getGoods()
      }
    },
    rowSelect(item) {
      this.goodsId = item.ItemId
      this.currentRow = item
    },
    prevPage() {
      this.parameters.PageIndex -= 1
    },
    nextPage() {
      this.parameters.PageIndex += 1
    },
    markComplete($event, compt) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, infoState
      if (compt === 'completed') {
        str = '完成'
        infoState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '未完成'
        infoState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.detail.QualityId,
            InfoState: infoState
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getDetail()
              this.$message({
                type: 'success',
                message: `标记${str}成功!`
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消标记'
          })
        })
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getGoods()
    },
    // 导出数据
    downLoadGoods() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORT({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
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
  mounted() {
    this.init()
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.parameters.PageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    pagination,
    viewGoodTable
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.checkPage-hd .check-group /deep/ .is-active i {
  color: #fff;
}
.order-list-text {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
</style>

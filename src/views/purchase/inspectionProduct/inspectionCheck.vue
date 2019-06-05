<template>
  <el-row v-loading="$store.getters.tb_loading">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看质检单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.QualityState === GoodsQualityOrderBasicStepState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.QualityState === GoodsQualityOrderBasicStepState.Finish"
                  >
                  <div>{{GoodsQualityOrderBasicStepState.Types[detail.QualityState]}}</div>
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
                <td>{{detail.QualityTime | filterDateMinutes}}</td>
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
          <div class="fr">
            <span class="detail-info-num-item">
              到货数量：
              <b class="num">{{detail.ArriveQty || '-'}}</b>
            </span>
            <span class="detail-info-num-item">
              次品数量：
              <b class="num">{{detail.WeekQty || '-'}}</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <viewGoodTable v-if="option.KindTypeEk" :goodsData="data" :option="option"/>
          <pagination
            :pg="parameters.PageIndex"
            :size="parameters.PageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button
        name="btnQualityInspection"
        type="primary"
        @click="$router.push({path:'/purchase/inspectionProduct/qualityInspection',query:{id: detail.QualityId}})"
        v-if="detail.QualityState == GoodsQualityOrderBasicStepState.Wait"
      >质检</el-button>
      <el-button
        name="btnCompleted"
        type="primary"
        @click="markComplete($event, 'completed')"
        :key="detail.QualityId"
        v-if="detail.QualityState === GoodsQualityOrderBasicStepState.Wait"
      >标记已完成</el-button>
      <el-button
        name="btnUnfinished"
        @click="markComplete($event, 'unfinished')"
        :key="detail.QualityId"
        v-if="detail.QualityState === GoodsQualityOrderBasicStepState.Finish"
      >标记未完成</el-button>
      <el-button
        name="btnExportList"
        :disabled="option.KindTypeEk === 0"
        @click="goodsExportVisible = true"
      >导出列表</el-button>
      <el-button name="btnOperation" @click="showOperationRecords = true">操作日志</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
    <!-- @module 操作日志 -->
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
    <!-- End 操作日志 -->
    <!-- @module 导出货品详情 -->
    <export-goods-detail
      v-if="goodsExportVisible"
      :visible.sync="goodsExportVisible"
      @submit="downLoadGoods"
      :option="option"
    />
    <!-- End 导出货品详情 -->
  </el-row>
</template>

<script>
import {
  StoneColor,
  StoneClarity,
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORTGETSRESULT
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import exportGoodsDetail from '@/components/erp/exportGoodsDetail'
import viewGoodTable from '@/components/purchase/viewGoodTable'

export default {
  data() {
    return {
      StoneColor,
      StoneClarity,
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      detail: {},
      data: [],
      total: 0,
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      showOperationRecords: false,
      goodsExportVisible: false,
      currentRow: {},
      option: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsQualityOrderBasic1,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 0,
        isEnable: YNStatus.Yes
      }
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
          this.option.KindTypeEk = this.detail.KindTypeEk
          this.getData()
        }
      })
    },
    getData() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    markComplete($event, compt) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, qualityState
      if (compt === 'completed') {
        str = '完成'
        qualityState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '未完成'
        qualityState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.detail.QualityId,
            QualityState: qualityState
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
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    handleCurrentChange(row) {
      this.currentRow = row
    },
    // 导出数据
    downLoadGoods(column) {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORTGETSRESULT({
        QualityId: this.parameters.QualityId,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 0,
        ExportColumns: column
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
        this.goodsExportVisible = false
      })
    }
  },
  created() {
    this.parameters.QualityId = parseInt(this.$route.query.id)
    this.getDetail()
  },
  mounted() {},
  components: {
    pagination,
    exportGoodsDetail,
    viewGoodTable
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.order-list-text {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
</style>

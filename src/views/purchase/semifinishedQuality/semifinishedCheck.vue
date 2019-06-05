<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
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
                    v-if="detail.QualityState === HalfIntakeOrderBasicQualityState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.QualityState === HalfIntakeOrderBasicQualityState.Finish"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.QualityState === HalfIntakeOrderBasicQualityState.Cancel"
                  >
                  <div>{{HalfIntakeOrderBasicQualityState.Types[detail.QualityState]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">来源单号</td>
                <td>{{detail.IntakeCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">完成时间</td>
                <td>{{detail.CheckTime | filterDateMinutes}}</td>
              </tr>
              <tr>
                <td class="tit">入库数量</td>
                <td>{{detail.ItemQty}}</td>
                <td class="tit">入库重量</td>
                <td>{{$root.toFloat(detail.Weight, 3)}}g</td>
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
              入库数量：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
            <span class="detail-info-num-item">
              入库重量：
              <b class="num">{{$root.toFloat(detail.Weight, 3)}}g</b>
            </span>
            <span class="detail-info-num-item">
              次品数量：
              <b class="num">{{detail.WeekQty}}</b>
            </span>
            <span class="detail-info-num-item">
              次品重量：
              <b class="num">{{$root.toFloat(detail.WeekWgt, 3)}}g</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="HalfName" label="半成品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="WeekQty" label="次品数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="WeekWgt" label="次品重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.WeekWgt, 3)}}g</template>
            </el-table-column>
          </el-table>
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
        name="btnInspection"
        type="primary"
        @click="$router.push({path:'/purchase/semifinishedQuality/semiInspection',query:{id: detail.IntakeId}})"
        v-if="detail.QualityState == HalfIntakeOrderBasicQualityState.Wait"
      >质检</el-button>
      <el-button
        name="btnCompleted"
        @click="markComplete($event, 'completed')"
        v-if="detail.QualityState === HalfIntakeOrderBasicQualityState.Wait"
      >标记已完成</el-button>
      <el-button
        name="btnUnfinished"
        @click="markComplete($event, 'unfinished')"
        v-if="detail.QualityState === HalfIntakeOrderBasicQualityState.Finish"
      >标记未完成</el-button>
      <el-button name="btnExportList" @click="ExportVisible = true">导出列表</el-button>
      <el-button name="btnOperation" @click="showOperationRecords = true">操作日志</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
    <!-- @module 操作记录 -->
    <el-dialog title="操作日志" :visible.sync="showOperationRecords" width="640px">
      <el-table :data="detail.Logs">
        <el-table-column property="CheckTime" label="操作时间" min-width="120">
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column property="CheckUser" label="操作人" min-width="100"></el-table-column>
        <el-table-column property="CheckState" label="操作类型" min-width="100">
          <template
            slot-scope="scope"
          >{{HalfIntakeOrderBasicQualityState.Types[scope.row.CheckState]}}</template>
        </el-table-column>
        <el-table-column property="CheckNote" label="备注" min-width="150"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- End 操作记录 -->
    <!-- @module 导出列表 -->
    <base-export-field-setter
      @submit="downLoadData"
      :title="'导出'"
      :visible.sync="ExportVisible"
      :items="ExportColumns"
      :props="{key: 'FieldEnName', label: 'FieldCnName'}"
    />
    <!-- End 导出列表 -->
  </el-row>
</template>

<script>
import { HalfIntakeOrderBasicQualityState } from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAITQUALITY,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSRESULT
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      HalfIntakeOrderBasicQualityState,
      detail: {},
      total: 0,
      parameters: {
        IntakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      showOperationRecords: false,
      ExportVisible: false,
      ExportColumns: [
        {
          FieldEnName: 'HalfName',
          FieldCnName: '半成品名称'
        },
        {
          FieldEnName: 'Quantity',
          FieldCnName: '数量'
        },
        {
          FieldEnName: 'Weight',
          FieldCnName: '重量(g)',
          Precision: 3
        },
        {
          FieldEnName: 'WeekQty',
          FieldCnName: '次品数量'
        },
        {
          FieldEnName: 'WeekWgt',
          FieldCnName: '次品重量',
          Precision: 3
        }
      ]
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
        }
      })
    },
    getData() {
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    markComplete($event, compt) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, api
      if (compt === 'completed') {
        str = '完成'
        api = STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY
      } else {
        str = '未完成'
        api = STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAITQUALITY
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api({ items: [{ IntakeId: this.detail.IntakeId }] }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(`标记${str}成功`)
              this.getDetail()
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
    downLoadData(column) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSRESULT({
        IntakeId: this.detail.IntakeId,
        OrderBy: 0,
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
        this.ExportVisible = false
      })
    }
  },
  created() {
    this.parameters.IntakeId = parseInt(this.$route.query.id)
    this.getDetail()
  },
  mounted() {
    this.getData()
  },
  components: {
    pagination,
    baseExportFieldSetter
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

<template>
  <el-row>
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看鉴定送检单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.SendState === GoodsQualityOrderBasicStepState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.SendState === GoodsQualityOrderBasicStepState.Finish"
                  >
                  <div>{{GoodsQualityOrderBasicStepState.Types[detail.SendState]}}</div>
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
                <td>{{detail.SendTime | filterDateMinutes}}</td>
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
              一码一货数量：
              <b class="num">{{sendNum + unSendNum}}</b>
            </span>
            <span class="detail-info-num-item">
              送检数量：
              <b class="num">{{detail.SendQty}}</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <ul class="tabs border-bottom-1px">
            <li
              name="tab0"
              class="tab"
              :class="{active: activeName == 'yes'}"
              @click="changeTabs('yes')"
            >送检({{sendNum}})</li>
            <li
              name="tab1"
              class="tab"
              :class="{active: activeName == 'no'}"
              @click="changeTabs('no')"
            >不送检({{unSendNum}})</li>
          </ul>
          <div class="panel">
            <el-table
              :data="sendData"
              class="no-border m-b-10"
              v-loading="$store.getters.tb_loading"
              element-loading-text="拼命加载中"
              v-if="activeName == 'yes'"
            >
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column prop="BarCode" label="条码" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Weight" label="货重" min-width="60" show-overflow-tooltip>
                <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
              </el-table-column>
              <el-table-column prop="Stone1Color" label="主石颜色" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{stoneColor.Types[scope.row.Stone1Color]}}</template>
              </el-table-column>
              <el-table-column
                prop="Stone1Clarity"
                label="主石净度"
                min-width="80"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{stoneClarity.Types[scope.row.Stone1Clarity]}}</template>
              </el-table-column>
              <el-table-column prop="Stone1Cut" label="主石切工" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{stoneCut.Types[scope.row.Stone1Cut]}}</template>
              </el-table-column>
              <el-table-column label="质检情况" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.WeekQty > 0 ? '次品' : '良品'}}</template>
              </el-table-column>
              <!-- <el-table-column prop="Cert1Number" label="是否有证书" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.Cert1Number && scope.row.Cert2Number ? '有' : '无'}}
                </template>
              </el-table-column>-->
              <el-table-column prop="IsSended" label="是否送检" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.IsSended === YNStatus.Yes ? '是' : '否'}}</template>
              </el-table-column>
              <el-table-column prop="SendNote" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-table
              :data="unSendData"
              class="no-border m-b-10"
              v-loading="$store.getters.tb_loading"
              element-loading-text="拼命加载中"
              v-if="activeName == 'no'"
            >
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column prop="BarCode" label="条码" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Weight" label="货重" min-width="60" show-overflow-tooltip>
                <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
              </el-table-column>
              <el-table-column prop="Stone1Color" label="主石颜色" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{stoneColor.Types[scope.row.Stone1Color]}}</template>
              </el-table-column>
              <el-table-column
                prop="Stone1Clarity"
                label="主石净度"
                min-width="80"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{stoneClarity.Types[scope.row.Stone1Clarity]}}</template>
              </el-table-column>
              <el-table-column prop="Stone1Cut" label="主石切工" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{stoneCut.Types[scope.row.Stone1Cut]}}</template>
              </el-table-column>
              <el-table-column prop="GoodQty" label="质检情况" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.WeekQty > 0 ? '次品' : '良品'}}</template>
              </el-table-column>
              <!-- <el-table-column prop="Cert1Number" label="是否有证书" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.Cert1Number || scope.row.Cert2Number ? '有' : '无'}}
                </template>
              </el-table-column>-->
              <el-table-column prop="IsSended" label="是否送检" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.IsSended === YNStatus.Yes ? '是' : '否'}}</template>
              </el-table-column>
              <el-table-column prop="SendNote" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
            </el-table>
            <pagination
              v-if="activeName == 'yes'"
              :pg="sendForm.PageIndex"
              :size="sendForm.PageSize"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
            <pagination
              v-if="activeName == 'no'"
              :pg="unSendForm.PageIndex"
              :size="unSendForm.PageSize"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
          </div>
        </div>
      </div>
    </div>

    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button
        name="btnCensorship"
        type="primary"
        @click="$router.push({path:'/purchase/censorshipProduct/censorship',query:{id: detail.QualityId}})"
        v-if="detail.SendState == GoodsQualityOrderBasicStepState.Wait"
      >送检</el-button>
      <el-button
        type="primary"
        name="btnMarkCompleted"
        @click="markComplete($event, 'completed')"
        v-if="detail.SendState === GoodsQualityOrderBasicStepState.Wait"
      >标记已完成</el-button>
      <el-button
        name="btnMarkUnfinished"
        @click="markComplete($event, 'unfinished')"
        v-if="detail.SendState === GoodsQualityOrderBasicStepState.Finish"
      >标记未完成</el-button>
      <el-button name="btnExportList" @click="ExportVisible = true">导出列表</el-button>
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
    <base-export-field-setter
      @submit="downLoadData"
      :title="'导出'"
      :visible.sync="ExportVisible"
      :items="ExportColumns"
      :props="{key: 'FieldEnName', label: 'FieldCnName'}"
    />
    <!-- End 导出货品详情 -->
  </el-row>
</template>

<script>
import {
  StoneColor,
  StoneClarity,
  StoneCut,
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType
} from '@/enums/stocking'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORTGETSRESULT
} from '@/apis/stocking'
import { YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      stoneColor: StoneColor,
      stoneClarity: StoneClarity,
      stoneCut: StoneCut,
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      YNStatus,
      detail: {},
      sendNum: 0,
      unSendNum: 0,
      sendForm: {
        QualityId: '',
        GoodsType: 1,
        IsSended: YNStatus.Yes,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      unSendForm: {
        QualityId: '',
        GoodsType: 1,
        IsSended: YNStatus.No,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      sendData: [],
      unSendData: [],
      activeName: 'yes',
      showOperationRecords: false,
      ExportVisible: false,
      ExportColumns: [
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码'
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'Weight',
          FieldCnName: '货重',
          Precision: 3
        },
        {
          FieldEnName: 'Stone1Color',
          FieldCnName: '主石颜色'
        },
        {
          FieldEnName: 'Stone1Clarity',
          FieldCnName: '主石净度'
        },
        {
          FieldEnName: 'Stone1Cut',
          FieldCnName: '主石切工'
        },
        {
          FieldEnName: 'GoodQty',
          FieldCnName: '质检情况'
        },
        {
          FieldEnName: 'Cert1Number',
          FieldCnName: '是否有证书'
        },
        {
          FieldEnName: 'IsSended',
          FieldCnName: '是否送检'
        },
        {
          FieldEnName: 'SendNote',
          FieldCnName: '备注'
        }
      ]
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.sendForm.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
        }
      })
    },
    getData() {
      this.getInspected()
      this.getUnInspect()
    },
    getInspected() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.sendForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.sendData = res.data.Data.Rows || []
          this.sendNum = res.data.Data.Count
          this.total = res.data.Data.Count
        }
      })
    },
    getUnInspect() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.unSendForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.unSendNum = res.data.Data.Count
          this.unSendData = res.data.Data.Rows || []
          if (this.activeName === 'no') {
            this.total = res.data.Data.Count
          }
        }
      })
    },
    changeTabs(val) {
      this.activeName = val
      if (this.activeName === 'yes') {
        this.getInspected()
      } else {
        this.getUnInspect()
      }
    },
    markComplete($event, compt) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, sendState
      if (compt === 'completed') {
        str = '完成'
        sendState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '未完成'
        sendState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.detail.QualityId,
            SendState: sendState
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
      this.activeName == 'yes' ? this.getInspected() : this.getUnInspect()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.activeName == 'yes' ? this.getInspected() : this.getUnInspect()
    },
    // 导出数据
    downLoadData(column) {
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
        this.ExportVisible = false
      })
    }
  },
  created() {
    this.sendForm.QualityId = this.unSendForm.QualityId = parseInt(
      this.$route.query.id
    )
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
.checkPage-hd {
  padding-bottom: 0;
}
.order-list-text {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
</style>

<template>
  <el-row>
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看证书录入单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.CertState === GoodsQualityOrderBasicStepState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.CertState === GoodsQualityOrderBasicStepState.Finish"
                  >
                  <div>{{GoodsQualityOrderBasicStepState.Types[detail.CertState]}}</div>
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
                <td>{{detail.CertTime | filterDateMinutes}}</td>
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
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="BarCode" label="条码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="到货货重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column
              prop="Stone1Color"
              label="到货主石颜色"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneColor.Types[scope.row.Stone1Color]}}</template>
            </el-table-column>
            <el-table-column
              prop="Stone1Clarity"
              label="到货主石净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.Stone1Clarity]}}</template>
            </el-table-column>
            <el-table-column prop="Stone1Cut" label="到货主石切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneCut.Types[scope.row.Stone1Cut]}}</template>
            </el-table-column>
            <el-table-column
              prop="Cert1Number"
              label="证书️①编号"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="Cert1Name" label="证书①类型" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="Cert1Organz"
              label="证书①鉴定机构"
              min-width="110"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="Cert1Weight" label="证书①重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Cert1Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="Cert1Color" label="证书①颜色" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneColor.Types[scope.row.Cert1Color]}}</template>
            </el-table-column>
            <el-table-column
              prop="Cert1Clarity"
              label="证书①净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.Cert1Clarity]}}</template>
            </el-table-column>
            <el-table-column prop="Cert1Cut" label="证书①切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneCut.Types[scope.row.Cert1Cut]}}</template>
            </el-table-column>
            <el-table-column prop="Cert1Shape" label="证书①形状" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert1Fee" label="证书①费用" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Cert1Fee)}}</template>
            </el-table-column>
            <el-table-column prop="Cert1Wide" label="证书①台宽比" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert1Depth" label="证书①亭深比" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert1Image" label="证书①图片" min-width="100">
              <template slot-scope="scope">
                <el-popover placement="right" trigger="hover">
                  <img
                    :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.Cert1Image || '/default/goods/150x150.jpg')"
                  >
                  <img
                    :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.Cert1Image || '/default/goods/150x150.jpg')"
                    style="height:40px; width:40px;"
                    slot="reference"
                  >
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert2Number"
              label="证书️②编号"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="Cert2Name" label="证书②类型" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="Cert2Organz"
              label="证书②鉴定机构"
              min-width="110"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="Cert2Weight" label="证书②重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Cert2Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="Cert2Color" label="证书②颜色" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneColor.Types[scope.row.Cert2Color]}}</template>
            </el-table-column>
            <el-table-column
              prop="Cert2Clarity"
              label="证书②净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.Cert2Clarity]}}</template>
            </el-table-column>
            <el-table-column prop="Cert2Cut" label="证书②切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneCut.Types[scope.row.Cert2Cut]}}</template>
            </el-table-column>
            <el-table-column prop="Cert2Shape" label="证书②形状" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert2Fee" label="证书②费用" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Cert2Fee)}}</template>
            </el-table-column>
            <el-table-column prop="Cert2Wide" label="证书②台宽比" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert2Depth" label="证书②亭深比" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Cert2Image" label="证书②图片" min-width="100">
              <template slot-scope="scope">
                <el-popover placement="right" trigger="hover">
                  <img
                    :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.Cert2Image || '/default/goods/150x150.jpg')"
                  >
                  <img
                    :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.Cert2Image || '/default/goods/150x150.jpg')"
                    style="height:40px; width:40px;"
                    slot="reference"
                  >
                </el-popover>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="GoodsNote" label="检测后处理" min-width="80" show-overflow-tooltip></el-table-column> -->
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
        name="btnEntryCertificate"
        type="primary"
        @click="$router.push({path:'/purchase/certificateInput/entryCertificate',query:{id: detail.QualityId}})"
        v-if="detail.CertState == GoodsQualityOrderBasicStepState.Wait"
      >录入证书</el-button>
      <el-button
        type="primary"
        name="btnMarkCompleted"
        @click="markComplete($event, 'completed')"
        v-if="detail.CertState === GoodsQualityOrderBasicStepState.Wait"
      >标记已完成</el-button>
      <el-button
        name="btnMarkUnfinished"
        @click="markComplete($event, 'unfinished')"
        v-if="detail.CertState === GoodsQualityOrderBasicStepState.Finish"
      >标记未完成</el-button>
      <el-button name="btnExportList" @click="ExportVisible = true">导出列表</el-button>
      <el-button name="btnOperationRecord" @click="showOperationRecords = true">操作日志</el-button>
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
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORTGETSRESULT
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      StoneColor,
      StoneClarity,
      StoneCut,
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      detail: {},
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      showOperationRecords: false,
      currentRow: {},
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
          FieldCnName: '到货货重',
          Precision: 3
        },
        {
          FieldEnName: 'Stone1ColorName',
          FieldCnName: '到货主石颜色'
        },
        {
          FieldEnName: 'Stone1ClarityName',
          FieldCnName: '到货主石净度'
        },
        {
          FieldEnName: 'Stone1CutName',
          FieldCnName: '到货主石切工'
        },
        {
          FieldEnName: 'Cert1Number',
          FieldCnName: '证书️①编号'
        },
        {
          FieldEnName: 'Cert1Name',
          FieldCnName: '证书①类型'
        },
        {
          FieldEnName: 'Cert1Organz',
          FieldCnName: '证书①鉴定机构'
        },
        {
          FieldEnName: 'Cert1Weight',
          FieldCnName: '证书①重量',
          Precision: 3
        },
        {
          FieldEnName: 'Cert1ColorName',
          FieldCnName: '证书①颜色'
        },
        {
          FieldEnName: 'Cert1ClarityName',
          FieldCnName: '证书①净度'
        },
        {
          FieldEnName: 'Cert1CutName',
          FieldCnName: '证书①切工'
        },
        {
          FieldEnName: 'Cert1Shape',
          FieldCnName: '证书①形状'
        },
        {
          FieldEnName: 'Cert1Fee',
          FieldCnName: '证书①费用',
          Precision: 2
        },
        {
          FieldEnName: 'Cert1Wide',
          FieldCnName: '证书①台宽比'
        },
        {
          FieldEnName: 'Cert1Depth',
          FieldCnName: '证书①亭深比'
        },
        {
          FieldEnName: 'Cert1Image',
          FieldCnName: '证书①图片'
        },
        {
          FieldEnName: 'Cert2Number',
          FieldCnName: '证书️②编号'
        },
        {
          FieldEnName: 'Cert2Name',
          FieldCnName: '证书②类型'
        },
        {
          FieldEnName: 'Cert2Organz',
          FieldCnName: '证书②鉴定机构'
        },
        {
          FieldEnName: 'Cert2Weight',
          FieldCnName: '证书②重量',
          Precision: 3
        },
        {
          FieldEnName: 'Cert2ColorName',
          FieldCnName: '证书②颜色'
        },
        {
          FieldEnName: 'Cert2ClarityName',
          FieldCnName: '证书②净度'
        },
        {
          FieldEnName: 'Cert2CutName',
          FieldCnName: '证书②切工'
        },
        {
          FieldEnName: 'Cert2Fee',
          FieldCnName: '证书②费用',
          Precision: 2
        },
        {
          FieldEnName: 'Cert2Wide',
          FieldCnName: '证书②台宽比'
        },
        {
          FieldEnName: 'Cert2Depth',
          FieldCnName: '证书②亭深比'
        },
        {
          FieldEnName: 'Cert2Image',
          FieldCnName: '证书②图片'
        },
        {
          FieldEnName: 'Cert2Shape',
          FieldCnName: '证书②形状'
        }
      ]
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
        }
      })
    },
    getData() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    markComplete($event, compt) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, certState
      if (compt === 'completed') {
        str = '完成'
        certState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '未完成'
        certState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.detail.QualityId,
            CertState: certState
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
    this.parameters.QualityId = parseInt(this.$route.query.id)
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

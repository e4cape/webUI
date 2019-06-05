<template>
  <el-row>
    <div v-loading="$store.getters.tb_loading">
      <div class="panel">
        <div class="panel-hd">
          <span class="title">查看半成品入库单({{detail.KindTypeEv}})</span>
        </div>
        <div class="panel-bd">
          <div class="details-info-table">
            <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td rowspan="5" class="state-img">
                    <img
                      src="@/assets/images/draft.png"
                      v-if="detail.State === HalfIntakeOrderBasicState.Draft"
                    >
                    <img
                      src="@/assets/images/auditing.png"
                      v-if="detail.State === HalfIntakeOrderBasicState.Wait"
                    >
                    <img
                      src="@/assets/images/audited.png"
                      v-if="detail.State === HalfIntakeOrderBasicState.Audit"
                    >
                    <img
                      src="@/assets/images/auditBack.png"
                      v-if="detail.State === HalfIntakeOrderBasicState.Reject"
                    >
                    <img
                      src="@/assets/images/abandon.png"
                      v-if="detail.State === HalfIntakeOrderBasicState.Abandon || detail.State === HalfIntakeOrderBasicState.Cancel"
                    >
                    <div>{{HalfIntakeOrderBasicState.Types[detail.State]}}</div>
                  </td>
                </tr>
                <tr>
                  <td class="tit">单号</td>
                  <td>{{detail.IntakeCode}}</td>
                  <td class="tit">创建</td>
                  <td>{{detail.CreateUser}}&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                  <td class="tit">审核</td>
                  <td
                    v-if="detail.State === HalfIntakeOrderBasicState.Audit || detail.State === HalfIntakeOrderBasicState.Reject"
                  >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                  <td v-else>-</td>
                </tr>
                <tr>
                  <td class="tit">业务日期</td>
                  <td>{{detail.ActualDate | filterDate}}</td>
                  <td class="tit">供应商</td>
                  <td>{{detail.PartnerName}}</td>
                  <td class="tit">采购员</td>
                  <td>{{detail.ChargeUser}}</td>
                </tr>
                <tr>
                  <td class="tit">包号</td>
                  <td>{{detail.PackageNo}}</td>
                  <td class="tit">送货单号</td>
                  <td>{{detail.ExpressCode}}</td>
                  <td class="tit">入库位置</td>
                  <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                </tr>
                <tr>
                  <td class="tit">货品类别</td>
                  <td>{{financeTypes.Types[detail.FinanceType]}}</td>
                  <td class="tit">进货方式</td>
                  <td>{{purchaseTypes.Types[detail.PurchaseType]}}</td>
                  <td class="tit">备注</td>
                  <td>{{detail.Note}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="checkPage-hd">
            <span class="order-list-text">货品列表</span>
            <div class="fr">
              <span class="detail-info-num-item">
                数量：
                <b class="num">{{detail.ItemQty || '-'}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：
                <b class="num">{{$root.toFloat(detail.Weight, 3) || '-'}}g</b>
              </span>
              <span class="detail-info-num-item">
                金额：
                <b class="num">￥{{$root.toFloat(detail.CostPrice) || '-'}}</b>
              </span>
            </div>
          </div>
          <div class="p-x-10">
            <el-table :data="data" class="m-b-10">
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column prop="HalfName" label="半成品名称" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Quantity" label="数量" min-width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Weight" label="重量" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
              </el-table-column>
              <el-table-column
                prop="GoldPrice"
                label="金价(元/克)"
                min-width="80"
                show-overflow-tooltip
              >
                <template slot-scope="scope">￥{{$root.toFloat(scope.row.GoldPrice)}}</template>
              </el-table-column>
              <el-table-column
                prop="CraftFee1"
                label="工费①计价(元/克)"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">￥{{$root.toFloat(scope.row.CraftFee1)}}</template>
              </el-table-column>
              <el-table-column
                prop="CraftFee2"
                label="工费②计件(元/件)"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot-scope="scope">￥{{$root.toFloat(scope.row.CraftFee2)}}</template>
              </el-table-column>
              <el-table-column prop="OtherFee" label="其他费用" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">￥{{$root.toFloat(scope.row.OtherFee)}}</template>
              </el-table-column>
              <el-table-column prop="CostPrice" label="成本" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">￥{{$root.toFloat(scope.row.CostPrice)}}</template>
              </el-table-column>
              <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
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
          name="btnEdit"
          type="primary"
          @click="$router.push({path:'/purchase/semiPackageArrival/semiArrivalEdit',query:{id: detail.IntakeId}})"
          v-if="detail.State == HalfIntakeOrderBasicState.Draft || detail.State == HalfIntakeOrderBasicState.Reject"
        >编辑</el-button>
        <el-button
          name="btnAudit"
          @click="showAudit"
          v-if="detail.State === HalfIntakeOrderBasicState.Wait"
        >审核</el-button>
        <el-button
          name="btnCancel"
          @click="cancelAudit('cancel')"
          v-if="detail.State === HalfIntakeOrderBasicState.Audit"
        >取消审核</el-button>
        <el-button
          name="btnInvalid"
          @click="cancelAudit('invalid')"
          v-if="detail.State == HalfIntakeOrderBasicState.Draft || detail.State == HalfIntakeOrderBasicState.Reject"
        >作废</el-button>
        <el-button name="btnExportDetails" @click="ExportVisible = true">导出货品详情</el-button>
        <el-button name="btnBack" @click="$router.back()">返回</el-button>
      </el-row>
      <!-- @module 审核 -->
      <el-dialog title="审核" :visible.sync="auditCheck" width="580px">
        <el-form
          label-position="right"
          label-width="80px"
          :model="detail"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item label="单据编号：">
            <span>{{detail.IntakeCode}}</span>
          </el-form-item>
          <el-form-item label="创建：">
            <span>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</span>
          </el-form-item>
          <el-form-item label="审核结果：">
            <el-radio-group name="stateCheck" v-model="stateCheck">
              <el-radio :label="HalfIntakeOrderBasicState.Audit">审核通过</el-radio>
              <el-radio :label="HalfIntakeOrderBasicState.Reject">审核退回</el-radio>
              <el-input
                name="checkNote"
                style="width:178px;"
                v-model="checkNote"
                :disabled="stateCheck === HalfIntakeOrderBasicState.Audit"
                placeholder="退回原因备注"
                @keyup.enter="isAudit"
                maxlength="200"
              ></el-input>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="btnIsAudit" type="primary" @click="isAudit">保存</el-button>
          <el-button name="btnClose" @click="auditCheck = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 审核 -->
      <!-- @module 取消审核/作废确认 -->
      <el-dialog
        :title="cancelName === 'cancel' ? '取消审核' : '作废确认'"
        :visible.sync="cancelCheck"
        width="580px"
      >
        <el-form label-position="right" label-width="100px" :model="detail" @submit.native.prevent>
          <el-row>
            <el-col :span="10">
              <el-form-item label="单据编号：">
                <span>{{detail.IntakeCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="创建：">
                <span>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="cancelName === 'cancel' ? '取消原因：' : '作废原因：'">
            <el-input
              name="checkNote"
              v-model="checkNote"
              :placeholder="cancelName === 'cancel' ? '取消原因备注' : '作废原因备注'"
              @keyup.enter="isCancel"
              maxlength="200"
            ></el-input>
          </el-form-item>
          <div>{{cancelName === 'cancel' ? '取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？' : '作废后该单据所产生的库存等业务数据也将回退，确定作废？'}}</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="btnIsCancel" type="primary" @click="isCancel">确定</el-button>
          <el-button name="btnClose" @click="cancelCheck = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- End 取消审核/作废确认 -->
      <!-- @module 导出货品详情 -->
      <base-export-field-setter
        @submit="downLoadData"
        :title="'导出'"
        :visible.sync="ExportVisible"
        :items="ExportColumns"
        :props="{key: 'FieldEnName', label: 'FieldCnName'}"
      />
      <!-- End 导出货品详情 -->
    </div>
  </el-row>
</template>

<script>
import { YNStatus, PurchaseType } from '@/enums/common'
import { FinanceType, HalfIntakeOrderBasicState } from '@/enums/stocking'
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDIT,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECT,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_ABANDON,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCEL,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSHALF
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      purchaseTypes: PurchaseType,
      financeTypes: FinanceType,
      HalfIntakeOrderBasicState,
      parameters: {
        IntakeId: '',
        PageIndex: 1,
        PageSize: 20
      },
      detail: {},
      orderInfo: {},
      data: [],
      total: 0,
      auditCheck: false,
      cancelCheck: false,
      cancelName: 'cancel',
      checkNote: '',
      stateCheck: HalfIntakeOrderBasicState.Audit, // 审核结果
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
          FieldCnName: '重量',
          Precision: 3
        },
        {
          FieldEnName: 'GoldPrice',
          FieldCnName: '金价(元/克)',
          Precision: 2
        },
        {
          FieldEnName: 'CraftFee1',
          FieldCnName: '工费①计价(元/克)',
          Precision: 2
        },
        {
          FieldEnName: 'CraftFee2',
          FieldCnName: '工费②计件(元/件)',
          Precision: 2
        },
        {
          FieldEnName: 'OtherFee',
          FieldCnName: '其他费用',
          Precision: 2
        },
        {
          FieldEnName: 'CostPrice',
          FieldCnName: '成本',
          Precision: 2
        },
        {
          FieldEnName: 'Note',
          FieldCnName: '备注'
        }
      ]
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.getItems()
        }
      })
    },
    getItems() {
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getItems()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getItems()
    },
    showAudit() {
      this.checkNote = ''
      this.stateCheck = HalfIntakeOrderBasicState.Audit
      this.auditCheck = true
    },
    cancelAudit(v) {
      this.cancelName = v
      this.checkNote = ''
      this.cancelCheck = true
    },
    isAudit() {
      if (this.stateCheck === HalfIntakeOrderBasicState.Audit) {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDIT({
          IntakeId: this.detail.IntakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECT({
          IntakeId: this.detail.IntakeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('退回成功')
            this.auditCheck = false
            this.getData()
          }
        })
      }
    },
    isCancel() {
      if (this.cancelName === 'cancel') {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCEL({
          IntakeId: this.detail.IntakeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      } else {
        STOCKING_API_HALF_INTAKE_ORDER_BASIC_ABANDON({
          IntakeId: this.detail.IntakeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.cancelCheck = false
            this.getData()
          }
        })
      }
    },
    downLoadData(column) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSHALF({
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
  mounted() {
    this.parameters.IntakeId = parseInt(this.$route.query.id)
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

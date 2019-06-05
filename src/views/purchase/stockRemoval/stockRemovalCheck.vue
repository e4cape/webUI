<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">查看退货出库单({{StuffType.Types[detail.StuffType]}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img
                    src="@/assets/images/draft.png"
                    v-if="detail.State === StuffReturnOrderBasicState.Draft"
                  >
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.State === StuffReturnOrderBasicState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.State === StuffReturnOrderBasicState.Audit"
                  >
                  <img
                    src="@/assets/images/auditBack.png"
                    v-if="detail.State === StuffReturnOrderBasicState.Reject"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.State === StuffReturnOrderBasicState.Abandon || detail.State === StuffReturnOrderBasicState.Cancel"
                  >
                  <div>{{StuffReturnOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ReturnCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核</td>
                <td
                  v-if="detail.State === StuffReturnOrderBasicState.Audit || detail.State === StuffReturnOrderBasicState.Reject"
                >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">退货位置</td>
                <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">退货原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">应付款</td>
                <td>￥{{$root.toFloat(detail.Preprice)}}</td>
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
              金重：
              <b class="num">{{$root.toFloat(detail.Weight, 3) || '-'}}g</b>
            </span>
            <span class="detail-info-num-item">
              件数：
              <b class="num">{{detail.ItemQty || '-'}}</b>
            </span>
            <span class="detail-info-num-item">
              金额：
              <b class="num">￥{{$root.toFloat(detail.Price) || '-'}}</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10"
            element-loading-text="拼命加载中"
            v-if="detail.StuffType === StuffType.Gold"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
            </el-table-column>
            <el-table-column prop="Weight" label="金重(g)" min-width="70" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="Quantity" label="件数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.GoldPrice)}}</template>
            </el-table-column>
            <el-table-column
              prop="CraftFee1"
              label="工费①计价(元/克)"
              min-width="110"
              show-overflow-tooltip
            >
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.CraftFee1)}}</template>
            </el-table-column>
            <el-table-column
              prop="CraftFee2"
              label="工费②计件(元/件)"
              min-width="110"
              show-overflow-tooltip
            >
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.CraftFee2)}}</template>
            </el-table-column>
            <el-table-column prop="OtherFee" label="其他费用" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.OtherFee)}}</template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
            </el-table-column>
            <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-table
            :data="data"
            class="m-b-10"
            element-loading-text="拼命加载中"
            v-if="detail.StuffType === StuffType.Stone"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column
              prop="StoneClassTypeEv"
              label="石类"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="StonePackageNo"
              label="石号/包号"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="StoneWeightEv"
              label="石重范围(ct)"
              min-width="110"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="StoneColor" label="颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneColor.Types[scope.row.StoneColor]}}</template>
            </el-table-column>
            <el-table-column prop="StoneClarity" label="净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.StoneClarity]}}</template>
            </el-table-column>
            <el-table-column prop="StoneCut" label="切工" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneCut.Types[scope.row.StoneCut]}}</template>
            </el-table-column>
            <el-table-column prop="StoneSpec" label="规格" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(ct)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}ct</template>
            </el-table-column>
            <el-table-column prop="StonePrice1" label="数单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.StonePrice1)}}</template>
            </el-table-column>
            <el-table-column prop="StonePrice2" label="重单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.StonePrice1)}}</template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
            </el-table-column>
          </el-table>
          <el-table
            :data="data"
            class="m-b-10"
            element-loading-text="拼命加载中"
            v-if="detail.StuffType === StuffType.Part"
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="PartTypeEv" label="配件名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="PartPrice1" label="数单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.PartPrice1)}}</template>
            </el-table-column>
            <el-table-column prop="PartPrice2" label="重单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.PartPrice2)}}</template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
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
        name="btnEdit"
        type="primary"
        @click="$router.push({path:'/purchase/stockRemoval/stockRemovalEdit',query:{id: detail.ReturnId}})"
        v-if="detail.State == StuffReturnOrderBasicState.Draft || detail.State == StuffReturnOrderBasicState.Reject"
      >编辑</el-button>
      <el-button
        name="btnAudit"
        @click="showAudit"
        v-if="detail.State === StuffReturnOrderBasicState.Wait"
      >审核</el-button>
      <el-button
        name="btnCancel"
        @click="cancelAudit('cancel')"
        v-if="detail.State === StuffReturnOrderBasicState.Audit"
      >取消审核</el-button>
      <el-button
        name="btnInvalid"
        @click="cancelAudit('invalid')"
        v-if="detail.State == StuffReturnOrderBasicState.Draft || detail.State == StuffReturnOrderBasicState.Reject"
      >作废</el-button>
      <el-button name="exportDetails" @click="ExportVisible = true">导出货品详情</el-button>
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
          <span>{{detail.ReturnCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="StuffReturnOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="StuffReturnOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === StuffReturnOrderBasicState.Audit"
              placeholder="退回原因备注"
              @keyup.enter="isAudit"
              maxlength="200"
            ></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnIsAudit" type="primary" @click="isAudit">确定</el-button>
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
              <span>{{detail.ReturnCode}}</span>
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
  </el-row>
</template>

<script>
import {
  StuffReturnOrderBasicState,
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking'
import {
  STOCKING_API_STUFF_RETURN_ORDER_BASIC_GET,
  STOCKING_API_STUFF_RETURN_ORDER_ITEM_GETS,
  STOCKING_API_STUFF_RETURN_ORDER_BASIC_AUDIT,
  STOCKING_API_STUFF_RETURN_ORDER_BASIC_REJECT,
  STOCKING_API_STUFF_RETURN_ORDER_BASIC_ABANDON,
  STOCKING_API_STUFF_RETURN_ORDER_BASIC_CANCEL,
  STOCKING_API_STUFF_RETURN_ORDER_ITEM_EXPORTGETSSTUFF
} from '@/apis/stocking'
import { StuffType, YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      StuffReturnOrderBasicState,
      StuffType,
      StoneColor,
      StoneCut,
      StoneClarity,
      detail: {},
      data: [],
      parameters: {
        ReturnId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      checkNote: '',
      auditCheck: false,
      cancelCheck: false,
      cancelName: 'cancel',
      stateCheck: StuffReturnOrderBasicState.Audit, // 审核结果
      ExportVisible: false,
      ExportColumns: []
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STUFF_RETURN_ORDER_BASIC_GET({
        ReturnId: this.parameters.ReturnId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.getExportColumns()
        }
      })
    },
    getData() {
      STOCKING_API_STUFF_RETURN_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
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
    getExportColumns() {
      switch (this.detail.StuffType) {
        case StuffType.Gold:
          this.ExportColumns = [
            {
              FieldEnName: 'GoldTypeName',
              FieldCnName: '成色'
            },
            {
              FieldEnName: 'Weight',
              FieldCnName: '金重',
              Precision: 3
            },
            {
              FieldEnName: 'Quantity',
              FieldCnName: '件数'
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
              FieldEnName: 'Price',
              FieldCnName: '金额',
              Precision: 2
            },
            {
              FieldEnName: 'Note',
              FieldCnName: '备注'
            }
          ]
          break
        case StuffType.Stone:
          this.ExportColumns = [
            {
              FieldEnName: 'StoneClassTypeEv',
              FieldCnName: '石类'
            },
            {
              FieldEnName: 'StonePackageNo',
              FieldCnName: '石号/包号'
            },
            {
              FieldEnName: 'StoneWeightEv',
              FieldCnName: '石重范围'
            },
            {
              FieldEnName: 'StoneColorName',
              FieldCnName: '颜色'
            },
            {
              FieldEnName: 'StoneClarityName',
              FieldCnName: '净度'
            },
            {
              FieldEnName: 'StoneCutName',
              FieldCnName: '切工'
            },
            {
              FieldEnName: 'StoneSpec',
              FieldCnName: '规格'
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
              FieldEnName: 'StonePrice1',
              FieldCnName: '数单价',
              Precision: 2
            },
            {
              FieldEnName: 'StonePrice2',
              FieldCnName: '重单价',
              Precision: 2
            },
            {
              FieldEnName: 'Price',
              FieldCnName: '金额',
              Precision: 2
            }
          ]
          break
        case StuffType.Part:
          this.ExportColumns = [
            {
              FieldEnName: 'PartTypeEv',
              FieldCnName: '配件名称'
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
              FieldEnName: 'PartPrice1',
              FieldCnName: '数单价',
              Precision: 2
            },
            {
              FieldEnName: 'PartPrice2',
              FieldCnName: '重单价',
              Precision: 2
            },
            {
              FieldEnName: 'Price',
              FieldCnName: '金额',
              Precision: 2
            }
          ]
          break
        default:
          break
      }
    },
    showAudit() {
      this.auditCheck = true
      this.checkNote = ''
      this.stateCheck = StuffReturnOrderBasicState.Audit
    },
    cancelAudit(v) {
      this.cancelName = v
      this.checkNote = ''
      this.cancelCheck = true
    },
    isAudit() {
      if (this.stateCheck === StuffReturnOrderBasicState.Audit) {
        STOCKING_API_STUFF_RETURN_ORDER_BASIC_AUDIT({
          ReturnId: this.detail.ReturnId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getDetail()
          }
        })
      } else {
        STOCKING_API_STUFF_RETURN_ORDER_BASIC_REJECT({
          ReturnId: this.detail.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('退回成功')
            this.auditCheck = false
            this.getDetail()
          }
        })
      }
    },
    isCancel() {
      if (this.cancelName === 'cancel') {
        STOCKING_API_STUFF_RETURN_ORDER_BASIC_CANCEL({
          ReturnId: this.detail.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getDetail()
          }
        })
      } else {
        STOCKING_API_STUFF_RETURN_ORDER_BASIC_ABANDON({
          ReturnId: this.detail.ReturnId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.cancelCheck = false
            this.getDetail()
          }
        })
      }
    },
    downLoadData(column) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_STUFF_RETURN_ORDER_ITEM_EXPORTGETSSTUFF({
        ReturnId: this.parameters.ReturnId,
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
    this.$store.dispatch('GET_GOLD_TYPE')
    this.parameters.ReturnId = parseInt(this.$route.query.id)
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

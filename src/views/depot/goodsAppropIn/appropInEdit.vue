<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">货品核对</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">发货：</td>
                <td>{{detail.SendTime | filterDateMinutes}}</td>
                <td class="tit">收货：</td>
                <td>
                  <template v-if=" detail.State === GoodsAllotOrderIntakeState.Audit">{{detail.ReceiveUser | addStr }}{{detail.IntakeTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">来源：</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">来源单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td>{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">发货人：</td>
                <td>{{detail.SendUser}}</td>
                <td class="tit">发货人电话：</td>
                <td>{{detail.SendPhone}}</td>
              </tr>
              <tr>
                <td class="tit">快递单号：</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">快递公司：</td>
                <td>{{ExpressType.Types[detail.ExpressType]}}</td>
                <template v-if="characterType === CharacterType.Store">
                  <td class="tit">业务日期：</td>
                  <td class="note">{{detail.ActualDate | filterDate}}</td>
                </template>
                <template v-else>
                  <td class="tit">入库仓库：</td>
                  <td>{{detail.WarehouseName2? `${detail.WarehouseName2} > ${detail.ShelfName2}` : detail.UnitedName2 }}</td>
                </template>
              </tr>
              <tr>
                <template v-if="characterType === CharacterType.Company">
                  <td class="tit">业务日期：</td>
                  <td class="note">{{detail.ActualDate | filterDate}}</td>
                </template>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note2}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <el-input class="code-input" placeholder="录入/扫描条码" v-model="code" @keyup.enter.native="codeEnter" :maxlength="50" name="code"></el-input>
              <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode" style="vertical-align:middle">批量录入</el-button>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                发货数量：
                <b class="num">{{detail.GoodsQty}}</b>
              </span>
              <span class="detail-info-num-item">
                核对数量：
                <b class="num">{{detail.CheckQty}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" highlight-current-row class="m-b-10">
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="120"></el-table-column>
            <!-- <el-table-column prop="" label="主石颜色" min-width="120"></el-table-column>
            <el-table-column prop="" label="主石净度" min-width="120"></el-table-column>-->
            <el-table-column prop="LabelPrice" label="标签价" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbaseFee" label="基础工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AattaFee" label="附加工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbrandFee" label="品牌费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="ApartFee" label="配件价格" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AllianFee" label="证盟费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Discount" label="结算折扣" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AservFee" label="服务费" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="UnitPrice" label="结算价" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="SumPrice" label="金额" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="Quantity" label="发货数量" min-width="120" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="CheckQty" label="核对数量" min-width="120" fixed="right">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.CheckQty"
                  @focus="selectCurrentRow(scope.row)"
                  @keyup.enter.native="updateQty(scope.row)"
                  @blur="updateQty(scope.row)"
                  @keyup.native="scope.row.CheckQty = $root.toFixed(scope.row.CheckQty, 0)"
                  :maxlength="8"
                  name="CheckQty"
                  :controls="false"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="goodsParam.PageIndex" :size="goodsParam.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="appropInCheck($event)" :loading="$store.getters.is_loading" name="btnAppropInCheck">{{enableSubmit?'结束核对':'保存'}}</el-button>
      <el-button @click="appropInCheckRefresh($event)" :loading="refreshLoading" name="btnAppropInCheckRefresh">重新核对</el-button>
      <el-button @click="$router.push('/depot/goodsappropin/index')">返回</el-button>
    </div>

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId" :kindType="detail.KindTypeEk"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 货品数量不一致 -->
    <el-dialog v-if="checkError" title="结束核对-数量不一致" :visible.sync="checkError">
      <el-table :data="errorData" v-loading="errorTbLoading">
        <el-table-column prop="BarCode" label="条码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity" label="发货数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CheckQty" label="核对数量" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination2 :pg="errorParam.PageIndex" :size="errorParam.PageSize" :total="errorTotal" @currentChange="pageChange2" @sizeChange="pageSizeChange2"></pagination2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectDialog = true" name="btnRejectAppropIn">退回</el-button>
        <el-button @click="checkError = false" name="btnClose">关闭</el-button>
      </span>
    </el-dialog>
    <!-- end 货品数量不一致-->

    <!-- @module Dialog·退回 -->
    <approp-in-reject :visible.sync="rejectDialog" :data="[detail]" @listenRejectDialog="$router.replace('/depot/goodsappropin/index')"></approp-in-reject>
    <!-- End Dialog·退回 -->
    <!-- 收货入库 -->
    <receive :visible.sync="appropInDialog" :data="detail" @appropInReceived="appropInReceived"></receive>
  </div>
</template>

<script>
import { ShippingType, ExpressType, CharacterType, YNStatus } from '@/enums/common.js'
import { GoodsAllotOrderIntakeState } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_REQ,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORCODE,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORID,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_FINISHGETS,
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_RETURNCHECK
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import appropInReject from './appropInReject'
import receive from './receive'

export default {
  data() {
    return {
      CharacterType,
      GoodsAllotOrderIntakeState,
      ShippingType,
      ExpressType,
      detail: {}, // 明细
      goodsData: [], // 货品数据
      goodsParam: {
        OutakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      code: '',
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      multiCodeVisible: false, // 批量录入条码弹窗
      checkError: false,
      errorData: [],
      rejectDialog: false, // 退回对话框
      enableSubmit: true,
      errorParam: {
        OutakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      errorTotal: 0,
      checkQty: 0,
      curRow: {},
      refreshLoading: false,
      appropInDialog: false,
      errorTbLoading: false
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        this.checkCodes(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    codeEnter() {
      if (!this.code) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.checkCodes([
        {
          BarCode: this.code,
          Quantity: 1
        }
      ])
    },
    checkCodes(items) {
      // 扫码核对
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORCODE({
        IntakeId: this.detail.IntakeId,
        Items: items
      }).then(res => {
        // this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.getGoods()
          this.getDetail()
          // this.getCheckQty()
          this.multiCodeVisible = false
        } else {
          this.$alert(res.data.Message, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.code = ''
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    selectCurrentRow(row) {
      this.enableSubmit = false
      this.curRow = row
    },
    updateQty(row) {
      if (this.enableSubmit) {
        return false
      }
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORID({
        GoodsItid: row.GoodsItid,
        IntakeId: this.detail.IntakeId,
        CheckQty: parseInt(row.CheckQty)
      }).then(res => {
        if (res.data.Code === 'ERROR') {
          this.$message.error(res.data.Message)
        } else {
          this.enableSubmit = true
          this.init()
        }
      })
    },
    appropInCheckRefresh($event) {
      $event.currentTarget.blur()
      this.$confirm(
        '重新核对，所有的核对数量将清空，确定要重新核对？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.refreshLoading = true
        STOCKING_API_GOODS_ALLOT_ORDER_GOODS_RETURNCHECK({
          IntakeId: this.detail.IntakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.goodsParam.PageIndex = 1

            this.init()
          }
          this.refreshLoading = false
        })
      })
    },
    appropInCheck($event) {
      if (this.enableSubmit) {
        $event.currentTarget.blur()
        this.$store.commit('SET_BTN_LOADING', true)
        this.errorParam.PageIndex = 1
        this.getErrorList()
      } else {
        this.updateQty(this.curRow)
      }
    },
    getErrorList() {
      this.errorTbLoading = true
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_FINISHGETS(this.errorParam).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.errorTbLoading = false
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Data.Rows) {
            this.errorData = res.data.Data.Rows
            this.errorTotal = res.data.Data.Count
            // eslint-disable-next-line
            if (this.checkError) return false
            this.checkError = true
          } else {
            this.$confirm('您本次核对的数量与发货数量完全一样', '提示', {
              confirmButtonText: '确定收货入库',
              cancelButtonText: '关闭',
              type: 'warning'
            }).then(() => {
              this.receiveAppropIn()
            })
          }
        }
      })
    },
    receiveAppropIn() {
      if (this.characterType === CharacterType.Company) {
        this.appropInDialog = true
      } else {
        this.appropInReceived()
      }
    },
    appropInReceived(form) {
      let param
      if (form) {
        param = { IntakeId: this.detail.IntakeId, ...form }
      } else {
        param = {
          IntakeId: this.detail.IntakeId
        }
      }
      this.$confirm(
        '您正在进行收货入库操作，入库后不可撤销！确定收货入库？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {

        STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE(param).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.appropInDialog = false
              this.$router.replace('/depot/goodsappropin/index')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          }
        )
      })
    },
    init() {
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getDetail().then(() => { this.getGoods() })
      }
    },
    dataError(msg) {
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      this.$store.commit('SET_FULL_LOADING', true)
      return STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_REQ({
        IntakeId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.detail = Object.assign({}, res.data.Data)
          this.goodsParam.OutakeId = this.detail.OutakeId
          this.errorParam.OutakeId = this.detail.OutakeId
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS(this.goodsParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    pageChange(val) {
      this.goodsParam.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodsParam.PageIndex = 1
      this.goodsParam.PageSize = val
      this.getGoods()
    },
    pageChange2(val) {
      this.PageIndex = val
      this.getErrorList()
    },
    pageSizeChange2(val) {
      this.errorParam.PageIndex = 1
      this.errorParam.PageSize = val
      this.getErrorList()
    },
    // formatter(row, column, val) {
    //   switch (column.property) {
    //     case 'MaterialType':
    //       return this.$store.getters.materialType.Types[val]
    //     case 'CategoryType':
    //       return this.$store.getters.categoryType.Types[val]
    //     case 'GoldType':
    //       return this.$store.getters.goldType.Types[val]
    //     case 'GoldWeight':
    //     case 'Stone1Weight':
    //     case 'Weight':
    //       return this.$root.toFloat(val, 3) + 'g'
    //     default:
    //       break
    //   }
    // },
    formatter(row, column, val) {
      switch (column.property) {
        case 'GoldWeight':
        case 'Weight':
          return this.$root.toFloat(val, 3) + 'g'
        case 'Stone1Weight':
          return this.$root.toFloat(val, 3) + 'ct'
        case 'Discount':
          return this.$root.toFloat(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  filters: {
    addStr(value) {
      return value ? value + ' - ' : ''
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    pagination2: pagination,
    MultiCodeEnter,
    goodDetail,
    appropInReject,
    receive
  }
}
</script>
<style lang="scss" scoped>
.code-input {
  margin-right: 10px;
  vertical-align: middle;
}
.el-input-number {
  width: 100%;
}
</style>

<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看调拨出库单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="7" class="tc">
                  <img src="@/assets/images/draft.png" v-if="detail.State === GoodsAllotOrderOutakeState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === GoodsAllotOrderOutakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === GoodsAllotOrderOutakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === GoodsAllotOrderOutakeState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === GoodsAllotOrderOutakeState.Abandon">
                  <div>{{GoodsAllotOrderOutakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === GoodsAllotOrderOutakeState.Audit || detail.State === GoodsAllotOrderOutakeState.Reject">{{detail.CheckUser + ' ' }}{{detail.CheckTime|filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <td>{{detail.UnitedName1==='总部'? `${detail.WarehouseName1} > ${detail.ShelfName1}` : detail.UnitedName1 }}</td>
                <!-- <td>{{detail.UnitedName1}}</td> -->
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">收货单位：</td>
                <!-- <td>{{detail.UnitedName2}}</td> -->
                <td>{{detail.WarehouseName2 && !isStore? `${detail.WarehouseName2} > ${detail.ShelfName2}` : detail.UnitedName2 }}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td>{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">门店分货单：</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">发货人：</td>
                <td>{{detail.SendUser}}</td>
              </tr>
              <tr>
                <td class="tit">发货人电话：</td>
                <td>{{detail.SendPhone}}</td>
                <td class="tit">收货人：</td>
                <td>{{detail.ReceiptUser}}</td>
                <td class="tit">收货人电话：</td>
                <td>{{detail.ReceiptPhone}}</td>
              </tr>
              <tr>
                <td class="tit">快递公司：</td>
                <td>{{ExpressType.Types[detail.ExpressType]}}</td>
                <td class="tit">快递单号：</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">业务日期：</td>
                <td class="note">{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                条码数量：
                <b class="num">{{total}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：
                <b class="num">{{detail.GoodsQty}}</b>
              </span>
              <span class="detail-info-num-item">
                结算金额：
                <b class="num">￥{{$root.toFloat(detail.Preprice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <div class="p-x-10">
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" :span-method="objectSpanMethod" class="m-b-10">
            <template v-if="detail.SourceType === GoodsAllotOrderOutakeSourceType.Split">
              <el-table-column label="款式" width="200">
                <template slot-scope="scope">
                  <div class="goods-style">
                    <el-popover trigger="hover" class="img-box">
                      <img :src="scope.row.ImageUrl.indexOf('http') > -1 ? scope.row.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')">
                      <img slot="reference" :src="scope.row.ImageUrl.indexOf('http') > -1 ? scope.row.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')">
                    </el-popover>
                    <!-- <img :src="item.ImageUrl ? " alt> -->
                    <div class="goods-info">
                      <p>{{scope.row.StyleCode}}</p>
                      <p>{{scope.row.StyleName}}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="SplitQty" label="分货数量"></el-table-column>
              <el-table-column prop="GoodsQty" label="调拨数量"></el-table-column>
            </template>
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="120"></el-table-column>
            <!-- <el-table-column prop="" label="主石颜色" min-width="120"></el-table-column>
            <el-table-column prop="" label="主石净度" min-width="120"></el-table-column> -->
            <el-table-column prop="LabelPrice" label="标签价" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbaseFee" label="基础工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AattaFee" label="附加工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbrandFee" label="品牌费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="ApartFee" label="配件价格" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AllianFee" label="证盟费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Discount" label="结算折扣" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AservFee" label="服务费" :formatter="formatter" min-wdith="120"></el-table-column>
            <el-table-column prop="UnitPrice" label="结算价" :formatter="formatter" min-wdith="120"></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="SumPrice" label="金额" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- <el-table :data="goodsData" v-loading="$store.getters.tb_loading" :span-method="objectSpanMethod">
          <template v-if="detail.SourceType === GoodsAllotOrderOutakeSourceType.Split">
            <el-table-column prop="TOTALCOUNT" label="款式"></el-table-column>
            <el-table-column prop="TOTALCOUNT" label="分货数量"></el-table-column>
            <el-table-column prop="TOTALCOUNT" label="调拨数量"></el-table-column>
          </template>
          <template v-for="(item,index) in customFields">
            <el-table-column :key="index" :label="item.FieldCnName" :prop="item.FieldEnName" show-overflow-tooltip min-width="150">
              <template slot-scope="scope">
                <el-button type="text" v-if="item.FieldCnName === '条码'" @click="showDetailDialog(scope.row.GoodsId)">{{scope.row[item.FieldEnName]}}</el-button>
                <span v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal">{{$root.toFloat(scope.row[item.FieldEnName], item.Precision)}}</span>
                <span v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfPercent">{{$root.toFloat(scope.row[item.FieldEnName] * 100, item.Precision)}}</span>
                <span v-else-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && enums[item.Enumerate]">{{enums[item.Enumerate].Types[scope.row[item.FieldEnName]]}}</span>
                <span v-else>{{scope.row[item.FieldEnName]}}</span>
              </template>
            </el-table-column>
          </template>

          </el-table>-->
          <!-- Pagination -->
          <pagination :pg="goodForm.PageIndex" :size="goodForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === GoodsAllotOrderOutakeState.Reject || detail.State === GoodsAllotOrderOutakeState.Draft">
        <router-link :to="{path:'/depot/goodsappropout/edit',query:{id: detail.OutakeId}}" name="btnEdit">
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button type="primary" @click="auditDialog = true" v-if="detail.State === GoodsAllotOrderOutakeState.Wait" name="btnAudit">审核</el-button>
      <el-button type="default" @click="printDialog = true">打印</el-button>
      <el-button @click="$router.back()" name="back">返回</el-button>
    </div>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId" :kindType="detail.KindTypeEk"></good-detail>
    <!-- end 货品详情-->

    <!-- @module Dialog·审核 -->
    <appropOut-audit :visible.sync="auditDialog" :data="[detail]" @listenAuditDialog="getDetail"></appropOut-audit>

    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <appropOut-abandon :visible.sync="abandonDialog" :data="detail" @listenAbandonDialog="getDetail"></appropOut-abandon>
    <!-- End Dialog·作废 -->
    <print-order :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: detail.OutakeId }))" :printingType="SettingPrintingType.StockingCloudGoodsAllotOrderOutake"></print-order>
  </div>
</template>

<script>
import { YNStatus, ShippingType, ExpressType, CharacterType } from '@/enums/common.js'
import { SettingPrintingType } from '@/enums/merchant.js'
import {
  GoodsAllotOrderOutakeState,
  GoodsAllotOrderOutakeSourceType,
  GoodsStockLogOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldType
} from '@/enums/stocking'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_STYLE_REQS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'
import appropOutAudit from './appropOutAudit'
import appropOutAbandon from './appropOutAbandon'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      SettingPrintingType,
      GoodsAllotOrderOutakeState,
      GoodsAllotOrderOutakeSourceType,
      SettingCustomizedFieldType,
      ShippingType,
      ExpressType,
      detail: {
      }, // 明细
      goodsData: [], // 货品数据
      goodForm: {
        OutakeId: '',
        // StyleItid: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      auditDialog: false,
      abandonDialog: false,
      customFields: [],
      printDialog: false,
    }
  },
  components: {
    pagination,
    goodDetail,
    appropOutAudit,
    appropOutAbandon,
    printOrder
  },
  computed: {
    isStore() {
      return CharacterType.Store === this.$store.getters.user_session.CharacterType
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    // 获取枚举
    getCustomFileds() {
      // 获取自定义列
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS({
        OrderType: GoodsStockLogOrderType.GoodsAllotOrderOutake,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        // KindTypeEk: this.detail.KindTypeEk
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.customFields = res.data.Data.Rows.filter(item => item.IsEnable === YNStatus.Yes)
        }
      })
    },
    formatter(row, column, val) {
      switch (column.property) {
        // case 'SplitQty':
        // case 'GoodsQty':
        //   return val ? val : ''
        case 'GoldWeight':
        case 'Weight':
          return val ? this.$root.toFloat(val, 3) + 'g' : ''
        case 'Stone1Weight':
          return val ? this.$root.toFloat(val, 3) + 'ct' : ''
        case 'Discount':
          return val ? this.$root.toFloat(val) : ''
        default:
          return val ? '￥' + this.$root.toFloat(val) :''
      }
    },
    rowspan() {
      // 每一行需要合并的行数
      let spanArr = []
      let position = 0
      this.goodsData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
        } else {
          if (item.StyleItid === this.goodsData[index - 1].StyleItid) {
            spanArr[position] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            position = index
          }
        }
      })
      return spanArr
    },
    objectSpanMethod({
      rowIndex, columnIndex
    }) {
      let spanArr = this.rowspan()
      if (this.detail.SourceType === GoodsAllotOrderOutakeSourceType.Split) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
          return {
            rowspan: spanArr[rowIndex],
            colspan: spanArr[rowIndex] ? 1 : 0
          }
        }
      }
    },
    init() {
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getDetail().then(() => {
          // this.getCustomFileds()
          this.getGoods()
        })
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
      return STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.$route.query.id
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      this.goodForm.OutakeId = this.detail.OutakeId
      let api = this.detail.SourceType === GoodsAllotOrderOutakeSourceType.Split ? STOCKING_API_GOODS_ALLOT_ORDER_STYLE_REQS : STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS
      api(this.goodForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    pageChange(val) {
      this.goodForm.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodForm.PageIndex = 1
      this.goodForm.PageSize = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.goods-style {
  display: flex;
  align-items: center;
  .img-box {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
    }
  }
  .goods-info {
    width: 1%;
    flex: 1;
    p {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>


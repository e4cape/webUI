<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看旧货转成品库（{{detail.KindTypeEv}}）</span>
        <!-- <span @click="$router.back(-1)" class="title text-btn fr">返回</span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === junkChangeOrderBasicStates.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === junkChangeOrderBasicStates.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === junkChangeOrderBasicStates.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === junkChangeOrderBasicStates.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === junkChangeOrderBasicStates.Abandon || detail.State === junkChangeOrderBasicStates.Cancel">
                  <div>{{junkChangeOrderBasicStates.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ChangeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === junkChangeOrderBasicStates.Audit || detail.State === junkChangeOrderBasicStates.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">旧货位置：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName1}} > {{detail.ShelfName1}}</td>
                <td v-else class="note">-</td>
                <td class="tit">成品位置：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName2}} > {{detail.ShelfName2}}</td>
                <td v-else class="note">-</td>
                <td class="tit">转换原因：</td>
                <td class="note" colspan="5">{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">旧货列表</span>
            </el-col>
          </el-row>
        </div>
        <div class="goods-wrapper">
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>旧货编号</th>
                  <th>旧货名称</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in goodsData" :key="item.index" :class="{active:item.ItemId === ItemId}" @click="rowSelect(item, index)">
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.StoreBarCode">{{item.JunkCode}}</td>
                  <td :title="item.GoodsName">{{item.JunkName}}</td>
                  <td>{{item.Quantity}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar" id="size-box">
                <el-select v-model="pageSize" placeholder="20" name="pageSize">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button class="prev-btn" @click="prevPage" :disabled="pageIndex === 1" :class="{'isDisabled': pageIndex === 1}"><i class="el-icon-arrow-left"></i></button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button class="next-btn" @click="nextPage" :disabled="pageIndex === pages" :class="{'isDisabled': pageIndex === pages}"><i class="el-icon-arrow-right"></i></button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.Quantity}}</span>
                <!-- <span class="fr">成本合计：<b>￥{{$root.toFloat(parseFloat(detail.RecallPrice) + parseFloat(detail.CraftFee))}}</b></span> -->
                <span class="fr">成本合计：<b>￥{{$root.toFloat(detail.CostPrice)}}</b></span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
              </div>
              <div class="panel-bd">
                <goods-details v-if="goodsData&&goodsData.length&&detail.KindTypeEk&&ItemId" :GoodsId="GoodsId" :KindTypeEk="detail.KindTypeEk" :ItemId="ItemId">
                  <slot>
                    <tr v-if="characterType == CharacterType.Store">
                      <td class="tit">使用原条码：</td>
                      <td>{{goodsData[goodIndex].JunkCode}}</td>
                    </tr>
                    <tr>
                      <td class="tit">加工费：</td>
                      <td>{{goodsData[goodIndex].CraftFee}}</td>
                      <td class="tit">加工类型：</td>
                      <td>{{junkChangeOrderItemCraftType.Types[goodsData[goodIndex].CraftType + '']}}</td>
                    </tr>
                  </slot>
                </goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <router-link v-if="detail.State == junkChangeOrderBasicStates.Reject || detail.State == junkChangeOrderBasicStates.Draft" :to="{path:'/depot/junkChange/edit',query:{id:changeId}}" name="btnJunkChangeEdit">
        <el-button type="primary">编辑</el-button>
      </router-link>
      <el-button v-if="detail.State == junkChangeOrderBasicStates.Wait" type="primary" @click="auditDialog=true" name="btnCheckJunkCancel">审核</el-button>
      <el-button v-if="detail.State == junkChangeOrderBasicStates.Audit" @click="cancelDialog=true" name="btnCancelJunkOut">取消审核</el-button>
      <el-button v-if="detail.State == junkChangeOrderBasicStates.Draft || detail.State == junkChangeOrderBasicStates.Reject" @click="abandonDialog=true" name="btnRemoveJunk">作废</el-button>
      <el-button @click="downloadData" style="width:120px;" v-if="goodsData&&goodsData.length&&goodsData.length>0" name="btnDownloadData">导出货品信息</el-button>
      <el-button @click="printJunkChange" name="btnDownloadData">打印</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: changeId}))" :printingType="settingPrintingType.StockingCloudJunkChangeOrderBasic"></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import {
  JunkChangeOrderBasicState,
  JunkChangeOrderItemCraftType
} from '@/enums/stocking.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GET,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_EXPORT
} from '@/apis/stocking.js'

import goodsDetails from '@/components/erp/goodsDetails'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'
import printOrder from '@/components/erp/printOrder'
export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      settingPrintingType: SettingPrintingType,
      junkChangeOrderBasicStates: JunkChangeOrderBasicState,
      junkChangeOrderItemCraftType: JunkChangeOrderItemCraftType,
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      changeId: '',
      detail: {
        ChangeId: '',
        SupplierId: '',
        ArrivalCode: '',
        Note: ''
      },
      GoodsId: '', // 选中的货品id
      ItemId: '',
      goodIndex: 0,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      printDialog: false
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? this.totalCount / this.pageSize
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    },
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.changeId = Number(query.id) || 0
      if (!this.changeId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
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
      // 获取基本信息
      STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GET({
        ChangeId: this.changeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      // 获取列表信息
      STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GETS({
        ChangeId: this.changeId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.GoodsId = this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId || 1
          this.ItemId = this.goodsData && this.goodsData.length && this.goodsData[0].ItemId || 1
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    printJunkChange(){
      this.printDialog = true
    },
    rowSelect(data, index) {
      this.GoodsId = data.GoodsId
      this.ItemId = data.ItemId
      this.goodIndex = index
    },
    prevPage() {
      this.pageIndex -= 1
    },
    nextPage() {
      this.pageIndex += 1
    },
    listenDialog(type, success) {
      // 监听所有弹窗关闭
      if (success) {
        this.getDetail()
      }
      this[type] = false
    },
    downloadData() {
      // if (!this.goodsData.length) {
      //   this.$message.error('请先添加货品！')
      // } else {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_JUNK_CHANGE_ORDER_ITEM_EXPORT({
        ChangeId: this.changeId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          console.log('this.$root.settings.DOMAIN_TEMP', this.$root.settings.DOMAIN_TEMP)
          window.open(
            this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
          )
        } else {
          this.$message.error(res.data.Message)
        }
      })
      // }
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.pageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    auditDialog,
    abandonDialog,
    cancelDialog,
    printOrder
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.import-purchase-dialog {
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}
#size-box{
  .el-select{
    top: -4px!important;
  }
}
</style>

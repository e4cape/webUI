<template>
  <el-row>
    <div class="panel-tag">
      <span>查看打印单</span>
      <el-button name="btnBack" @click="$router.back()" class="el-back" type="text">返回</el-button>
    </div>
    <div class="details-info-table">
      <table cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td class="tit">单号</td>
            <td>{{detail.PrintCode}}</td>
            <td class="tit">创建</td>
            <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
            <td class="tit">打印原因</td>
            <td>{{detail.ReasonTypeDv}}</td>
          </tr>
          <tr>
            <td class="tit">备注</td>
            <td class="note" colspan="5">{{detail.Note}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="checkPage-hd mt">
      <el-row>
        <el-col :span="12">
          <i class="icon-list"></i>
          <span class="title">货品列表</span>
        </el-col>
        <el-col :span="12" class="tr">
          <span class="detail-info-num-item">
            条码数量：
            <b class="num">{{detail.ItemQty}}</b>
          </span>
          <span class="detail-info-num-item">
            数量：
            <b class="num">{{detail.PrintQty}}</b>
          </span>
        </el-col>
      </el-row>
    </div>
    <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="JunkCode" label="条码" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span name="GoodsId" class="init-button-text" @click="checkGold(scope.row.GoodsId)">{{scope.row.BarCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Location" label="位置" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="材质" min-width="80">
        <template slot-scope="scope">{{materialType.Types[scope.row.MaterialType]}}</template>
      </el-table-column>
      <el-table-column prop="LabelPrice" label="标签价" min-wdith="120">
        <template slot-scope="scope">{{$root.toFloat(scope.row.LabelPrice)}}</template>
      </el-table-column>
      <el-table-column label="零售方式" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{retailType.Types[scope.row.RetailType]}}</template>
      </el-table-column>
      <el-table-column prop="RetailPrice" label="零售价/工费" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.RetailPrice)}}</template>
      </el-table-column>
      <el-table-column prop="FinanceQty" label="库存" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.FinanceQty}}</template>
      </el-table-column>
    </el-table>
    <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
    <el-row style="margin: 10px; text-align: left; border: 0;">
      <el-button name="btnPrinting" type="primary" @click="$router.push({path:'/purchase/batchLabel/printing',query:{id: printId}})">打印</el-button>
      <el-button name="btnMarkPrinted" @click="markPrinted" v-if="detail.State == orderBasicState.Printing">标记已打印</el-button> <!-- v-if="detail.State == orderBasicState.Printing"-->
    </el-row>
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
  </el-row>
</template>

<script>
import {
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDIT
} from '@/apis/stocking.js'
import {
  GoodsPrintOrderBasicState,
  RetailType,
  MaterialType
} from '@/enums/stocking.js'
import pagination from '@/components/pagination.vue'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
import { YNStatus } from '@/enums/common.js'
export default {
  data() {
    return {
      printId: null,
      orderBasicState: GoodsPrintOrderBasicState,
      retailType: RetailType,
      materialType: MaterialType,
      detail: {},
      goodsData: [],
      total: 0,
      pg: 1,
      size: 20,
      goodDetailVisible: false,
      goodsId: null
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.printId = Number(query.id)
      if (!this.printId) {
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
      STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET({
        PrintId: this.printId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS({
        PrintId: this.printId,
        PageIndex: this.pg,
        PageSize: this.size,
        OrderBy: 0,
        IsAsced: YNStatus.No,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    checkGold(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
    markPrinted() {
      this.$confirm(
        '确定标记为已打印？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const para = {
          PrintId: this.detail.PrintId,
          CheckNote: ''
        }
        STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.init()
          }
        })
      }).catch(() => {})
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    dialogGoodDetail
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.panel-tag {
  position: relative;
  .el-back {
    position: absolute;
    right: 25px;
    z-index: 10;
  }
}
.order-list-text {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
</style>

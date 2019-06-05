<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑报损单</span>
        <span class="fr title">
          <el-button type="text" @click="editDialog = true">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ReportCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === GoodsCountReportBasicState.Audit || detail.State === GoodsCountReportBasicState.Reject">{{ detail.CheckUser + ' '}}{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">位置：</td>
                <td>{{detail.ObjectType === GoodsCountOrderBasicObjectType.Company ? `${detail.WarehouseName}>${detail.ShelfName}`:detail.DeskName}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="16">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-input class="code" v-model="code" placeholder="录入/扫描条码" :maxlength="50" @keyup.enter.native="codeEnter" name="code"></el-input>
                </el-col>
                <el-col :span="9" class="tl">
                  <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode">批量录入</el-button>
                  <el-button @click="dialogSelectGoodsVisible=true" name="btnSelectGoods">选择货品</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="tr">
              <span class="detail-info-num-item">
                条码数量：
                <b class="num">{{detail.ItemQty}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：
                <b class="num">{{detail.Quantity}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StoreStyleNumber" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Name" label="主石名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip fixed="right">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.Quantity"
                  @input="selectCurrentRow(scope.row)"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity)"
                  @keyup.enter.native="updateQty(scope.row)"
                  @change="updateQty(scope.row)"
                  :maxlength="8"
                  name="Quantity"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="delGood($event, scope.row)" name="btnDel">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" v-if="detail.SourceType === 1" name="orderSubmit">{{ enableSubmit ? '提交审核': '保存'}}</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </div>

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- 选择货品 -->
    <select-goods :visible.sync="dialogSelectGoodsVisible" :warehouseId="detail.WarehouseId" :shelfId="detail.ShelfId" :deskId="detail.DeskId" @listenAddGoods="listenAddGoods"></select-goods>
    <!-- End 选择货品 -->

    <!-- @module Dialog·修改报损单基本信息-->
    <update :visible.sync="editDialog" :data="editForm" @listenEditDialog="getDetail"></update>
    <!-- End Dialog·修改报损单基本信息 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  GoodsCountReportBasicState,
  GoodsCountOrderBasicObjectType,
  GoodsCountReportBasicReportType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET,
  STOCKING_API_GOODS_COUNT_REPORT_ITEM_GETS,
  STOCKING_API_GOODS_COUNT_REPORT_ITEM_CREATE,
  STOCKING_API_GOODS_COUNT_REPORT_ITEM_UPDATE,
  STOCKING_API_GOODS_COUNT_REPORT_ITEM_DELETE,
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_WAIT
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import selectGoods from '@/components/erp/selectGoods'
import multiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import update from './update'

export default {
  data() {
    return {
      GoodsCountReportBasicReportType,
      GoodsCountReportBasicState,
      GoodsCountOrderBasicObjectType,
      reportId: '',
      detail: {},
      editForm: {},
      data: [],
      pg: 1,
      size: 20,
      total: 0,
      code: '',
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      multiCodeVisible: false, // 批量录入条码弹窗
      dialogSelectGoodsVisible: false, // 选择货品对话框
      editDialog: false,
      enableSubmit: true, // 控制请求一个一个提交
      curRow: {}
    }
  },
  methods: {
    codeEnter() {
      if (!this.code) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.addGood([
        {
          BarCode: this.code,
          Quantity: 1
        }
      ])
    },
    listenAddGoods(data) {
      this.addGood(data)
    },
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        this.addGood(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    addGood(items) {
      if (items.length) {
        STOCKING_API_GOODS_COUNT_REPORT_ITEM_CREATE({
          ReportId: this.reportId,
          Items: items
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.getDetail()
            this.getGoods()
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
      }
    },
    selectCurrentRow(row) {
      this.enableSubmit = false
      this.curRow = row
    },
    updateQty(row) {
      console.log(row.Quantity)
      if (!/^\d+$/.test(row.Quantity) || row.Quantity === '0') {
        this.$message({
          message: '请输入正整数',
          type: 'warning'
        })
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_COUNT_REPORT_ITEM_UPDATE({
          ReportId: this.reportId,
          ItemId: row.ItemId,
          Quantity: parseInt(row.Quantity)
        }).then(res => {
          if (res.data.Code === 'ERROR') {
            this.$message.error(res.data.Message)
          } else {
            this.getDetail()
            this.getGoods()
            this.enableSubmit = true
          }
          setTimeout(() => {
            this.$store.commit('SET_BTN_LOADING', false)
          }, 100)
        })
      }
    },
    delGood($event, row) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_GOODS_COUNT_REPORT_ITEM_DELETE({
            ItemId: row.ItemId,
            ReportId: this.reportId
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              if (this.total - (this.pg - 1) * this.size <= 1) {
                this.pg = 1
              }
              this.getDetail()
              this.getGoods()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    orderSubmit() {
      if (!this.data.length) {
        this.$message({
          message: '请添加货品后再提交审核!',
          type: 'warning'
        })
      } else if (this.enableSubmit) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_COUNT_REPORT_BASIC_WAIT({
          ReportId: this.reportId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push(`/depot/${this.$route.path.split('/')[2]}/index`)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.updateQty(this.curRow)
      }
    },
    init() {
      this.reportId = parseInt(this.$route.query.id)
      if (!this.reportId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
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
      STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET({
        ReportId: this.reportId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({}, res.data.Data)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_REPORT_ITEM_GETS({
        ReportId: this.reportId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.enableSubmit = true
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
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
    formatter(row, column, val) {
      switch (column.property) {
        case 'MaterialType':
          return this.$store.getters.materialType.Types[val]
        case 'CategoryType':
          return this.$store.getters.categoryType.Types[val]
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        case 'Stone1Weight':
          return this.$root.toFloat(val, 3) + 'ct'
        default:
          return this.$root.toFloat(val, 3) + 'g'
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
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    selectGoods,
    multiCodeEnter,
    update,
    goodDetail
  }
}
</script>

<style lang="scss" scoped>
.code-input {
  width: 250px;
  margin-right: 10px;
  vertical-align: middle;
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
.details-table .tit {
  width: 100px;
}
.el-input-number {
  width: 100%;
}
</style>

<template>
  <el-row class="content" v-loading="detailLoading">
    <div class="panel">
      <div class="panel-hd">
       
        <el-tooltip effect="light" :content="detail.HalfClassDvs" :disabled="detail.HalfClassDvs && detail.HalfClassDvs.length <= 50">
          <span class="title">盘点（仓库：{{detail.WarehouseName}}，范围：{{detail.HalfClassDvs}}）</span>
        </el-tooltip>
      </div>
      <div class="panel-bd m-t-10">
        <div class="goods-wrapper">
          <div class="goods-left" v-loading="leftLoading">
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>盘点位置</th>
                  <th>应盘</th>
                  <th>实盘</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in orderDelfData" :key="index" :class="{active:item.DelfId === goodsForm.DelfId}" @click="orderDelfSelect(item)">
                  <td>{{item.ShelfName}}</td>
                  <td>{{item.Quantity1+'/'+$root.toFloat(item.Weight1, 3)}}g</td>
                  <td>{{item.Quantity2+'/'+$root.toFloat(item.Weight2, 3)}}g</td>
                </tr>
              </tbody>
            </table>
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select v-model="orderDelfParams.PageSize" name="PageIndex">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button class="prev-btn" @click="prevPage" :disabled="orderDelfParams.PageIndex === 1" :class="{'isDisabled': orderDelfParams.PageIndex === 1}">
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{orderDelfParams.PageIndex}}/{{pages}}</span>
                  <button class="next-btn" @click="nextPage" :disabled="orderDelfParams.PageIndex === pages" :class="{'isDisabled': orderDelfParams.PageIndex === pages}">
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{orderDelfTotal}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">
                  <b>盘点汇总</b>
                </span>
              </div>
              <div class="count-bar">
                <span class="fl">应盘：{{detail.Quantity1+'/'+$root.toFloat(detail.Weight1, 3)}}g</span>
                <span class="fr">实盘：{{detail.Quantity2+'/'+$root.toFloat(detail.Weight2,3)}}g</span>
              </div>
              <div class="count-bar">
                <span class="fl">盘亏：{{detail.Quantity3+'/'+$root.toFloat(detail.Weight3,3)}}g</span>
                <span class="fr">盘盈：{{detail.Quantity4+'/'+$root.toFloat(detail.Weight4,3)}}g</span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <div class="panel">
              <div class="panel-hd">
                <span class="title">{{delfDetail.ShelfName}}</span>
              </div>
              <div class="panel-bd">
                <el-row class="p-10">
                  <el-col :span="4" class="tl">
                    <el-button type="primary" @click="createVisible = true">快速录入</el-button>
                  </el-col>
                  <el-col :span="20" class="tr">
                    <div class="table-total-items">
                      <div class="table-total-item">
                        <div>{{delfDetail.Quantity1+'/'+$root.toFloat(delfDetail.Weight1,3)}}g</div>
                        <div>应盘</div>
                      </div>
                      <div class="table-total-item">
                        <div>{{delfDetail.Quantity2+'/'+$root.toFloat(delfDetail.Weight2,3)}}g</div>
                        <div>实盘</div>
                      </div>
                      <div class="table-total-item">
                        <div>{{delfDetail.Quantity3+'/'+$root.toFloat(delfDetail.Weight3,3)}}g</div>
                        <div>盘亏</div>
                      </div>
                      <div class="table-total-item">
                        <div>{{delfDetail.Quantity4+'/'+$root.toFloat(delfDetail.Weight4,3)}}g</div>
                        <div>盘盈</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- Data Table -->
                <div class="p-x-10">
                  <el-table
                    :data="goodsData"
                    v-loading="$store.getters.tb_loading"
                    @current-change="handleCurrentChange"
                    ref="halfTable"
                    element-loading-text="拼命加载中"
                    highlight-current-row
                    class="edit-table m-b-10"
                  >
                    <el-table-column prop="HalfName" label="半成品名称" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Weight1" label="应盘重量(g)" min-width="80" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.Quantity2"
                          @change="handleFocus(scope.row)"
                          @keyup.native="scope.row.Quantity2 = $root.toFixed(scope.row.Quantity2, 0)"
                          :maxlength="8"
                          name="Quantity2"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="Weight2" label="实盘重量(g)" min-width="80" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.Weight2" @change="handleFocus(scope.row)" @keyup.native="scope.row.Weight2 = $root.toFixed(scope.row.Weight2, 3)" :maxlength="10" name="Weight2"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- Pagination -->
                  <pagination :pg="goodsForm.PageIndex" :size="goodsForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="closeTaking" :loading="$store.getters.is_loading" name="btnCloseTaking">{{enableSubmit ? '结束盘点' : '保存'}}</el-button>
      <el-button type="primary" @click="takingReset($event)" name="takingReset">重新盘点</el-button>
      <el-button @click="$router.back()" name="btnPrint">返回</el-button>
    </div>
    <!-- dialog 结束盘点 -->
    <taking-close :visible.sync="takingCloseVisible" :countId="$route.query.id"></taking-close>
    <!-- End 结束盘点 -->

    <el-dialog :visible.sync="createVisible" title="快速录入" @open="getHalf" @close="$refs.createForm.resetFields()">
      <el-form :model="createForm" ref="createForm" :rules="rules" label-width="80px" class="fix-w">
        <el-form-item label="名称：" prop="HalfId">
          <el-select v-model="createForm.HalfId">
            <el-option v-for="(item, index) in halfData" :key="index" :label="item.HalfName" :value="item.HalfId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量：" prop="Quantity2">
          <el-input v-model="createForm.Quantity2" @keyup.native="createForm.Quantity2 = $root.toFixed(createForm.Quantity2, 0)" :maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="重量：" prop="Weight2">
          <el-input v-model="createForm.Weight2" @keyup.native="createForm.Weight2 = $root.toFixed(createForm.Weight2, 3)" :maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="itemCreate" :loading="createLoading">确定</el-button>
        <el-button @click="createVisible = false">返回</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  STOCKING_API_HALF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_HALF_COUNT_ORDER_DELF_GETS,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_GETS,
  STOCKING_API_HALF_COUNT_ORDER_BASIC_RETAKE,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_UPDATE,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_CREATE,
  STOCKING_API_HALF_STOCK_SHELF_REQS
} from '@/apis/stocking.js'
import { YNStatus } from '@/enums/common'
// import { integerValid, threeDecNumValid } from '@/rules/formValidate.js'
import pagination from '@/components/pagination.vue'
import takingClose from './takingClose'
export default {
  data() {
    return {
      detail: {},
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pages: 0,
      orderDelfTotal: 0,
      delfDetail: {},
      orderDelfData: [],
      orderDelfParams: {
        CountId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      goodsData: [],
      goodsForm: {
        CountId: '',
        DelfId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      takingCloseVisible: false, // 盘点报告弹窗
      halfData: [],
      createVisible: false,
      createForm: {
        CountId: '',
        DelfId: '',
        HalfId: '',
        Weight2: '',
        Quantity2: ''
      },
      rules: {
        HalfId: [{ required: true, message: '请选择半成品名称' }],
        // Quantity2: [
        //   { required: true, message: '请输入半成品数量' },
        //   // { validator: integerValid, trigger: 'blur' }
        // ],
        // Weight2: [
        //   { required: true, message: '请输入半成品重量' },
        //   // { validator: threeDecNumValid, trigger: 'blur' }
        // ]
      },
      enableSubmit: true,
      currentRow: {},
      detailLoading: false,
      leftLoading: false,
      createLoading: false
    }
  },
  methods: {
    init() {
      this.goodsForm.CountId = parseInt(this.$route.query.id)
      this.orderDelfParams.CountId = parseInt(this.$route.query.id)
      this.createForm.CountId = parseInt(this.$route.query.id)
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getDetail()
        this.getOrderDelfData().then(() => {
          this.orderDelfSelect(this.orderDelfData[0])
        })

      }
    },
    dataError(msg) {
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.$router.back()
        })
    },
    getDetail() { // 盘点单详情
      this.detailLoading = true
      return STOCKING_API_HALF_COUNT_ORDER_BASIC_GET({
        CountId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
        this.detailLoading = false
      })
    },
    getOrderDelfData() { // 货架列表
      this.leftLoading = true
      return STOCKING_API_HALF_COUNT_ORDER_DELF_GETS(this.orderDelfParams).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.orderDelfData = res.data.Data.Rows
            this.orderDelfTotal = res.data.Data.Count
            this.pages = Math.ceil(
              this.orderDelfTotal / this.orderDelfParams.PageSize
            )
          }
          this.leftLoading = false
        }
      )
    },
    prevPage() {
      this.orderDelfParams.PageIndex -= 1
    },
    nextPage() {
      this.orderDelfParams.PageIndex += 1
    },
    orderDelfSelect(item) { // 选择货架
      this.delfDetail = item
      this.createForm.DelfId = item.DelfId
      this.goodsForm.DelfId = item.DelfId
      this.goodsForm.PageIndex = 1
      this.getGoods()
    },
    getGoods() { // 货品明细
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_HALF_COUNT_ORDER_ITEM_GETS(this.goodsForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows) {
            this.goodsData = res.data.Data.Rows.map(item => {
              let newItem = { ...item }
              newItem.Weight1 = this.$root.toFloat(newItem.Weight1, 3)
              newItem.Weight2 = this.$root.toFloat(newItem.Weight2, 3)
              return newItem
            })
          } else {
            this.goodsData = []
          }
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    currentChange(val) {
      this.goodsForm.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      this.goodsForm.PageIndex = 1
      this.goodsForm.PageSize = val
      this.getGoods()
    },
    getHalf() {
      // 获取半成品
      STOCKING_API_HALF_STOCK_SHELF_REQS({ 
        WarehouseId: this.detail.WarehouseId,
        ShelfId: this.delfDetail.ShelfId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10000
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfData = res.data.Data.Rows || []
        }
      })
    },
    itemCreate() { // 快速录入
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (!(this.createForm.Quantity2 * 1) && !(this.createForm.Weight2 * 1)) {
            this.$message.warning('数量或者重量输入有误')
            return
          }
          this.createForm.Quantity2 = parseFloat(this.createForm.Quantity2)
          this.createForm.Weight2 = parseFloat(this.createForm.Weight2)
          this.createLoading = true
          let param = { ...this.createForm }
          param.Weight2 = this.$root.toInt(param.Weight2)
          STOCKING_API_HALF_COUNT_ORDER_ITEM_CREATE(param).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('提交成功')
                this.getDetail()
                this.getOrderDelfData().then(() => {
                  this.delfDetail = this.orderDelfData.find(item => item.DelfId === this.goodsForm.DelfId)
                  this.goodsForm.PageIndex = 1
                  this.getGoods()
                })
              }
              this.createVisible = false
              this.createLoading = false
            }
          )
        }
      })
    },
    handleFocus(row) {
      this.$refs.halfTable.setCurrentRow(row)
      this.currentRow = row
      this.enableSubmit = false
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row
      if (oldRow && !this.enableSubmit) {
        this.enableSubmit = true
        if (row === null) {
          return
        }
        // if (oldRow.Quantity2 <= 0 || oldRow.Quantity2 > oldRow.Quantity1) {
        //   return this.$message.error('数量输入有误')
        // }
        // if (oldRow.Weight2 < 0 || oldRow.Weight2 > oldRow.Weight1) {
        //   return this.$message.error('重量输入有误')
        // }
        this.$store.commit('SET_TB_LOADING', true)
        let param = { ...oldRow }
        param.Weight1 = this.$root.toInt(param.Weight1)
        param.Weight2 = this.$root.toInt(param.Weight2)
        param.Quantity2 = parseInt(param.Quantity2)
        return STOCKING_API_HALF_COUNT_ORDER_ITEM_UPDATE(param)
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功')
              this.enableSubmit = true
              this.getDetail()
              this.getOrderDelfData().then(() => {
                this.delfDetail = this.orderDelfData.find(item => item.DelfId === this.goodsForm.DelfId)
                this.getGoods()
              })
            } else {
              this.enableSubmit = false
            }
            this.$store.commit('SET_TB_LOADING', false)
          })
          .catch(() => {
            this.enableSubmit = false
          })
      }
    },
    closeTaking() {
      if (this.enableSubmit) {
        this.takingCloseVisible = true
      } else {
        this.handleCurrentChange(this.currentRow, this.currentRow)
      }
    },
    takingReset($event) {
      $event.currentTarget.blur()
      this.$confirm('重新盘点，所有的盘点数量将清空，确定要重新盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_HALF_COUNT_ORDER_BASIC_RETAKE({
          CountId: parseInt(this.$route.query.id)
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.orderDelfParams.PageIndex = 1
            this.init()
          }
        })
      }).catch()

    },
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    takingClose
  },
  watch: {
    'orderDelfParams.PageIndex'() {
      this.getOrderDelfData().then(() => {
        this.orderDelfSelect(this.orderDelfData[0])
      })
    },
    'orderDelfParams.PageSize'() {
      this.orderDelfParams.PageIndex = 1
      this.getOrderDelfData().then(() => {
        this.orderDelfSelect(this.orderDelfData[0])
      })
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.goods-wrapper {
  font-size: 12px;
  .goods-left {
    .goods-table {
      margin-bottom: 131px;
      tr {
        th,
        td {
          padding: 0 8px;
          width: auto;
          &:first-child {
            width: 30%;
          }
        }
      }
    }
    .toolsbar {
      height: 131px;
      .count-bar {
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: 0 none;
        }
        b {
          color: #333;
        }
      }
    }
  }
  .goods-right {
    width: 1%;
    .panel-bd {
      padding: 0 !important;
    }
  }
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
  white-space: nowrap;
}
.el-input-number {
  width: 100%;
}
.el-table tr.info-row > td,
.el-table tr.info-row {
  background-color: red !important;
}
.table-total-items {
  display: flex;
  justify-content: flex-end;
  .table-total-item {
    margin-left: 20px;
    text-align: center;
    div:first-child {
      padding-bottom: 5px;
      font-weight: bold;
    }
  }
}
</style>

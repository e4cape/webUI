<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看盘点单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0" v-loading="detailLoading">
            <tbody>
              <tr>
                <td rowspan="3" class="state-img">
                  <img src="@/assets/images/taking.png" v-if="detail.State === HalfCountOrderBasicState.Taking">
                  <img src="@/assets/images/audited.png" v-if="detail.State === HalfCountOrderBasicState.Finish">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === HalfCountOrderBasicState.Cancel">
                  <div>{{HalfCountOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.CountCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">结束：</td>

                <td>
                  <template v-if="detail.State !== HalfCountOrderBasicState.Taking">
                    {{detail.CheckUser}} {{detail.CheckTime | filterDateMinutes}}
                  </template>
                </td>
              </tr>
              <tr>
                <td class="tit">盘点位置：</td>
                <td class="note">{{detail.WarehouseName + ' > ' + detail.PositionNote}}</td>
                <td class="tit">盘点范围：</td>
                <td class="note">{{detail.HalfClassDvs}}</td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="goods-wrapper" v-loading="mainLoading">
          <div class="goods-left">
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
                <el-select v-model="orderDelfParams.PageSize" @change="getPages" name="PageIndex">
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
                <div class="p-10">
                  <el-row type="flex" class="table-total-items" justify="end">
                    <el-col class="table-total-item">
                      <div>{{delfDetail.Quantity1+'/'+$root.toFloat(delfDetail.Weight1,3)}}g</div>
                      <div>应盘</div>
                    </el-col>
                    <el-col class="table-total-item">
                      <div>{{delfDetail.Quantity2+'/'+$root.toFloat(delfDetail.Weight2,3)}}g</div>
                      <div>实盘</div>
                    </el-col>
                    <el-col class="table-total-item">
                      <div>{{delfDetail.Quantity3+'/'+$root.toFloat(delfDetail.Weight3,3)}}g</div>
                      <div>盘亏</div>
                    </el-col>
                    <el-col class="table-total-item">
                      <div>{{delfDetail.Quantity4+'/'+$root.toFloat(delfDetail.Weight4, 3)}}g</div>
                      <div>盘盈</div>
                    </el-col>
                  </el-row>
                </div>
                <div class="p-x-10">
                  <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
                    <el-table-column prop="HalfName" label="半成品名称" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Weight1" label="应盘重量(g)" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Weight2" label="实盘重量(g)" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                  </el-table>
                  <!-- Pagination -->
                  <div class="p-x-10">
                    <pagination :pg="goodsForm.PageIndex" :size="goodsForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-row class="buttons">
      <el-col>
        <template v-if="detail.State === HalfCountOrderBasicState.Taking">
          <router-link :to="{path:'/depot/semitaking/edit',query:{id:$route.query.id}}" name="btnTakingEdit">
            <el-button type="primary">继续盘点</el-button>
          </router-link>
          <el-button @click="takingCancel($event)" name="btnTakingCancel">取消盘点</el-button>
        </template>
        <el-button type="primary" @click="takingLogVisible = true" v-if="detail.State === HalfCountOrderBasicState.Finish" name="btnReport">盘点报告</el-button>
        <el-button @click="$router.back()" name="btnPrint">返回</el-button>
      </el-col>
      <!-- <el-col :span="13">
        <span class="red tr">
          注：“应盘数量”是创建盘点单时的账面库存数量，盘点的过程中出入库不改变该数量。
        </span>
      </el-col>-->
    </el-row>
    <!-- @module 盘点报告 -->
    <taking-log :visible.sync="takingLogVisible" :countId="$route.query.id"></taking-log>
    <!-- End 盘点报告 -->
  </div>
</template>

<script>
import { HalfCountOrderBasicState } from '@/enums/stocking.js'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_HALF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_HALF_COUNT_ORDER_DELF_GETS,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_GETS,
  STOCKING_API_HALF_COUNT_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import takingLog from './takingLog'

export default {
  data() {
    return {
      HalfCountOrderBasicState,
      takingId: '',
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
      takingLogVisible: false, // 盘点报告弹窗
      mainLoading: false,
      detailLoading: false
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {

        default:
          return this.$root.toFloat(val, 3)
      }
    },
    init() {
      this.goodsForm.CountId = parseInt(this.$route.query.id)
      this.orderDelfParams.CountId = parseInt(this.$route.query.id)
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getDetail()
        this.getOrderDelfData()
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
    getDetail() {
      this.detailLoading = true
      STOCKING_API_HALF_COUNT_ORDER_BASIC_GET({
        CountId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
        this.detailLoading = false
      })
    },
    getOrderDelfData() {
      this.mainLoading = true
      STOCKING_API_HALF_COUNT_ORDER_DELF_GETS(this.orderDelfParams).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.orderDelfData = res.data.Data.Rows
            this.orderDelfTotal = res.data.Data.Count
            this.pages = Math.ceil(
              this.orderDelfTotal / this.orderDelfParams.PageSize
            )
            this.mainLoading = false
            this.orderDelfSelect(this.orderDelfData[0])
          }
        }
      )
    },
    getPages() {
      this.orderDelfParams.PageIndex = 1
      this.getOrderDelfData()
    },
    prevPage() {
      // eslint-disable-next-line
      this.orderDelfParams.PageIndex--
      this.getOrderDelfData()
    },
    nextPage() {
      // eslint-disable-next-line
      this.orderDelfParams.PageIndex++
      this.getOrderDelfData()
    },
    orderDelfSelect(item) {
      this.delfDetail = item
      this.goodsForm.DelfId = item.DelfId
      this.goodsForm.PageIndex = 1
      this.getGoods()
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_HALF_COUNT_ORDER_ITEM_GETS(this.goodsForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows
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
    listenLogDialog() {
      this.takingLogVisible = false
    },
    takingCancel($event) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_HALF_COUNT_ORDER_BASIC_CANCEL({
            CountId: parseInt(this.$route.query.id)
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message(res.data.Message, 'success')
              this.$router.back()
            }
          })
        })
        .catch(() => { })
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    takingLog
  },
}
</script>
<style lang="sass">
@import '@/assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
.goods-wrapper {
  font-size: 12px;
  .goods-left {
    padding-bottom: 0;
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
      font-size: 12px !important;
      padding: 0 !important;
      i {
        color: #399fe5;
      }
      .title {
        font-weight: bold;
        color: #333;
      }
      .table-total-items {
        .table-total-item {
          text-align: center;
          div:first-child {
            padding-bottom: 5px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
</style>

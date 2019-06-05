<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看旧货打印单</span>
        <span class="title fr">
          <!-- <el-button type="text" @click="$router.back(-1)">返回</el-button> -->
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === JunkPrintOrderBasicState.Printing">
                  <img src="@/assets/images/audited.png" v-if="detail.State === JunkPrintOrderBasicState.Printed">
                  <div>{{JunkPrintOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.PrintCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
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

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">旧货列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                数量：<b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span name="checkGold" class="init-button-text" @click="checkGold({'type':scope.row.IsGold === YNStatus.Yes ? true : false , id: scope.row.JunkId})">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CategoryType" label="旧货类型" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes?'素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column prop="MaterialType" label="材质" min-width="120">
              <template slot-scope="scope">
                {{$store.getters.materialType.Types[scope.row.MaterialType]}}
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-wdith="120">
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight)}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="净金重(g)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收价" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- Pagination -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <router-link :to="{path:'/depot/junkPrint/printing',query:{id:printId}}">
        <el-button name="btnprinting">打印</el-button>
      </router-link>
      <el-button name="btncheckPrint" @click="checkPrint($event)" v-if="detail.State != JunkPrintOrderBasicState.Printed">标记已打印</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->
  </div>
</template>

<script>
import {
  JunkPrintOrderBasicState
} from '@/enums/stocking.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDIT
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goldCheck from '@/components/erp/goldCheck'
export default {
  data() {
    return {
      YNStatus,
      JunkPrintOrderBasicState: JunkPrintOrderBasicState,
      goodsData: [], // 货品数据
      size: 20, // 分页数据条数
      pg: 1, // 当前页面位置
      total: 0, // 总数据条数
      totalQty: 0, // 库存总数
      printId: '',
      detail: {
      },
      checkParams: {
        type: false,
        id: ''
      },
      checkDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.printId = Number(query.id)||0
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
      STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET({
        PrintId: this.printId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS({
        PrintId: this.printId,
        MaterialType: 0,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count||0
        } else {
          this.$message.error('数据请求失败')
          this.goodsData = []
        }
        this.$store.commit('SET_TB_LOADING', false)
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
    checkPrint($event) {
      $event.currentTarget.blur()
      this.$confirm('确定标记为已打印？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDIT({
          PrintId: this.printId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.getDetail()
          } else {
            this.$message({
              message: res.data.Message,
              type: 'error'
            })
          }
        })
      })
    },
    checkGold(obj) {
      // 查看素金
      this.checkParams = obj
      this.checkDialog = true
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
    },
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    goldCheck
  }
}
</script>

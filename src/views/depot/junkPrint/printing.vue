<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">打印</span>
        <span class="fr title">
          <el-button type="text" @click="$router.back(-1)">
            返回
          </el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="p-10">
          <p class="p-b-10">请选择材质并打印(一个单据中包含多种材质的货品，如果需要使用多种打印模板，请分别打印)：</p>
          <el-row>
            <el-col :span="16">
              <el-radio-group name="materialType" v-model="materialType">
                <el-radio-button :label="0">所有</el-radio-button>
                <template v-for="(item, index) in $store.getters.materialType.TypeArray">
                  <el-radio-button v-if="detail.MaterialTypes && detail.MaterialTypes.split(',').indexOf(String(item.Id)) > -1" :label="item.Id" :key="index">{{item.Value}}</el-radio-button>
                </template>
              </el-radio-group>
            </el-col>
            <el-col :span="8" class="tr">
              <span class="detail-info-num-item">
                条码数量：<b class="num">{{total}}</b>
              </span>
              <span class="detail-info-num-item" v-if="materialType == 0">
                库存：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item" v-if="materialType == 0">
                打印：<b class="num">{{detail.PrintQty}}</b>
              </span>
              <span class="detail-info-num-item">
                当前页打印：<b class="num">{{printQty}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="JunkId" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="JunkCode" label="旧货编码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="checkGold(scope.row)" name="btncheckGold">{{scope.row.JunkCode}}</el-button>
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
            <el-table-column prop="Weight" label="货重(g)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Weight.toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="净金重(g)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收价" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{scope.row.RecallGoldPrice.toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column prop="PrintQty" label="打印数量" min-width="90">
              <template slot-scope="scope">
                <el-input name="PrintQty" v-model="scope.row['PrintQty']" @keyup.native="scope.row['PrintQty'] = $root.toFixed(scope.row['PrintQty'],0)" @input="enableSubmit = false" @keyup.enter.native="updateQty(scope.row)" @blur="updateQty(scope.row)"></el-input>
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
      <el-button name="btnprintPrintOrdertrue" type="primary" @click="printPrintOrder(true)" :loading="$store.getters.is_loading">{{ enableSubmit ? '打印全部': '保存'}}</el-button>
      <el-button name="btnprintPrintOrderfalse" @click="printPrintOrder(false)" :loading="$store.getters.is_loading" v-if="enableSubmit">{{ enableSubmit ? '打印当前页': '保存'}}</el-button>
      <span>&nbsp;&nbsp;&nbsp;每次最多可以打印5000个标签，超出请打印当前页或修改打印数量。</span>
    </div>

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify(Object.assign({OrderId: printId, MaterialType: materialType}, printAll ? {} : {PageIndex: pg, PageSize: size})))" :printingType="settingPrintingType.StockingCloudJunkPrintOrderBasic"></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import {
  SettingDictionaryDictType 
} from '@/enums/stocking.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_UPDATE
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goldCheck from '@/components/erp/goldCheck'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      YNStatus,
      settingDictionaryDictType: SettingDictionaryDictType,
      settingPrintingType: SettingPrintingType,
      materialType: 0,
      goodsData: [], // 货品数据
      size: 20, // 分页数据条数
      pg: 1, // 当前页面位置
      total: 0, // 总数据条数
      printId: '',
      detail: {
      },
      checkParams: {
        type: false,
        id: ''
      },
      checkDialog: false,
      printDialog: false,
      printAll: true,
      enableSubmit: true
    }
  },
  computed: {
    printQty() {
      // 当前页打印数量
      let result = 0
      this.goodsData.forEach(g => {
        if (g.PrintQty) {
          result += parseInt(g.PrintQty)
        }
      })
      return result
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
        PrintId: this.printId,
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
        MaterialType: this.materialType,
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
    showDetailDialog(goodsId) {
      this.checkParams = {
        type: false,
        id: goodsId
      }
      this.checkDialog = true
    },
    updateQty(row) {
      if (!/^\d+$/.test(row.PrintQty) || row.PrintQty === '0') {
        this.$message({
          message: '请输入正整数',
          type: 'warning'
        })
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_JUNK_PRINT_ORDER_ITEM_UPDATE({
          ItemId: row.ItemId,
          PrintId: row.PrintId,
          PrintQty: Number(row.PrintQty)||0
        }).then(res => {
          if (res.data.Code === 'ERROR') {
            this.$message.error(res.data.Message)
            this.getGoods()
          } else {
            this.enableSubmit = true
            this.getDetail()
          }
          setTimeout(() => {
            this.$store.commit('SET_BTN_LOADING', false)
          }, 100)
        })
      }
    },
    printPrintOrder(flag) {
      if(
        this.goodsData.find(item => {
          return item.PrintQty == 0 || !item.PrintQty
        })
      ){
        this.$message.warning('请输入正整数')
        return
      }
      if (this.enableSubmit) {
        if (
          (flag && this.detail.PrintQty > 5000) ||
          (!flag && this.printQty > 5000)
        ) {
          this.$message.error(
            '打印总数量超过5000，请修改打印数量或' +
              (flag ? '打印当前页' : '修改每页显示的条数') +
              '。'
          )
          return false
        }
        if(this.goodsData.length === 0){
          this.$message.error('打印的数据不能为空')
          return
        }
        this.printAll = flag
        this.printDialog = true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    checkGold(data) {
      // 查看
      let obj = {
        id: data.JunkId,
        type: data.isGold == this.YNStatus.Yes ? true : false
      }
      this.checkParams = obj
      this.checkDialog = true
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    materialType() {
      this.pg = 1
      this.getGoods()
    }
  },
  components: {
    pagination,
    printOrder,
    goldCheck
  }
}
</script>
<style lang="scss" scoped>
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
</style>


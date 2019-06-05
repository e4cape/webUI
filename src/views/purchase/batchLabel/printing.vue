<template>
  <div class="content">
    <div class="panel">
      <div class="panel-tag">
        <span>打印</span>
        <el-button name="btnBack" @click="$router.back()" class="el-back" type="text">返回</el-button>
      </div>
      <div class="panel-bd">
        <!-- @module 数据表格 -->
        <div class="panel">
          <div>
            <div class="p-10">
              <el-row>
                  <el-form :model="queryForm" lable-width="100px" class="item-lh-26" :inline="true">
                    <div>
                      <el-form-item
                        prop="Location"
                        v-if="$store.getters.user_session.CharacterType === characterType.Company"
                      >
                        <el-tabs v-model="queryForm.Location" class="c-unset">
                          <template v-for="(item, index) in locationList">
                            <el-tab-pane :label="item.Value" :key="index" :name="item.Value"  v-if="detail.Locations && detail.Locations.split(',').indexOf(String(item.Value)) > -1">
                            </el-tab-pane>
                          </template>
                        </el-tabs>
                      </el-form-item>
                    </div>
                    <div>
                      <el-col :span="16">
                        <el-form-item prop="MaterialType">
                          <el-radio-group name="materialType" v-model="queryForm.MaterialType">
                            <el-radio-button :label="0">所有材质</el-radio-button>
                            <template v-for="(item, index) in materialType.TypeArray">
                              <el-radio-button  v-if="detail.MaterialTypes && detail.MaterialTypes.split(',').indexOf(String(item.KeyId)) > -1" :label="Number(item.KeyId)" :key="index">{{item.Value}}</el-radio-button>
                            </template>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </div>
                  </el-form>
                
                <el-col :span="8" class="tr">
                  <span class="detail-info-num-item">
                    条码数量：
                    <b class="num">{{countData.BarCodeQty || 0}}</b>
                  </span>
                  <span class="detail-info-num-item">
                    库存：
                    <b class="num">{{countData.FinanceQty || 0}}</b>
                  </span>
                  <span class="detail-info-num-item">
                    打印：
                    <b class="num">{{countData.PrintQty || 0}}</b>
                  </span>
                  <span class="detail-info-num-item">
                    当前打印：
                    <b class="num">{{printQuant || 0}}</b>
                  </span>
                </el-col>
              </el-row>
            </div>
            <el-table
              :data="goodsData"
              v-loading="$store.getters.tb_loading"
              element-loading-text="拼命加载中"
            >
              <el-table-column label="序号" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ ( queryForm.PageIndex - 1 ) * queryForm.PageSize + scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column label="条码" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button name="btnCheckGold" type="text" @click="checkGold(scope.row.GoodsId)">{{scope.row.BarCode}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="MaterialType" label="材质" min-width="80">
                <template slot-scope="scope">{{materialType.Types[scope.row.MaterialType]}}</template>
              </el-table-column>
              <el-table-column prop="LabelPrice" label="标签价" min-wdith="80">
                <template slot-scope="scope">
                  {{$root.toFloat(scope.row.LabelPrice)}}
                </template>
              </el-table-column>
              <el-table-column prop="GoldWeight" label="零售方式" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{retailType.Types[scope.row.RetailType]}}</template>
              </el-table-column>
              <el-table-column
                prop="RecallGoldPrice"
                label="零售价/工费"
                min-width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{$root.toFloat(scope.row.RetailPrice)}}</template>
              </el-table-column>
              <el-table-column prop="FinanceQty" label="库存" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="打印数量" min-width="90">
                <template slot-scope="scope">
                  <el-input
                    name="printQty"
                    v-model="scope.row['PrintQty']"
                    @keyup.enter.native="updateQty(scope.row)"
                    @blur="updateQty(scope.row)"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination
          :pg="queryForm.PageIndex"
          :size="queryForm.PageSize"
          :total="total"
          @currentChange="pageChange"
          @sizeChange="pageSizeChange"
        ></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button
        name="btnPrintPrintOrdertrue"
        type="primary"
        @click="printPrintOrder(true)"
        :loading="$store.getters.is_loading"
      >{{ enableSubmit ? '打印全部': '保存'}}</el-button>
      <el-button
        name="btnPrintPrintOrderfalse"
        @click="printPrintOrder(false)"
        :loading="$store.getters.is_loading"
        v-if="enableSubmit"
      >{{ enableSubmit ? '打印当前页': '保存'}}</el-button>
      <span>&nbsp;&nbsp;&nbsp;每次最多可以打印5000个标签，超出请打印当前页或修改打印数量。</span>
    </div>

    <!-- 查看素金 & 非素 -->
    <goldCheck
      v-if="checkDialog"
      :checkDialog="checkDialog"
      v-on:closeDialog="checkDialog = !checkDialog"
      :checkInfo="checkParams"
    ></goldCheck>
    <!-- end 查看素金 & 非素 -->

    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify(Object.assign({OrderId: queryForm.PrintId, MaterialType: queryForm.MaterialType}, printAll ? {} : {PageIndex: queryForm.PageIndex, PageSize: queryForm.PageSize, Location: $store.getters.user_session.CharacterType === characterType.Store ? this.$store.getters.user_session.CharacterName : this.queryForm.Location })))"
      :printingType="storeSettingPrintingTypes.StockingCloudGoodsLabel"
      @listenPrintDialog="printDialog = false"
    ></print-order>
    <!-- End Dialog·打印 -->
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
  </div>
</template>

<script>
import { SettingPrintingType } from '@/enums/merchant.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET,
  STOCKING_API_GOODS_PRINT_ORDER_ITEM_QIRESCOUNT
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST
} from '@/apis/merchant.js'
import { RetailType, MaterialType } from '@/enums/stocking.js'
import pagination from '@/components/pagination.vue'
import goldCheck from '@/components/erp/goldCheck'
import printOrder from '@/components/erp/printOrder'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
export default {
  data() {
    return {
      characterType: CharacterType,
      retailType: RetailType,
      materialType: MaterialType,
      YNStatus,
      storeSettingPrintingTypes: SettingPrintingType,
      queryForm: {
        PrintId: 0,
        MaterialType: 0,
        Location: '',
        PageIndex: 1, // 当前页面位置
        PageSize: 20 // 分页数据条数
      },
      goodsData: [], // 货品数据
      total: 0, // 总数据条数
      detail: {},
      checkParams: {
        type: false,
        id: ''
      },
      countData: {},
      checkDialog: false,
      printDialog: false,
      printAll: true,
      enableSubmit: true,
      activeName: 'first',
      locationList: [],
      goodDetailVisible: false,
      goodsId: null,
      printQuant: 0,
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
      this.queryForm.PrintId = Number(query.id)
      if (!this.queryForm.PrintId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getCount()
        this.getGoods()
        if (
          this.$store.getters.user_session.CharacterType ===
          CharacterType.Company
        ) {
          this.getWarehouseList()
        }
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
    getCount () {
      STOCKING_API_GOODS_PRINT_ORDER_ITEM_QIRESCOUNT({
        MaterialType: this.queryForm.MaterialType,
        PrintId: this.queryForm.PrintId,
        Location: this.$store.getters.user_session.CharacterType === CharacterType.Store ? this.$store.getters.user_session.CharacterName : this.queryForm.Location
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.countData = res.data.Data
        }
      })
    },
    getDetail() {
      STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET({
        PrintId: this.queryForm.PrintId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          let prin = 0
          this.goodsData = res.data.Data.Rows || []
          this.goodsData.map(item => {
            prin += item.PrintQty
          })
          this.printQuant = prin
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    pageChange(val) {
      this.queryForm.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
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
        STOCKING_API_GOODS_PRINT_ORDER_ITEM_UPDATE({
          ItemId: row.ItemId,
          PrintId: row.PrintId,
          Quantity: Number(row.PrintQty)
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getDetail()
            this.getCount()
            this.getGoods()
            setTimeout(() => {
              this.$store.commit('SET_BTN_LOADING', false)
            }, 100)
          }
        })
      }
    },
    printPrintOrder(flag) {
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
        this.printAll = flag
        this.printDialog = true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    changeTabs(val) {
      this.activeName = val
    },
    getStoreList() {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Rows.map(item => {
            this.locationList.push(item)
          })
        }
      })
    },
    getWarehouseList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.No }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.queryForm.Location = res.data.Data.Rows[0].Value
            res.data.Data.Rows.map(item => {
              this.locationList.push(item)
            })
            this.getStoreList()
          }
        }
      )
    },
    checkGold(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    },
  },
  created() {},
  mounted() {
    this.init()
  },
  watch: {
    'queryForm.MaterialType'() {
      this.queryForm.PageIndex = 1
      this.getGoods()
    },
    'queryForm.Location'() {
      this.queryForm.PageIndex = 1
      this.getGoods()
      this.getCount()
    }
  },
  components: {
    pagination,
    printOrder,
    goldCheck,
    dialogGoodDetail
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
.panel {
  border: none;
}
.panel-tag {
  position: relative;
  .el-back {
    position: absolute;
    right: 25px;
    z-index: 10;
  }
}
.el-form-item {
  margin-bottom: 0;
}
</style>


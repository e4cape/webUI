<template>
  <div class="content">
    <el-row>
      <el-row class="m-b-10">
        <el-col>
          <el-button type="primary" name="btnCreateDialog" @click="openDialog">生成配货计划</el-button>
          <el-button type="primary" name="btnReason" :disabled="!total" @click="downLoadGoods">导出</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <template>
            <el-radio-group
              v-model="queryForm.MaterialType"
              class="month-check"
              name="MaterialType"
            >
              <el-radio-button :label="0">所有</el-radio-button>
              <el-radio-button
                v-for="(item, index) in deskClassData"
                :key="index"
                :label="Number(item.Id)"
              >{{item.Value}}</el-radio-button>
            </el-radio-group>
          </template>
        </el-col>
        <el-col :span="21">
          <!-- Data Table -->
          <template>
            <el-table
              :data="data"
              v-loading="$store.getters.tb_loading"
              @sort-change="querySort"
              element-loading-text="拼命加载中"
            >
              <el-table-column label="图片" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="gift-info-cell">
                    <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl != ''">
                      <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl.replace('{0}', '150x150')" alt="" class="m-r-5">
                      <div class="fl item-img" slot="reference">
                        <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl.replace('{0}', '150x150')" alt="" class="m-r-5">
                      </div>
                    </el-popover>
                    <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="条码"
                prop="BarCode"
                min-width="90"
                show-overflow-tooltip
                sortable="custom"
              >
                <template slot-scope="scope">
                  <span class="btn-link el-button el-button--text" @click="openGoodDetail(scope.row.GoodsId)">{{scope.row.BarCode}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="StyleCode"
                label="款号"
                min-width="90"
                show-overflow-tooltip
                sortable="custom"
              ></el-table-column>
              <el-table-column prop="GoodsName" label="货品名称" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column label="货品类型" min-width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{goodsType.Types[scope.row.GoodsType]}}
                </template>
              </el-table-column>
              <el-table-column prop="Quantity" label="入库数量" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="FinanceQty"
                label="账面库存"
                min-width="150"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="采购价"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{$root.toFloat(scope.row.CostPrice)}}
                </template>
              </el-table-column>
              <el-table-column prop="PartnerName" label="供应商" min-width="150" show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="LastTime"
                label="入库日期"
                min-width="150"
                sortable="custom"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{scope.row.LastTime | filterDateTime}}</template>
              </el-table-column>
              <el-table-column
                prop="LastRetailTime"
                label="最近销售日期"
                min-width="150"
                sortable="custom"
                show-overflow-tooltip
              >
                <template slot-scope="scope">{{scope.row.LastRetailTime | filterDateTime}}</template>
              </el-table-column>
            </el-table>
            <!-- Pagination -->
            <pagination
              :pg="queryForm.PageIndex"
              :size="queryForm.PageSize"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
          </template>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog title="生成配货计划" :visible.sync="distriVisible" width="500px" @close="closeForm">
      <el-form :model="generateForm" ref="generateForm" :rules="rule">
        <div class="title">当前推荐货品的历史采购成本为：</div>
        <div class="cost">￥{{$root.toFloat(estimateAmount)}}</div>
        <el-form-item prop="Price" label="本次计划配货金额：">
          <div style="width:100%;">
            <el-input v-model="generateForm.Price" name="Amount" style="width: 100px;"></el-input>
            <span style="margin-left: 5px;">系统根据金额自动从配货建议中选择合适的货品</span>
          </div>
        </el-form-item>
        <el-form-item prop="PlanName" label="计划名称：（20字以内）" >
          <el-input v-model="generateForm.PlanName" name="Name" style="width:100%;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="Note" label="备注：">
          <el-input v-model="generateForm.Note" name="Note" type="textarea" style="width:100%;" maxlength="200" resize="none" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" name="btnAuditStockloss" @click="confirmForm('generateForm')">生成配货计划</el-button>
        <el-button name="btnCancel" @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- @module 导出货品详情 -->
    <export-goods-detail :visible.sync="goodsExportVisible" @submit="downLoadGoods" />
    <!-- End 导出货品详情 -->
    <!-- 查看货品详情 -->
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {  GoodsType, SettingEnumeratorEnumeratorType } from '@/enums/stocking.js'
import pagination from '@/components/pagination.vue'
import exportGoodsDetail from '@/components/erp/exportGoodsDetail'
import {
  STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETS,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETSTOTAL,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_CREATE,
  STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTREINFSUGGESTGETSRESULT,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST 
} from '@/apis/merchant.js'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
export default {
  data() {
    return {
      deskClassData: [],
      goodsType: GoodsType,
      data: [],
      parameters: {},
      queryForm: {
        MaterialType: 0,
        OrderBy: 3,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,  // 总数
      distriVisible: false, // 生成配货计划弹窗
      generateForm: {
        Price: null,
        PlanName: '',
        Note: '',
      },
      estimateAmount: 0,
      rule:  {
        Price: [
          { 
            required: true,
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入非负数字'))
              } else if (!/^(?!0(\.0{1,2})?$)(([1-9]\d{0,8})|0)(\.\d{1,2})?$/.test(value)) {
                callback(new Error('输入有误'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        PlanName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ],
      }, // 新建验证
      goodsExportVisible: false,
      goodsId: null,
      goodDetailVisible: false,
      ExportColumns: [
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码',
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号',
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称',
        },
        {
          FieldEnName: 'GoodsTypeName',
          FieldCnName: '货品类型',
        },
        {
          FieldEnName: 'Quantity',
          FieldCnName: '入库数量',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存',
        },
        {
          FieldEnName: 'CostPrice',
          FieldCnName: '采购价',
          Precision: 2
        },
        {
          FieldEnName: 'PartnerName',
          FieldCnName: '供应商'
        },
        {
          FieldEnName: 'LastTime',
          FieldCnName: '入库日期',
        },
        {
          FieldEnName: 'LastRetailTime',
          FieldCnName: '最近销售日期',
        },
      ],
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? {
            MaterialType: Number(this.$route.query.MaterialType),
            OrderBy: Number(this.$route.query.OrderBy),
            IsAsced: Number(this.$route.query.IsAsced),
            PageIndex: Number(this.$route.query.PageIndex),
            PageSize: Number(this.$route.query.PageSize)
          } : {
            MaterialType: 0,
            OrderBy: 3,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETS(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.data = res.data.Data.Rows || []
            this.total = res.data.Data.Count || 0
          }
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }
      )
    },
    getPrice() {
      STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETSTOTAL(this.queryForm).then(res => {
        if(res.data.Code === 'CORRECT') {
          this.estimateAmount = res.data.Data.Price
        }
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'BarCode':
          this.queryForm.OrderBy = 0
          break
        case 'StyleCode':
          this.queryForm.OrderBy = 1
          break
        case 'LastTime':
          this.queryForm.OrderBy = 2
          break
        case 'LastRetailTime':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 3
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    openDialog() {
      this.distriVisible = true
      this.getPrice()
    },
    confirmForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.generateForm,
            Price: this.$root.toInt(this.generateForm.Price)
          }
          STOCKING_API_GOODS_REINF_PLAN_BASIC_CREATE(para).then(res => {
            if(res.data.Code === 'CORRECT') {
              this.$message({
                message: '生成配货计划成功',
                type: 'success'
              })
              this.closeForm()
              setTimeout(() => {
                this.$router.push(`/purchase/distributionPlan/editDistributionPlan?id=${res.data.Data}`)
              }, 500)
            }
          })
        }
      })
    },
    closeForm() {
      this.estimateAmount = 0
      this.$refs['generateForm'].resetFields()
      this.distriVisible = false
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    downLoadGoods() {
      const para = {
        ...this.queryForm,
        ExportColumns: this.ExportColumns
      }
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTREINFSUGGESTGETSRESULT(para).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if(res.data.Code === 'CORRECT') {
          this.goodsExportVisible = false
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
        }
      })
    },
    openGoodDetail(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    },
    getMaterialType() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.MaterialType,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if(res.data.Code === 'CORRECT') {
          this.deskClassData = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.getMaterialType()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.MaterialType': 'onSearch'
  },
  components: {
    pagination,
    exportGoodsDetail,
    dialogGoodDetail
  }
}
</script>

<style lang="scss">
.month-check {
  width: 100%;
  .el-radio-button {
    width: 100%;
    .el-radio-button__inner {
      width: 100%;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      border-radius: 0 !important;
      box-shadow: none;
    }
    &:last-child {
      .el-radio-button__inner {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.title {
  margin-bottom: 15px;
}
.cost {
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 16px;
}
.el-form-item__label {
  width: 100%;
  text-align: left;
}
</style>

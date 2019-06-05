<template>
  <div class="content">
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">完善资料({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">来源</td>
                <td>{{GoodsQualityOrderBasicQualityType.Types[detail.QualityType]}}</td>
                <td class="tit">来源单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">完成时间</td>
                <td>{{detail.InfoTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <span class="order-list-text">
            <el-button type="primary" @click="importTmp('template')" name="btnImportant">按模板导入货品</el-button>
            <el-button type="primary" @click="importTmp('smart')" name="btnSmartImport">智能导入货品</el-button>
            <el-button name="btnExportGoods" @click="downLoadGoods">导出货品</el-button>
            <!-- <el-button name="btnImportImages" @click="importImagesDialog = true">导入图片</el-button> -->
          </span>
        </div>
        <div class="goods-wrapper">
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="index"
                  :class="{active:item.ItemId === goodsId}"
                  @click="rowSelect(item)"
                >
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.StoreBarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select
                  filterable
                  name="pageSize"
                  v-model="parameters.PageSize"
                  placeholder="20"
                >
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="parameters.PageIndex === 1"
                    :class="{'isDisabled': parameters.PageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{parameters.PageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="parameters.PageIndex === pages"
                    :class="{'isDisabled': parameters.PageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.ArriveQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
                <router-link
                  v-if="goodsId && goodsId != ''"
                  class="el-button btn-edit el-button--text el-button--mini"
                  :to="{path: '/purchase/finishedProduct/arrivalGoodEdit', query:{id: detail.PreviousId, QualityId: parameters.QualityId ,itemId: goodsId, apis: 'QUALITY', OrderType: detailOption.OrderType, KindTypeEk: detailOption.KindTypeEk}}"
                  name="btnEdit"
                >
                  <span>修改</span>
                </router-link>
              </div>
              <div class="panel-bd">
                <goods-details :itemId="goodsId" v-if="goodsId" :apis="apis" :option="detailOption"></goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
      <el-button type="primary" v-else @click="submit">完成并提交</el-button>
      <el-button @click="$router.back()" name="btnBack">返回</el-button>
    </div>
    <!-- @module 导入货品 -->
    <template-import
      :visible.sync="templateVisible"
      :option="detailOption"
      @submit="importSubmit"
      :root="$root.filePaths.STOCKING_PURCHASE + 'perfectInformation/'"
    ></template-import>
    <!-- End 导入货品 -->
    <!-- End 智能导入货品 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="detailOption"
      :root="$root.filePaths.STOCKING_PURCHASE + 'perfectInfomation/'"
      @submit="submits"
      :smartImportOrderType="SettingAiimportTempletOrderType.StockingCloudHalfChangeOrderBasic"
    ></smart-import>
    <!-- @module 智能导入货品 -->
    <el-dialog title="导入图片" :visible.sync="importImagesDialog" width="500px">
      <el-form :model="imageForm" ref="ruleForm" label-width="100px">
        <el-form-item label="货品序号：">
          <el-input-number
            v-model="imageForm.Num1"
            :controls="false"
            :precision="0"
            :min="1"
            :max="imageForm.num2"
          ></el-input-number>~
          <el-input-number
            v-model="imageForm.Num2"
            :controls="false"
            :precision="0"
            :min="imageForm.Num1"
            :max="imageForm.Num2"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="选择图片：" prop="desc">
          <uploadImgMulti
            ref="uploadMulti"
            :Root="$root.filePaths.STOCKING_PURCHASE"
            :limit="100"
            @uploadSucc="uploadSucc"
          >浏览...</uploadImgMulti>
        </el-form-item>
      </el-form>
      <el-alert title type="warning" :closable="false">
        <div slot>
          <ul>
            <li>1、图片按图片名称顺序对应货品序号依次导入。</li>
            <li>2、建议图片大小：宽1080像素，高1080像素。</li>
            <li>3、单张图片限制500K以内。</li>
            <li>4、限图片扩展名为jpg、png、gif。</li>
          </ul>
        </div>
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="importImagesDialog = false">确定</el-button>
        <el-button @click="importImagesDialog = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 导入图片 -->
    <import-error-table v-if="errorVisible" :visible.sync="errorVisible" :errorInfo="errorInfo"></import-error-table>
  </div>
</template>

<script>
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType,
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType,
  SettingAiimportTempletOrderType
} from '@/enums/stocking'
import { OperationType, YNStatus, EnableState } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORT,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_AIMPORT,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_TIMPORT
} from '@/apis/stocking'
import goodsDetails from '@/components/purchase/goodsDetails'
import pagination from '@/components/pagination'
import uploadImgMulti from '@/components/common/uploadImgMulti'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import goodsTable from '@/components/erp/goodsTable'
import importErrorTable from '@/components/erp/importErrorTable'

export default {
  data() {
    return {
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      SettingAiimportTempletOrderType,
      SettingCustomizedFieldSmallType,
      OperationType,
      apis: STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      detail: {
        CostPrice: 0
      },
      data: [],
      goodsId: '',
      importImagesDialog: false,
      templateVisible: false,
      smartVisible: false,
      selectedHalf: [],
      handleRow: {}, // 操作的数据
      selectedRule: true, // 选择验证
      currentRow: {},
      showType: 1, // 显示方式
      imageForm: {
        Num1: 1,
        Num2: 100,
        ImageUrl: []
      },
      selectRow: {},
      detailOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsQualityOrderBasic2,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 1,
        IsEnable: EnableState.Enable
      },
      isSaved: false,
      saveLoading: false,
      isRet: true,
      errorVisible: false
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.parameters.PageSize === 0
          ? this.totalCount / this.parameters.PageSize
          : parseInt(this.totalCount / this.parameters.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    uploadSucc(Keys) {
      this.imageForm.ImageUrl = Keys
    },
    init() {
      let query = this.$route.query
      this.parameters.QualityId = parseInt(query.id)
      if (!this.parameters.QualityId) {
        this.dataError()
      } else {
        this.getDetail()
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
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
          this.detailOption.KindTypeEk = this.detail.KindTypeEk
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.parameters.PageSize
          this.indexPageIndex = this.parameters.PageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    rowSelect(item) {
      this.goodsId = item.ItemId
      this.selectRow = item
    },
    prevPage() {
      this.pageIndex -= 1
    },
    nextPage() {
      this.pageIndex += 1
    },
    importTmp(val) {
      if (val === 'template') {
        this.templateVisible = true
      } else {
        this.smartVisible = true
      }
      this.detailOption.KindTypeEk = this.detail.KindTypeEk
    },
    handleSelectionChange(val) {
      this.selectedHalf = val
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getGoods()
    },
    changeSave(save) {
      this.isSaved = save.isSaved
      this.saveLoading = save.saveLoading
    },
    handleFocus(row) {
      this.$refs.goodsTable.setCurrentRow(row)
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row
      if (oldRow) {
        if (row === null) {
          return
        }
        if (oldRow.Weight === 0) {
          return this.$message.error('重量不能为0')
        }
        if (oldRow.Quantity === 0) {
          return this.$message.error('数量不能为0')
        }
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE(oldRow).then(res => {
          if (res.data.Code === 'CORRECT') {
            // this.getItems()
            if (oldRow.isNew) {
              oldRow.ItemId = res.data.Data
            }
            this.$message.success('保存成功')
          }
        })
      }
    },
    save() {
      let row = this.$refs.goodsTable.currentRow,
        tableData = this.$refs.goodsTable.tableData
      this.isRet = true
      tableData.some(item => {
        if (item.IsRequired == YNStatus.Yes && row[item.FieldEnName] === '') {
          this.isRet = false
          return this.$message.error(
            `${
              item.FieldType === SettingCustomizedFieldType.SelectOfEnums
                ? '请选择'
                : '请输入'
            }${item.FieldCnName}`
          )
        }
      })
      if (this.isRet) {
        let parameters = { ...row }
        tableData.forEach(item => {
          if (item.Precision > 0 && parameters[item.FieldEnName]) {
            parameters[item.FieldEnName] = this.$root.toInt(
              parameters[item.FieldEnName]
            )
          } else if (
            item.FieldType === SettingCustomizedFieldType.TextOfInteger
          ) {
            parameters[item.FieldEnName] = parseInt(
              parameters[item.FieldEnName]
            )
          }
        })
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE(parameters).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.isSaved = false
            this.$message.success('保存成功')
          }
        })
      }
    },
    submit() {
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
        QualityId: this.parameters.QualityId,
        InfoState: GoodsQualityOrderBasicStepState.Finish
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push('/purchase/perfectInformation/index')
        }
      })
    },
    // 导出数据
    downLoadGoods() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORT({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 500)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
      })
    },
    // 模版导入
    importSubmit(key) {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_TIMPORT({
        QualityId: this.parameters.QualityId,
        FilePath: key
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.templateVisible = false
          this.$message({
            message: '导入模版成功',
            type: 'success'
          })
          this.goodsId = 0
          this.getDetail()
        } else if (
          res.data.Code === 'ERROR' &&
          res.data.Data &&
          Array.isArray(JSON.parse(res.data.Data))
        ) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
      })
    },
    // 智能导入
    submits(key) {
      let fields = key.Fields.map(item => {
        let obj = item
        obj.SplitType = obj.SplitType === '' ? 0 : obj.SplitType
        return obj
      })
      const para = {
        QualityId: this.parameters.QualityId,
        Fields: fields,
        FilePath: key.FilePath
      }
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_AIMPORT(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.smartVisible = false
          this.$message({
            message: '导入货品成功',
            type: 'success'
          })
          this.getDetail()
        } else if (
          res.data.Code === 'ERROR' &&
          res.data.Data &&
          Array.isArray(JSON.parse(res.data.Data))
        ) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
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
      this.parameters.PageIndex = 1
      this.getGoods()
    }
  },
  components: {
    pagination,
    uploadImgMulti,
    goodsDetails,
    templateImport,
    smartImport,
    goodsTable,
    importErrorTable
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.checkPage-hd .check-group /deep/ .is-active i {
  color: #fff;
}
.el-table .el-input-number--mini {
  width: 100%;
}
.goods-wrapper .goods-left .goods-table tr > :first-child {
  padding-left: 2%;
}
.goods-wrapper .goods-right {
  overflow: auto;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
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
</style>

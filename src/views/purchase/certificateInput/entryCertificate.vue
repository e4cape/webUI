<template>
  <el-row>
    <div class="panel">
      <div class="panel-hd">
        <span class="title">录入证书({{detail.KindTypeEv}})</span>
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
                <td>{{detail.CertTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            ref="certTable"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
            @current-change="handleCurrentChange"
            highlight-current-row
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="BarCode" label="条码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="到货货重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column
              prop="Stone1Color"
              label="到货主石颜色"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneColor.Types[scope.row.Stone1Color]}}</template>
            </el-table-column>
            <el-table-column
              prop="Stone1Clarity"
              label="到货主石净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.Stone1Clarity]}}</template>
            </el-table-column>
            <el-table-column prop="Stone1Cut" label="到货主石切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{StoneCut.Types[scope.row.Stone1Cut]}}</template>
            </el-table-column>
            <el-table-column
              prop="Cert1Number"
              label="证书️①编号"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Number" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Name" label="证书①类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Name" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert1Organz"
              label="证书①鉴定机构"
              min-width="110"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Organz" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Weight" label="证书①重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="Cert1Weight"
                  v-model="scope.row.Cert1Weight"
                  @keyup.native="scope.row.Cert1Weight = $root.toFixed(scope.row.Cert1Weight, 3)"
                  @input="handleFocus(scope.row)"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Cert1Weight" :precision="3" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Color" label="证书①颜色" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert1Color"
                  name="Cert1Color"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneColor.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert1Clarity"
              label="证书①净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert1Clarity"
                  name="Cert1Clarity"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneClarity.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Cut" label="证书①切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert1Cut"
                  name="Cert1Cut"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneCut.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Shape" label="证书①形状" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Shape" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Fee" label="证书①费用" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="Cert1Fee"
                  v-model="scope.row.Cert1Fee"
                  @keyup.native="scope.row.Cert1Fee = $root.toFixed(scope.row.Cert1Fee, 2)"
                  @input="handleFocus(scope.row)"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Cert1Fee" :precision="2" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Wide" label="证书①台宽比" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Wide" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Depth" label="证书①亭深比" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert1Depth" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert1Image" label="证书①图片" min-width="80">
              <template slot-scope="scope">
                <uploadImg
                  :uploadImgLoading="uploadImgLoading"
                  :Root="$root.filePaths.STOCKING_PURCHASE"
                  :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + scope.row.Cert1Image"
                  :styleObj="styleObj"
                  @uploadSucc="(key) => {uploadSucc(key, scope.row, 'Cert1Image')}"
                ></uploadImg>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert2Number"
              label="证书️②编号"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Number" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Name" label="证书②类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Name" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert2Organz"
              label="证书②鉴定机构"
              min-width="110"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Organz" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Weight" label="证书②重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="Cert2Weight"
                  v-model="scope.row.Cert2Weight"
                  @keyup.native="scope.row.Cert2Weight = $root.toFixed(scope.row.Cert2Weight, 3)"
                  @input="handleFocus(scope.row)"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Cert2Weight" :precision="3" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Color" label="证书②颜色" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert2Color"
                  name="Cert1Color"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneColor.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="Cert2Clarity"
              label="证书②净度"
              min-width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert2Clarity"
                  name="Cert1Clarity"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneClarity.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Cut" label="证书②切工" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.Cert2Cut"
                  name="Cert1Cut"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option
                    v-for="item in StoneCut.TypeArray"
                    :key="item.KeyId"
                    :label="item.Value"
                    :value="item.KeyId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Shape" label="证书②形状" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Shape" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Fee" label="证书②费用" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="Cert2Fee"
                  v-model="scope.row.Cert2Fee"
                  @keyup.native="scope.row.Cert2Fee = $root.toFixed(scope.row.Cert2Fee, 2)"
                  @input="handleFocus(scope.row)"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.Cert2Fee" :precision="3" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Wide" label="证书②台宽比" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Wide" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Depth" label="证书②亭深比" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Cert2Depth" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Cert2Image" label="证书②图片" min-width="80">
              <template slot-scope="scope">
                <uploadImg
                  :uploadImgLoading="uploadImgLoading"
                  :Root="$root.filePaths.STOCKING_PURCHASE"
                  :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + scope.row.Cert2Image"
                  :styleObj="styleObj"
                  @uploadSucc="(key) => {uploadSucc(key, scope.row, 'Cert2Image')}"
                ></uploadImg>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="GoodsNote" label="检测后处理" min-width="80" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column  label="操作" min-width="120">
              <template slot-scope="scope">
                <el-button
                  name="btnMarkDuds"
                  type="text"
                  :key="scope.row.ItemId"
                  @click="isMarkDuds($event, scope.row, true)"
                  v-if="scope.row.State == GoodsQualityOrderBasicStepState.Wait">
                  标记次品
                </el-button>
                <el-button
                  name="btnOffMarkDuds"
                  type="text"
                  :key="scope.row.ItemId"
                  @click="isMarkDuds($event, scope.row, false)"
                  v-if="scope.row.State == GoodsQualityOrderBasicStepState.Finish">
                  取消标记次品
                </el-button>
              </template>
            </el-table-column>-->
          </el-table>
          <pagination
            :pg="parameters.PageIndex"
            :size="parameters.PageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
      <el-button name="btnSubmit" type="primary" v-else @click="orderSubmit($event)">完成并提交</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>

    <!-- @module 导入货品 -->
    <template-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/goodsIntake/'"
    ></template-import>
    <!-- End 导入货品 -->
    <!-- End 智能导入货品 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/goodsIntake/'"
    ></smart-import>
    <!-- @module 智能导入货品 -->
  </el-row>
</template>

<script>
import {
  StoneColor,
  StoneClarity,
  StoneCut,
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType,
  SettingCustomizedFieldSmallType,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldLargeType
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATECERT
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import uploadImg from '@/components/common/uploadImg.vue'

export default {
  data() {
    return {
      StoneColor,
      StoneClarity,
      StoneCut,
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      detail: {},
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      templateVisible: false,
      smartVisible: false,
      importOption: {
        OrderType:
          SettingAiimportTempletOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 1,
        IsEnable: YNStatus.Yes
      },
      uploadImgLoading: false,
      styleObj: {
        width: '100%',
        height: '50px',
        lineHeight: '50px',
        margin: '0 auto'
      },
      currentRow: {},
      isSaved: false,
      saveLoading: false
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
          this.importOption.KindTypeEk = this.detail.KindTypeEk
        }
      })
    },
    getData() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          this.data.forEach(item => {
            item.Cert1Weight =
              item.Cert1Weight === 0
                ? ''
                : this.$root.toFloat(item.Cert1Weight, 3)
            item.Cert1Fee =
              item.Cert1Fee === 0 ? '' : this.$root.toFloat(item.Cert1Fee)
            item.Cert2Weight =
              item.Cert2Weight === 0
                ? ''
                : this.$root.toFloat(item.Cert2Weight, 3)
            item.Cert2Fee =
              item.Cert2Fee === 0 ? '' : this.$root.toFloat(item.Cert2Fee)
          })
        }
      })
    },
    importTmp(val) {
      if (val === 'template') {
        this.templateVisible = true
      } else {
        this.smartVisible = true
      }
      this.importOption.KindTypeEk = this.detail.KindTypeEk
    },
    isMarkDuds($event, row, flag) {
      $event.currentTarget.blur()
      let str, certState
      if (flag) {
        str = ''
        certState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '取消'
        certState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否${str}标记次品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.detail.QualityId,
            CertState: certState
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getDetail()
              this.$message({
                type: 'success',
                message: `${str}标记成功!`
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消标记'
          })
        })
    },
    handleFocus(row) {
      this.$refs.certTable.setCurrentRow(row)
      this.isSaved = true
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    uploadSucc(Key, row, name) {
      // 图片上传成功
      this.isSaved = true
      this.$set(row, name, Key)
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row ? row : oldRow
      if (oldRow) {
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATECERT({
          ...oldRow,
          Cert1Weight: this.$root.toInt(oldRow.Cert1Weight),
          Cert1Fee: this.$root.toInt(oldRow.Cert1Fee),
          Cert2Weight: this.$root.toInt(oldRow.Cert2Weight),
          Cert2Fee: this.$root.toInt(oldRow.Cert2Fee)
        }).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('修改成功')
            this.getDetail()
          }
        })
      }
    },
    save() {
      if (JSON.stringify(this.currentRow) !== '{}') {
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATECERT({
          ...this.currentRow,
          Cert1Weight: this.$root.toInt(this.currentRow.Cert1Weight),
          Cert1Fee: this.$root.toInt(this.currentRow.Cert1Fee),
          Cert2Weight: this.$root.toInt(this.currentRow.Cert2Weight),
          Cert2Fee: this.$root.toInt(this.currentRow.Cert2Fee)
        }).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            this.getDetail()
            this.isSaved = false
          }
        })
      }
    },
    orderSubmit($event) {
      $event.currentTarget.blur()
      this.$confirm('是否录入证书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.parameters.QualityId,
            CertState: GoodsQualityOrderBasicStepState.Finish
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$router.push('/purchase/certificateInput/index')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
    }
  },
  created() {
    this.parameters.QualityId = parseInt(this.$route.query.id)
    this.getDetail()
  },
  mounted() {
    this.getData()
  },
  components: {
    pagination,
    templateImport,
    smartImport,
    uploadImg
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.el-table .el-input-number--mini {
  width: 100%;
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

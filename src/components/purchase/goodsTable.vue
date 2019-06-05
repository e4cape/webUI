<template>
  <div top="0px">
    <el-table
      :data="goodsData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      highlight-current-row
      :row-class-name="setEditRow"
      ref="goodsTable"
      class="edit-table"
      v-scrollshow="handelScrollshow"
      :row-style="setRowHeight"
      height="600"
    >
      <el-table-column label="操作" width="100" fixed v-if="tableData.length !== 0">
        <template slot-scope="scope" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
          <div class="handle-btn">
            <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
            <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow($event, scope)" style="color: #d74040" title="删除此行"></i>
            <i name="copyShow" class="icon-copy1 handel-icon" @click="copyShow(scope)" style="color: #7798af" title="复制此行"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableData"
        :key="index"
        :prop="item.FieldEnName"
        min-width="150"
        show-overflow-tooltip
      >
        <template slot="header">
          <p v-if="item.IsRequired == enums.YNStatus.Yes" :title="item.FieldCnName">
            <span style="color: red;">*</span>
            {{item.FieldCnName}}
          </p>
          <p v-else :title="item.FieldCnName">{{item.FieldCnName}}</p>
        </template>
        <template slot-scope="scope">
          <template v-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfTextual">
            <uploadImg
              v-if="item.FieldEnName.indexOf('Image') > -1"
              :uploadImgLoading="uploadImgLoading"
              :Root="$root.filePaths.STOCKING_PURCHASE"
              :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + scope.row[item.FieldEnName]"
              :styleObj="styleObj"
              @uploadSucc="(key) => {uploadSucc(key, scope.row, item.FieldEnName)}"
            ></uploadImg>
            <el-input v-model="scope.row[item.FieldEnName]" @change="handleFocus(scope.row)" v-else-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" :maxlength="50"></el-input>
          </template>
          <template
            v-else-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
          >
            <el-input
              v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              v-model="scope.row[item.FieldEnName]"
              :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
              @keyup.native="scope.row[item.FieldEnName] = $root.toFixed(scope.row[item.FieldEnName], item.Precision)"
              @change="handleFocus(scope.row)"
            ></el-input>
          </template>
          <template v-else-if="item.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums">
            <el-input
              v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              v-model="scope.row[item.FieldEnName]"
              :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
              @change="handleFocus(scope.row)"
            ></el-input>
            <!-- @keyup.native="scope.row[item.FieldEnName] = $root.toFixed(scope.row[item.FieldEnName], item.Precision)" -->
          </template>
          <template v-else>
            <el-select
              v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              :prop="scope.row[item.FieldEnName]"
              v-model="scope.row[item.FieldEnName]"
              :change="1"
              placeholder="请选择"
              @change="handleFocus(scope.row)"
              filterable
            >
              <template v-if="item.Enumerate && item.Enumerate != ''">
                <el-option
                  label="请选择"
                  :value="0"
                  v-if="item.IsRequired != enums.YNStatus.Yes"
                ></el-option>
                <template v-for="(item2, index2) in item.Enums">
                  <el-option
                    :label="item2.Title"
                    :value="item2.Value"
                    :key="index2"
                    v-if="item2.State === enums.EnableState.Enable || item2.State === 0"
                  ></el-option>
                </template>
              </template>
            </el-select>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px" :before-close="cancelClose">
      <el-form :model="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input name="rowsNum" v-model="addLineForm.rowsNum" @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <!-- <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :controls="false" :min="1" :max="50" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" :loading="addLoading" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px" :before-close="cancelClose">
      <el-form :model="copyLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input name="rowsNum" v-model="copyLineForm.rowsNum" @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <!-- <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :controls="false" :min="1" :max="10" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">复制到第 <el-input name="rowsNum" v-model="copyLineForm.current" @keyup.native="copyLineForm.current = $root.toFixed(addLineForm.current, 0)" style="width: 50px"></el-input> 行</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
  </div>
</template>

<script>
import { YNStatus, EnableState } from '@/enums/common.js'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldLargeType,
  SettingEnumeratorEnumeratorType,
  StonePolish,
  StoneSym,
  AppropType,
  WholesaleType,
  RetailType,
  StoneCut,
  StoneClarity,
  StoneColor,
  GiftType,
} from '@/enums/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
} from '@/apis/merchant'
import uploadImg from '@/components/common/uploadImg.vue'

export default {
  props: {
    goodsData: {
      // 列数据
      type: Array,
    },
    fieldData: {
      // 自定义列
      type: Array
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    api: {
      type: Object
    },
    option: {
      type: Object,
      default: () => {
        return {
          OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
          LargeType: SettingCustomizedFieldLargeType.Goods,
          SmallType: SettingCustomizedFieldSmallType.Basic,
          KindTypeEk: 0
        }
      }
    },
    param: {
      // 创建的额外参数，id等
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      enums: {
        EnableState,
        YNStatus,
        RetailType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        StoneSym,
        SettingCustomizedFieldType,
        SettingCustomizedFieldSmallType,
        PaymentType: {},
        KindType: {},
        GoldType: {},
        CategoryType: {},
        MaterialType: {},
        SeriesType: {},
        StoneClassType: {},
        LargeClassType: {},
        SmallClassType: {},
        FinanceClassType: {},
        ProcessType: {},
        PriceType: {},
        FeeType: {},
        AppropType,
        WholesaleType
      },
      tableData: [],
      FieldType: [], // 主石信息
      handleRow: {}, // 操作行
      addVisible: false, // 插入空白行弹窗
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false, // 删除当前行弹窗
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      isSaved: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
      uploadImgLoading: false,
      styleObj: {
        width: '50px',
        height: '50px',
        lineHeight: '50px',
        margin: '0'
      },
      addLoading: false,
    }
  },
  components: {
    uploadImg
  },
  methods: {
    // 设置选中样式
    setEditRow({ row }) {
      if (row.isEdit) {
        return 'edit-row'
      }
      if (row.isError) {
        return 'error-row'
      }
    },
    setRowHeight() {
      if (this.tableData.length !== 0) {
        if (this.tableData.filter(item => {
          if (item.FieldEnName.indexOf('Image') > -1) {
            return item
          }
        }).length === 0) {
          return {height: '37px'}
        }
      }
    },
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    handleFocus(row) {
      this.$refs.goodsTable.setCurrentRow(row)
      this.isSaved = true
      row.isEdit = true
      row.isError = false
    },
    // 图片上传成功
    uploadSucc(Key, row, name) {
      this.isSaved = true
      this.$emit('changeSave', {isSaved: this.isSaved, goodsData: this.goodsData})
      this.$set(row, name, Key)
    },
    getForm() {
      if (this.fieldData.length !== 0) {
        let obj = {}
        this.tableData = []
        this.fieldData.forEach(item => {
          if (item.IsEnable === this.enums.YNStatus.Yes) {
            this.tableData.push(item)
          }
        })
        this.tableData.forEach(item => {
          if (item.IsRequired === this.enums.YNStatus.Yes) {
            obj[item.FieldEnName] = ''
          }
        })
        if(this.goodsData.length === 0) {
          for (let i = this.goodsData.length; i < 10; i++) {
            this.goodsData.push({...obj, isEdit: false, isError: false})
          }
          // this.goodsData = goodsData
        } else {
          this.tableData.forEach(val => {
            this.goodsData.map(item => {
              if(val.Precision > 0) {
                if (item[val.FieldEnName] > 0) {
                  item[val.FieldEnName] = this.$root.toFloat(item[val.FieldEnName], val.Precision)
                } else if (item[val.FieldEnName] === 0){
                  item[val.FieldEnName] = ''
                }
              }
              this.$set(item, 'isEdit', false)
              this.$set(item, 'isError', false)
              return item
            })
          })
        }
      }
      this.$emit('changeSave', {isSaved: this.isSaved, goodsData: this.goodsData})
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (this.addLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      let local, obj = {isEdit: false, isError: false}
      local = this.addLineForm.local == 1 ? 1 : 0
      this.fieldData.forEach(item => {
        if (item.IsRequired === YNStatus.Yes) {
          obj[item.FieldEnName] = ''
        }
      })
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.goodsData.splice(this.handleRow.$index + local, 0, obj)
      }
      this.$emit('changeSave', {isSaved: this.isSaved, goodsData: this.goodsData})
      this.addVisible = false
    },
    deleteShow($event, scope) {
      $event.currentTarget.blur()
      this.$emit('delete', scope)
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
    },
    copySure() {
      // 确定复制
      if (this.copyLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      if (this.copyLineForm.local == 2 && this.copyLineForm.current > this.goodsData.length) {
        return this.$message.warning('正确输入行数')
      }
      let local
      if (this.copyLineForm.local == 1) {
        local = this.handleRow.$index + 1
      } else {
        local = this.copyLineForm.current - 1
      }
      for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
        let item = { ...this.handleRow.row }
        item.isEdit = this.handleRow.row.ItemId || this.handleRow.row.isEdit || this.handleRow.row.GoodsItid

        if (item.ItemId) {
          item.ItemId = ''
        } else if(item.GoodsItid) {
          item.GoodsItid = ''
        }
        if (item.isError) {
          item.isEdit = true
          item.isError = false
        }
        this.goodsData.splice(local, 0, item)
      }
      this.isSaved = true
      this.copyVisible = false
      this.$emit('changeSave', {isSaved: this.isSaved, goodsData: this.goodsData})
    },
    cancelClose() {
      this.copyVisible = false
      this.addVisible = false
      this.copyLineForm.local = this.addLineForm.local = '1'
      this.copyLineForm.rowsNum = this.copyLineForm.current = this.addLineForm.rowsNum = 1
    },
    getAllTypes() {
      let enumsList =  Object.values(SettingEnumeratorEnumeratorType)
      let enumsName =  Object.keys(SettingEnumeratorEnumeratorType)
      for (let i = 0; i < enumsList.length; i++) {
        // const element = array[index];
        if (typeof enumsList[i] !== 'object') {
          MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
            EnumeratorType: enumsList[i],
            IsEnable: YNStatus.Yes
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              const types = {}
              res.data.Data.Rows.forEach(item => {
                types[item.Id] = item.Value
              })
              this.enums[enumsName[i]] = {
                Types: types,
                TypeArray: res.data.Data.Rows
              }
            }
          })
        }
      }
    }
  },
  created() {},
  beforeMount() {},
  mounted() {
    this.getForm()
    // this.getAllTypes()
  },
  watch: {
    fieldData: 'getForm'
  }
}
</script>

<style lang="scss" scoped>
// .goodAdd-warpper {
.el-col-8 {
  overflow: hidden;
  height: 47px;
}
.panel-hd {
  .title {
    color: #777777;
    font-weight: bold;
    line-height: 32px;
  }
  height: 32px;
  line-height: 32px;
  padding-left: 5px;
  border-top: 1px solid #e5e5e5;
  background-color: #fff;
}
.panel-bd {
  padding-left: 10px;
}
// }
.stone-box {
  font-size: 24px;
  .stone-hd {
    height: 42px;
    line-height: 42px;
    i {
      color: #399fe5;
    }
    span {
      color: #777777;
    }
    .title {
      font-weight: bold;
      color: #333;
      margin-left: 10px;
      margin-right: 16px;
    }
  }
  .stone-bd {
    .el-table td,
    .el-table th {
      padding: 2px 0;
      border: none;
    }
  }
  .el-form-item {
    margin: 0;
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-form-item__error {
      position: relative;
    }
  }
}
.purchase-form {
  padding: 10px 10px;
  height: auto;
  border-bottom: 0;
}

.buttons {
  padding: 0 0 0 20px;
}

.el-select,
.el-input-number {
  width: 100%;
}
.good-uploader {
  text-align: center;
  img {
    display: block;
    width: 100%;
    margin-bottom: 15px;
  }
}
// .el-table {
//   border-left: none;
//   border-right: none;
//   overflow-x: auto;
//   table {
//      border-collapse: collapse;
//     .cell.normal{
//       font-weight: 600;
//     }
//     th {
//       width: 120px;
//     }
//     tr{
//       border-bottom: 1px solid #e5e5e5;
//     }
//     width: auto;
//     th:last-child {
//       border-right: 0;
//     }
//     // th:nth-last-child(2) {
//     //   border-right: 1px solid #e5e5e5;
//     // }
//   }
//   .cell {
//     white-space: nowrap;
//     &.normal {
//       font-weight: normal;
//     }
//   }
// }
</style>


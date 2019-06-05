<template>
  <div top="0px">
    <el-table
      :data="goodsData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      highlight-current-row
      @current-change="handleCurrentChange"
      ref="goodsTable"
      class="m-b-10 edit-table"
      :row-style="setRowHeight"
      v-if="isShow"
      v-scrollshow="handelScrollshow"
    >
      <el-table-column label="序号" type="index" width="50" v-if="tableData.length !== 0"></el-table-column>
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
          <template v-if="item.ExtenType === 0">
            <template
              v-if="item.Enums && scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
            >{{item.Enums.find(i => i.Value === scope.row[item.FieldEnName]) ? item.Enums.find(i => i.Value === scope.row[item.FieldEnName]).Title : ''}}</template>
            <template
              v-else-if="item.Precision > 0 && scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
            >{{scope.row[item.FieldEnName] > 0 ? scope.row[item.FieldEnName] : ''}}</template>
            <template v-else-if="item.FieldEnName.indexOf('Image') > -1">
              <img
                :src="$root.settings.DOMAIN_IMG_FILE + (scope.row[item.FieldEnName] || '/default/goods/150x150.jpg')"
                style="width: 50px;height: 50px;"
              >
            </template>
            <template
              v-else-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
            >{{scope.row[item.FieldEnName] || ''}}</template>
          </template>
          <template v-else>
            <template v-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfTextual">
              <uploadImg
                v-if="item.FieldEnName.indexOf('Image') > -1"
                :uploadImgLoading="uploadImgLoading"
                :Root="$root.filePaths.STOCKING_PURCHASE"
                :uploadImageUrl="$root.settings.DOMAIN_IMG_FILE + scope.row[item.FieldEnName]"
                :styleObj="styleObj"
                @uploadSucc="(key) => {uploadSucc(key, scope.row, item.FieldEnName)}"
                @focus="handelFocus(scope.row)"
              ></uploadImg>
              <el-input
                v-model="scope.row[item.FieldEnName]"
                v-else-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                :maxlength="50"
                @focus="handelFocus(scope.row)"
              ></el-input>
            </template>
            <template
              v-else-if="item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal || item.FieldType === enums.SettingCustomizedFieldType.TextOfPercent || item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger"
            >
              <el-input
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                v-model="scope.row[item.FieldEnName]"
                :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                @keyup.native="scope.row[item.FieldEnName] = $root.toFixed(scope.row[item.FieldEnName], item.Precision)"
                @focus="handelFocus(scope.row)"
              ></el-input>
            </template>
            <template v-else-if="item.FieldType !== enums.SettingCustomizedFieldType.SelectOfEnums">
              <el-input
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                v-model="scope.row[item.FieldEnName]"
                :maxlength="item.FieldType === enums.SettingCustomizedFieldType.TextOfInteger ? 8 : item.FieldType === enums.SettingCustomizedFieldType.TextOfDecimal ? 10 : 50"
                @focus="handelFocus(scope.row)"
              ></el-input>
              <!-- @keyup.native="scope.row[item.FieldEnName] = $root.toFixed(scope.row[item.FieldEnName], item.Precision)" -->
            </template>
            <template v-else>
              <el-select
                filterable
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                :prop="scope.row[item.FieldEnName]"
                v-model="scope.row[item.FieldEnName]"
                :change="1"
                placeholder="请选择"
                @change="handelFocus(scope.row)"
              >
                <template v-if="item.Enumerate && item.Enumerate != ''">
                  <el-option label="请选择" :value="0" v-if="item.IsRequired !== enums.YNStatus.Yes"></el-option>
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
        </template>
      </el-table-column>
    </el-table>
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
  GiftType
} from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant'
import uploadImg from '@/components/common/uploadImg.vue'

export default {
  props: {
    goodsData: {
      // 列数据
      type: Array
    },
    fieldData: {
      // 自定义列
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    },
    api: {
      type: Function
    },
    isShow: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      default: () => {
        return {
          OrderType:
            SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
          LargeType: SettingCustomizedFieldLargeType.Goods,
          SmallType: SettingCustomizedFieldSmallType.Basic,
          KindTypeEk: 1,
          IsEnable: EnableState.Enable
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
      detailData: [], // 基础信息
      arrData: [],
      FieldType: [], // 主石信息
      sideData: [[], [], [], []], // 副石信息
      selectRows: {},
      currentRow: {}, // 选中行
      saveLoading: false,
      isSaved: false,
      uploadImgLoading: false,
      styleObj: {
        width: '50px',
        height: '50px',
        lineHeight: '50px',
        margin: '0'
      },
      isRet: true,
      currentStartIndex: 0,
      currentEndIndex: 20
    }
  },
  components: {
    uploadImg
  },
  methods: {
    setRowHeight() {
      if (this.tableData.length !== 0) {
        if (
          this.tableData.filter(item => {
            if (item.FieldEnName.indexOf('Image') > -1) {
              return item
            }
          }).length === 0
        ) {
          return { height: '37px' }
        }
      }
    },
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    // 图片上传成功
    uploadSucc(Key, row, name) {
      this.$set(row, name, Key)
    },
    handelFocus(row) {
      this.$refs.goodsTable.setCurrentRow(row)
      this.isSaved = true
      this.$emit('changeSave', {
        isSaved: this.isSaved,
        saveLoading: this.saveLoading
      })
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row ? row : oldRow
      this.isRet = true
      this.$emit('changeSave', {
        isSaved: this.isSaved,
        saveLoading: this.saveLoading
      })
      if (oldRow) {
        if (row === null) {
          return
        }
        this.tableData.some(item => {
          if (
            item.IsRequired == this.enums.YNStatus.Yes &&
            oldRow[item.FieldEnName] === ''
          ) {
            this.isRet = false
            return this.$message.error(
              `${
                item.FieldType ===
                this.enums.SettingCustomizedFieldType.SelectOfEnums
                  ? '请选择'
                  : '请输入'
              }${item.FieldCnName}`
            )
          }
        })
        if (this.isRet) {
          let parameters = { ...oldRow }
          this.tableData.forEach(item => {
            if (item.Precision > 0) {
              parameters[item.FieldEnName] = this.$root.toInt(
                parameters[item.FieldEnName]
              )
            } else if (
              item.FieldType ===
              this.enums.SettingCustomizedFieldType.TextOfInteger
            ) {
              parameters[item.FieldEnName] =
                parseInt(parameters[item.FieldEnName]) || 0
            }
          })
          this.saveLoading = true
          this.$emit('changeSave', {
            isSaved: this.isSaved,
            saveLoading: this.saveLoading
          })
          this.api(Object.assign(parameters, this.param)).then(res => {
            this.saveLoading = false
            this.$emit('changeSave', {
              isSaved: this.isSaved,
              saveLoading: this.saveLoading
            })
            if (res.data.Code === 'CORRECT') {
              if (oldRow.isNew) {
                let itemId = oldRow.ItemId ? 'ItemId' : 'GoodsItid'
                this.$set(oldRow, itemId, res.data.Data)
                oldRow.isNew = false
              }
              this.$message.success('保存成功')
            }
          })
        }
      }
    },
    getForm() {
      if (this.fieldData.length !== 0) {
        let obj = {}
        this.tableData = [].concat(this.fieldData)
        this.tableData.forEach(item => {
          if (item.IsRequired === this.enums.YNStatus.Yes) {
            obj[item.FieldEnName] = ''
          }
        })
        this.tableData.forEach(val => {
          this.goodsData.forEach(item => {
            if (val.Precision > 0) {
              if (item[val.FieldEnName] == 0) {
                item[val.FieldEnName] = ''
              } else {
                item[val.FieldEnName] = this.$root.toFloat(
                  item[val.FieldEnName],
                  val.Precision
                )
              }
            }
          })
        })
      }
    },
    getAllTypes() {
      let enumsList = Object.values(SettingEnumeratorEnumeratorType)
      let enumsName = Object.keys(SettingEnumeratorEnumeratorType)
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


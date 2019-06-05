<template>
  <div top="0px" v-show="isShow">
    <el-table
      :data="goodsData"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      class="m-b-10"
    >
      <el-table-column label="序号" type="index" width="50" v-if="tableData.length !== 0"></el-table-column>
      <template v-for="(item, index) in tableData">
        <el-table-column
          :key="index"
          :prop="item.FieldEnName"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot="header">
            <p :title="item.FieldCnName">{{item.FieldCnName}}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="item.Enums && canView(item.IsPrivate)">
              {{item.Enums.find(i => i.Value === scope.row[item.FieldEnName]) ? item.Enums.find(i => i.Value === scope.row[item.FieldEnName]).Title : ''}}
            </template>
            <template v-else-if="item.Precision > 0 && canView(item.IsPrivate)">
              {{scope.row[item.FieldEnName] > 0 ? $root.toFloat(scope.row[item.FieldEnName], item.Precision) : ''}}
            </template>
            <template v-else-if="item.FieldEnName.indexOf('Image') > -1">
              <el-popover
                placement="right"
                trigger="hover">
                <img style="width: 100%;" :src="$root.settings.DOMAIN_IMG_FILE + (scope.row[item.FieldEnName] || '/default/goods/150x150.jpg')">
                <img :src="$root.settings.DOMAIN_IMG_FILE + (scope.row[item.FieldEnName] || '/default/goods/150x150.jpg')" style="width: 60px;height: 60px;" slot="reference">
              </el-popover>
            </template>
            <template v-else-if="canView(item.IsPrivate)">
              {{scope.row[item.FieldEnName]}}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { EnableState, YNStatus } from '@/enums/common.js'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldLargeType,
  SettingEnumeratorEnumeratorType,
  PriceType,
  StonePolish,
  StoneSym,
  GoldType,
  AppropType,
  WholesaleType,
  RetailType,
  MaterialType,
  StoneCut,
  CategoryType,
  StoneClarity,
  StoneColor,
  GiftType,
  FeeType,
  ProcessType,
} from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
} from '@/apis/merchant'

export default {
  props: {
    goodsData: {
      type: Array
    },
    total: {
      type: Number,
      default: 0
    },
    isShow: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      default: () => {
        return {
          OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
          LargeType: SettingCustomizedFieldLargeType.Goods,
          SmallType: SettingCustomizedFieldSmallType.Basic,
          KindTypeEk: 1,
          IsEnable: EnableState.Enable
        }
      }
    }
  },
  data() {
    return {
      enums: {
        EnableState,
        RetailType,
        ProcessType,
        PriceType,
        FeeType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        StoneSym,
        SettingCustomizedFieldType,
        SettingCustomizedFieldSmallType,
        // UploadFileType,
        GoldType,
        CategoryType,
        MaterialType,
        SeriesType: {
          Types: {}
        },
        StoneClassType: {
          Types: {}
        },
        LargeClassType: {
          Types: {}
        },
        SmallClassType: {
          Types: {}
        },
        FinanceClassType: {
          Types: {}
        },
        AppropType,
        WholesaleType
      },
      sideShow4: true,
      tableData: [],
      detailData: [], // 基础信息
      arrData: [],
      FieldType: [], // 主石信息
      sideData: [[], [], [], []], // 副石信息
      rules: {},
      selectRows: {},
    }
  },
  methods: {
    canView(IsPrivate) {
      return (
        IsPrivate == YNStatus.No ||
        (
          this.$store.getters.user_session.CanViewPrivateField == YNStatus.Yes)
      )
    },
    change() {
      this.getForm()
    },
    getForm() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.option).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
        }
      })
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
  created() {
    // this.getAllTypes()
  },
  beforeMount() {
  },
  mounted() {
    this.change()
  },
  watch: {
    goodsData: 'change',
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


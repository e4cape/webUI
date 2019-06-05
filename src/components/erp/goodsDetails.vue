<template>
  <div title="查看货品详情" top="0px" v-if="data&&data.length !== 0">
    <div class="panel goodAdd-warpper" v-if="isLoading">
      <div class="panel-bd">
        <el-form lable-width="120px" class="purchase-form" :inline="true">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-col :span="12">
                <el-form-item label="加工费" style="margin: 0;">
                  <template>{{$root.toFloat(this.detail.CraftFee)}}</template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="加工类型" style="margin: 0;">
                  <template>{{enums.JunkChangeOrderItemCraftType.Types[this.detail.CraftType]}}</template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-for="(item,index) in detailData" :key="index">
                <el-form-item :key="index" :label="item && item.FieldCnName + '：'" style="margin: 0;">
                  <template v-if="item.FieldEnName.indexOf('Image') > -1">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + (item.Value || '/default/goods/150x150.jpg')" style="width: 60px;height: 60px;">
                  </template>
                  <template v-else-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</template>
                  <template v-else-if="item.Precision > 0">{{item.Value > 0 ? $root.toFloat(item.Value, item.Precision) : ''}}</template>
                  <template v-else>{{item.Value || ''}}</template>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="4">
              <img style="width: 100%;" :src="$root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl || '/default/goods/150x150.jpg')">
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="FieldType[0]&&FieldType[0].length>0" class="stone-box">
      <div class="panel-hd">
        <div class="title">主石信息</div>
      </div>
      <div class="stone-bd">
        <div class="el-table tables el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
          <div class="el-table__body-wrapper" style="overflow-x: auto;">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" :style="FieldType[0].length < 12 ? 'width:100%;':''">
              <thead>
                <tr>
                  <th colspan="1" rowspan="1" :class="'el-table_1_column_'+ (0 + 1) + ' is-center is-leaf'">
                    <div class="cell normal">NO.</div>
                  </th>
                  <template v-for="(item, keys) in FieldType[0]">
                    <th colspan="1" rowspan="1" :key="keys" :class="'el-table_1_column_'+ (keys + 1) + ' is-center is-leaf'" v-if="canView(item.IsPrivate)">
                      <div class="cell normal">{{item.FieldCnName}}</div>
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr class="el-table__row" v-for="(item ,index) in FieldType" :key="index">
                  <td :class="'el-table_'+(index + 1 )+'_column_'+(index + 1)+' is-center'">
                    <div class="cell">{{index + 1}}</div>
                  </td>
                  <td v-for="(item1, keys) in item" :key="keys" :class="'el-table_'+(keys + 1 )+'_column_'+(keys + 1)+' is-center'">
                    <div
                      class="cell"
                    >{{item1.Enums ? (item1.Enums.find(i => i.Value === item1.Value) ? item1.Enums.find(i => i.Value === item1.Value).Title : '') : (!isNaN(item1.Value) ? (item1.Value > 0 ? (item1.Precision > 0 ? $root.toFloat(item1.Value, item1.Precision) : item1.Value) : '') : item1.Value)}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="sideData[0].length>0" class="stone-box">
      <div class="panel-hd">
        <div class="title">副石信息</div>
      </div>
      <div class="stone-bd">
        <div class="el-table tables el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
          <div class="el-table__body-wrapper" style="overflow-x: auto;">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" :style="sideData[0].length < 12 ? 'width:100%;':''">
              <thead>
                <tr>
                  <th colspan="1" rowspan="1" :class="'el-table_1_column_'+ (0 + 1) + ' is-center is-leaf'">
                    <div class="cell normal">序号</div>
                  </th>
                  <th colspan="1" rowspan="1" v-for="(item, keys) in sideData[0]" :key="keys" :class="'el-table_1_column_'+ (keys + 1) + ' is-center is-leaf'">
                    <div class="cell normal">{{item.FieldCnName}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="el-table__row" v-for="(item ,index) in sideData" :key="index">
                  <td :class="'el-table_'+(index + 1 )+'_column_'+(index + 1)+' is-center'">
                    <div class="cell">{{index + 1}}</div>
                  </td>
                  <td v-for="(item1, keys) in item" :key="keys" :class="'el-table_'+(keys + 1 )+'_column_'+(keys + 1)+' is-center'">
                    <div
                      class="cell"
                    >{{item1.Enums ? (item1.Enums.find(i => i.Value === item1.Value) ? item1.Enums.find(i => i.Value === item1.Value).Title : '') : (!isNaN(item1.Value) ? (item1.Value > 0 ? (item1.Precision > 0 ? $root.toFloat(item1.Value, item1.Precision) : item1.Value) : '') : item1.Value)}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
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
  JunkChangeOrderItemCraftType
} from '@/enums/stocking.js'
import {
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GET,
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant'

export default {
  props: {
    GoodsId: {
      type: String
    },
    ItemId: { type: Number },
    KindTypeEk: { type: Number }
  },
  data() {
    return {
      enums: {
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
        JunkChangeOrderItemCraftType,
        // UploadFileType,
        PaymentType: {
          Types: {}
        },
        KindType: {
          Types: {}
        },
        GoldType: {
          Types: {}
        },
        CategoryType: {
          Types: {}
        },
        MaterialType: {
          Types: {}
        },
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
        ProcessType: {
          Types: {}
        },
        PriceType: {
          Types: {}
        },
        FeeType: {
          Types: {}
        },
        AppropType,
        WholesaleType
      },
      // detailData: this.datas,
      data: [],
      detailData: [], // 基础信息
      FieldType: [[],[]], // 主石信息
      sideData: [[], [], [], []], // 副石信息
      isLoading: false,
      detail: {},
      IsOurs: ''
    }
  },
  methods: {
    canView(IsPrivate) {
      return (
        IsPrivate == YNStatus.No ||
        (IsPrivate == YNStatus.Yes &&
          this.$store.getters.user_session.CanViewPrivateField == YNStatus.Yes)
      )
    },
    change() {
      this.detailData = []
      this.FieldType = []
      this.sideData = [[], [], [], []]
      this.getForm()
    },
    getGJunkItemDetail() {
      STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GET({ ItemId: this.ItemId }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.detailData.map(item => {
            item.Value = res.data.Data[item.FieldEnName]
          })
          this.FieldType.map(item => {
            item.map(item1 => {
              item1.Value = res.data.Data[item1.FieldEnName]
            })
          })
          this.sideData.map(item => {
            item.map(item1 => {
              item1.Value = res.data.Data[item1.FieldEnName]
            })
          })
          this.isLoading = true
          console.log(this.FieldType)
        }
      })
    },
    getForm() {
      this.isLoading = false
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({
        OrderType: 13,
        LargeType: 3,
        KindTypeEk: this.KindTypeEk,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.detailData = []
          this.FieldType = [[], []]
          this.sideData = [[], [], [], [], []]
          this.data.forEach(item => {
            if (item.IsEnable === this.enums.YNStatus.Yes) {
              switch (item.SmallType) {
                case this.enums.SettingCustomizedFieldSmallType.Basic:
                  this.detailData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.MainStone: {
                  item.index = this.FieldType.length
                  let item1 = Object.assign({}, item)
                  // 添加表单
                  if (item1.FieldEnName.indexOf('1') == 5) {
                    item1.FieldCnName = item1.FieldCnName.substr(5)
                    this.FieldType[0].push(item1)
                  }

                  let item2 = Object.assign({}, item)
                  // 添加表单
                  if (item2.FieldEnName.indexOf('2') == 5) {
                    item2.FieldCnName = item2.FieldCnName.substr(5)
                    this.FieldType[1].push(item2)
                  }
                  break
                }
                case this.enums.SettingCustomizedFieldSmallType.SlaveStone: {
                  item.index = this.sideData.length
                  let item3 = Object.assign({}, item)
                  // 添加表单
                  if (item3.FieldEnName.indexOf('3') == 5) {
                    item3.FieldCnName = item3.FieldCnName.substr(5)
                    this.sideData[0].push(item3)
                  }

                  let item4 = Object.assign({}, item)
                  // 添加表单
                  if (item4.FieldEnName.indexOf('4') == 5) {
                    item4.FieldCnName = item4.FieldCnName.substr(5)
                    this.sideData[1].push(item4)
                  }

                  let item5 = Object.assign({}, item)
                  // 添加表单
                  if (item5.FieldEnName.indexOf('5') == 5) {
                    item5.FieldCnName = item5.FieldCnName.substr(5)
                    this.sideData[2].push(item5)
                  }

                  let item6 = Object.assign({}, item)
                  // 添加表单
                  if (item6.FieldEnName.indexOf('6') == 5) {
                    item6.FieldCnName = item6.FieldCnName.substr(5)
                    this.sideData[3].push(item6)
                  }

                  let item7 = Object.assign({}, item)
                  // 添加表单
                  if (item7.FieldEnName.indexOf('7') == 5) {
                    item7.FieldCnName = item7.FieldCnName.substr(5)
                    this.sideData[4].push(item7)
                  }
                  break
                }
                default:
                  break
              }
            }
          })
          this.getGJunkItemDetail()
        }
      })
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
  created() {
    // this.getAllTypes()
  },
  beforeMount() { },
  mounted() {
    this.change()
  },
  watch: {
    ItemId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.change()
      }
    },
    GoodsId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.change()
      }
    }
  }
}
</script>
<style lang="scss">
.tables {
  border-left: none;
  border-right: none;
  overflow-x: auto;
  table {
    border-collapse: collapse;
    width: auto;
    .normal {
      font-weight: 600;
      width: 110px;
    }
    tr {
      border-bottom: 1px solid #e5e5e5;
    }
    width: auto;
    th:last-child {
      border-right: 0;
    }
    // th:nth-last-child(2) {
    //   border-right: 1px solid #e5e5e5;
    // }
  }
  .tables .cell {
    white-space: nowrap;
    &.normal {
      font-weight: normal;
    }
  }
}
</style>

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
  .panel-hd {
    border-bottom: none !important;
  }
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
      font-size: 12px;
      text-align: left;
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
</style>


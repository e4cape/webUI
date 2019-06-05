<template>
  <el-dialog title="查看货品详情" width="600px" :visible.sync="visibles" @close="visibles = false">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 基本信息
        </div>
        <el-checkbox class="title" v-model="basicShow" name="btnBasicShow">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-if="!basicShow ||detail.ImageUrl != ''">
              <td class="tit">图片：</td>
              <td>
               <el-popover popper-class="big-img" placement="right" trigger="hover">
                  <img :src="detail.ImageUrl.indexOf('http') > -1 ? detail.ImageUrl : ($root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl ? detail.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg'))">
                  <div class="item-img" slot="reference">
                    <img :src="detail.ImageUrl.indexOf('http') > -1 ? detail.ImageUrl : ($root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl ? detail.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg'))">
                  </div>
                </el-popover>
              </td>
            </tr>
            <tr v-for="(item, index) in detailData" :key="index">
              <template v-if="canView(item.IsPrivate) && (!basicShow || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.FieldEnName.indexOf('Image') > -1">
                  <el-popover popper-class="big-img" placement="right" trigger="hover">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + (item.Value || '/default/goods/150x150.jpg')">
                    <div class="item-img" slot="reference">
                      <img :src="$root.settings.DOMAIN_IMG_FILE + (item.Value || '/default/goods/150x150.jpg')" style="width: 60px;height: 60px;">
                    </div>
                  </el-popover>
                </td>
                <td v-else-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 主石①信息
        </div>
        <el-checkbox class="title" v-model="stoneShow1" name="stoneShow">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in FieldType[0]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!stoneShow1 || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 主石①信息
        </div>
        <el-checkbox class="title" v-model="stoneShow2" name="stoneShow">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in FieldType[1]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!stoneShow2 || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 副石①信息
        </div>
        <el-checkbox class="title" v-model="sideShow1" name="sideShow1">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in sideData[0]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!sideShow1 || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 副石②信息
        </div>
        <el-checkbox class="title" v-model="sideShow2" name="sideShow2">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in sideData[1]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!sideShow2 || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 副石③信息
        </div>
        <el-checkbox class="title" v-model="sideShow3" name="sideShow3">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in sideData[2]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!sideShow3 || (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 副石④信息
        </div>
        <el-checkbox class="title" v-model="sideShow4" name="sideShow4">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in sideData[3]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!sideShow4 && (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 副石⑤信息
        </div>
        <el-checkbox class="title" v-model="sideShow4" name="sideShow5">不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in sideData[3]" :key="index">
              <template v-if="canView(item.IsPrivate) && (!sideShow4 && (item.Value != '' && item.Value != '0.00'))">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td v-if="item.Enums">{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer">
      <el-button name="btnClose" size="mini" @click="visibles = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  // PriceType,
  StonePolish,
  StoneSym,
  // GoldType,
  AppropType,
  WholesaleType,
  RetailType,
  // MaterialType,
  StoneCut,
  // CategoryType,
  StoneClarity,
  StoneColor,
  GiftType,
  // FeeType,
  // ProcessType,
  // GoodsType
} from '@/enums/stocking.js'
import {
  // STOCKING_API_MODIFY_GOODSSTONELIST,
  // STOCKING_API_MODIFY_GOODSBASICLIST,
  // STOCKING_API_SETTING_ATTRIBUTELIST,
  // STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_GOODS_BASIC_GET
} from '@/apis/stocking.js'

export default {
  props: {
    goodsId: String,
    modifyId: Number,
    visible: Boolean,
    option: {
      type: Object,
      default: () => {
        return {
          OrderType:
            SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
          LargeType: SettingCustomizedFieldLargeType.Goods,
          SmallType: 0,
          KindTypeEk: 1
        }
      }
    }
  },
  data() {
    return {
      visibles: false,
      YNStatus,
      SettingCustomizedFieldSmallType,
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
      basicShow: true,
      stoneShow1: true,
      stoneShow2: true,
      sideShow1: true,
      sideShow2: true,
      sideShow3: true,
      sideShow4: true,
      sideShow5: true,
      detail: {
        ImageUrl: '' 
      },
      detailData: [], // 基础信息
      FieldType: [[], []], // 主石信息
      sideData: [[], [], [], [], []], // 副石信息
    }
  },
  methods: {
    change() {
      this.detailData = []
      this.FieldType = []
      this.sideData = [[], [], [], [], []]
      this.getForm()
    },
    canView(IsPrivate) {
      return (
        IsPrivate == YNStatus.No ||
        (
          this.$store.getters.user_session.CanViewPrivateField == YNStatus.Yes)
      )
    },
    getGoodDetail() {
      STOCKING_API_GOODS_BASIC_GET({
        GoodsId: this.goodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.detailData.map(item => {
            item.Value = item.Precision > 0 ? this.$root.toFloat(res.data.Data[item.FieldEnName]) : res.data.Data[item.FieldEnName]
          })
          this.FieldType.map(item => {
            item.map(items => {
              items.Value = items.Precision > 0 ? this.$root.toFloat(res.data.Data[items.FieldEnName]) : res.data.Data[items.FieldEnName]
            })
          })
          this.sideData.map(item => {
            item.map(item1 => {
              item1.Value = item1.Precision > 0 ? this.$root.toFloat(res.data.Data[item1.FieldEnName]) : res.data.Data[item1.FieldEnName]
            })
          })
          this.visibles = this.visible
        }
      })
    },
    // getGoodStone() {
    //   STOCKING_API_MODIFY_GOODSBASICLIST({
    //     ModifyId: this.modifyId,
    //     GoodsId: this.goodsId
    //   }).then(res => {
    //     if (res.data.Code === 'CORRECT') {
    //       Object.assign(this.detail[0], res.data.Data[0])
    //       Object.assign(this.detail[1], res.data.Data[1])
    //       this.getForm()
    //     }
    //   })
    // },
    getForm() {
      this.isLoading = false
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({
        ...this.option,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.detailData = []
          this.FieldType = [[], []]
          this.sideData = [[], [], [], [], []]
          this.data.forEach(item => {
            if (item.IsEnable === YNStatus.Yes) {
              switch (item.SmallType) {
                case this.enums.SettingCustomizedFieldSmallType.Basic:
                  item.index = this.detailData.length
                  // 添加表单
                  // this.$set(this.form, item.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  this.detailData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.MainStone: {
                  item.index = this.FieldType.length
                  let item1 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item1.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item1.FieldEnName.indexOf('1') == 5) {
                    // item1.FieldCnName = item1.FieldCnName.substr(5)
                    this.FieldType[0].push(item1)
                  }

                  let item2 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item2.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item2.FieldEnName.indexOf('2') == 5) {
                    // item2.FieldCnName = item2.FieldCnName.substr(5)
                    this.FieldType[1].push(item2)
                  }
                  break
                }
                case this.enums.SettingCustomizedFieldSmallType.SlaveStone: {
                  item.index = this.sideData.length
                  let item3 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item3.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item3.FieldEnName.indexOf('3') == 5) {
                    // item3.FieldCnName = item3.FieldCnName.substr(5)
                    this.sideData[0].push(item3)
                  }

                  let item4 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item4.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item4.FieldEnName.indexOf('4') == 5) {
                    // item4.FieldCnName = item4.FieldCnName.substr(5)
                    this.sideData[1].push(item4)
                  }

                  let item5 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item5.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item5.FieldEnName.indexOf('5') == 5) {
                    // item5.FieldCnName = item5.FieldCnName.substr(5)
                    this.sideData[2].push(item5)
                  }

                  let item6 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item6.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item6.FieldEnName.indexOf('6') == 5) {
                    // item6.FieldCnName = item6.FieldCnName.substr(5)
                    this.sideData[3].push(item6)
                  }

                  let item7 = Object.assign({
                  }, item)
                  // 添加表单
                  // this.$set(this.form, item7.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item7.FieldEnName.indexOf('7') == 5) {
                    // item7.FieldCnName = item7.FieldCnName.substr(5)
                    this.sideData[4].push(item7)
                  }
                  break
                }
                default:
                  break
              }
            }
          })
          this.getGoodDetail()
        }
      })
    },
    getStoreAllType() {
      // this.$store.dispatch('GET_MATERIAL_TYPE')
      // this.$store.dispatch('GET_CATEGORY_TYPE')
      // this.$store.dispatch('GET_GOLD_TYPE')
      // this.$store.dispatch('GET_PAYMENT_TYPE')
      // this.$store.dispatch('GET_SERIES_TYPE')
    },
    getAllType() {
      // this.$set(this.enums, 'GoldType', this.$store.getters.goldType)
      // this.$set(this.enums, 'MaterialType', this.$store.getters.materialType)
      // this.$set(this.enums, 'CategoryTypes', this.$store.getters.categoryTypes)
      // this.$set(this.enums, 'SeriesType', this.$store.getters.seriesType)
      // this.$set(this.enums, 'PaymentType', this.$store.getters.paymentType)
    }
  },
  created() {
    // this.getStoreAllType()
  },
  beforeMount() {
    // this.getAllType()
  },
  mounted() {
    this.change()
  },
  watch: {
    goodsId: 'change',
    visibles(newVal) {
      if(!newVal) {
        this.$emit('visbleColse')
      }
    },
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.details-table {
  .tit {
    width: 200px;
  }
  td + td {
    text-align: center;
    height: 26px;
    color: #000 !important;
  }
  img {
    width: 60px !important;
    height: 60px;
  }
}
.el-checkbox {
  float: right;
  margin: 0;
}
.panel {
  margin-top: 0;
  margin-bottom: 20px;
  border: 0;
  .panel-hd {
    border: 1px solid #ddd !important;
    border-bottom: 0;
  }
  .panel-bd {
    padding: 0;
  }
}
.goods-wrapper .goods-right .panel {
  margin-bottom: 10px;
}
.vc-table {
  width: 100%;
  border: 1px solid#ddd;
  font-size: 12px;
  tr {
    border-bottom: 1px solid#ddd;
    th,
    td {
      border-right: 1px solid #ddd;
      padding: 8px 10px;
      line-height: 18px;
      max-width: 350px;
    }
    th {
      height: 32px;
      text-align: center;
      background: #f5f5f5;
      min-width: 100px;
      .asterisk {
        color: red;
      }
    }
    td {
      min-width: 150px;
      img {
        margin: auto;
        width: 200px;
      }
      p {
        text-align: center;
        margin-top: 5px;
      }
    }
  }
  .vc-table-tdsp {
    padding: 10px;
  }
}
</style>


<template>
  <div title="查看货品详情" top="0px" id="goodDetail">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 基本信息</div>
        <el-checkbox class="title" v-model="basicShow" name="btnBasicShow">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <tr v-if="!basicShow || detail[0].ImageUrl !== detail[1].ImageUrl">
              <td class="tit">图片：</td>
              <td>
                <img
                  :src="$root.settings.DOMAIN_IMG_FILE + ((detail[0].ItemType == itemType.Before ? detail[0].ImageUrl : detail[1].ImageUrl) || '/default/goods/150x150.jpg')"
                  style="width: 60px;height: 60px;"
                >
              </td>
              <td>
                <img
                  :src="$root.settings.DOMAIN_IMG_FILE + ((detail[0].ItemType == itemType.Before ? detail[1].ImageUrl : detail[0].ImageUrl) || '/default/goods/150x150.jpg')"
                  style="width: 60px;height: 60px;"
                >
              </td>
            </tr>
            <tr v-if="!basicShow || detail[0].GoodsType !== detail[1].GoodsType">
              <td class="tit">货品类型：</td>
              <td>
                {{detail[0].ItemType == itemType.Before ? enums.GoodsType.Types[detail[0].GoodsType + ''] : enums.GoodsType.Types[detail[1].GoodsType + ''] }}
              </td>
              <td>
                {{detail[0].ItemType == itemType.Before ? enums.GoodsType.Types[detail[1].GoodsType + ''] : enums.GoodsType.Types[detail[0].GoodsType + ''] }}
              </td>
            </tr>
            <!-- <tr v-if="!basicShow || detail[0].GoodsType !== detail[1].GoodsType">
              <td class="tit">货品类型：</td>
              <td>
                {{enums.GoodsType.Types[detail[0].GoodsType + '']}}
              </td>
              <td>
                {{enums.GoodsType.Types[detail[1].GoodsType + '']}}
              </td>
            </tr>-->
            <template v-for="(item, index) in detailData[0]">
              <tr :key="index" v-if="canView(item.IsPrivate)">
                <template v-if="!basicShow || item.Value !== detailData[1][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td v-if="item.FieldEnName.indexOf('Image') > -1">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + (item.Value || '/default/goods/150x150.jpg')" style="width: 60px;height: 60px;">
                  </td>
                  <td
                    v-else-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td v-if="detailData[1][index].FieldEnName.indexOf('Image') > -1">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + (detailData[1][index].Value || '/default/goods/150x150.jpg')" style="width: 60px;height: 60px;">
                  </td>
                  <td
                    v-else-if="detailData[1][index].Enums"
                  >{{detailData[1][index].Enums.find(i => i.Value === detailData[1][index].Value) ? detailData[1][index].Enums.find(i => i.Value === detailData[1][index].Value).Title : ''}}</td>
                  <td v-else>{{detailData[1][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 主石①信息</div>
        <el-checkbox class="title" v-model="stoneShow1" name="stoneShow">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in FieldType[0][0]">
              <tr v-if="canView(item.IsPrivate)" :key="index">
                <template v-if="!stoneShow1 || item.Value !== FieldType[1][0][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="FieldType[1][0].Enums"
                  >{{FieldType[1][0][index].Enums.find(i => i.Value === FieldType[1][0][index].Value) ? FieldType[1][0][index].Enums.find(i => i.Value === FieldType[1][0][index].Value).Title : ''}}</td>
                  <td v-else>{{FieldType[1][0][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 主石②信息</div>
        <el-checkbox class="title" v-model="stoneShow2" name="stoneShow">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in FieldType[0][1]">
              <tr v-if="canView(item.IsPrivate)" :key="index">
                <template v-if="!stoneShow2 || item.Value !== FieldType[1][1][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="FieldType[1][1].Enums"
                  >{{FieldType[1][1][index].Enums.find(i => i.Value === FieldType[1][1][index].Value) ? FieldType[1][1][index].Enums.find(i => i.Value === FieldType[1][1][index].Value).Title : ''}}</td>
                  <td v-else>{{FieldType[1][1][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 副石①信息</div>
        <el-checkbox class="title" v-model="sideShow1" name="sideShow1">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in sideData[0][0]">
              <tr v-if="canView(item.IsPrivate)" :key="index">
                <template v-if="!sideShow1 || item.Value !== sideData[1][0][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="sideData[1][0].Enums"
                  >{{sideData[1][0][index].Enums.find(i => i.Value === sideData[1][0][index].Value) ? sideData[1][0][index].Enums.find(i => i.Value === sideData[1][0][index].Value).Title : ''}}</td>
                  <td v-else>{{sideData[1][0][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 副石②信息</div>
        <el-checkbox class="title" v-model="sideShow2" name="sideShow2">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in sideData[0][1]">
              <tr :key="index" v-if="canView(item.IsPrivate)">
                <template v-if="!sideShow2 || item.Value !== sideData[1][1][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="sideData[1][1].Enums"
                  >{{sideData[1][1][index].Enums.find(i => i.Value === sideData[1][1][index].Value) ? sideData[1][1][index].Enums.find(i => i.Value === sideData[1][1][index].Value).Title : ''}}</td>
                  <td v-else>{{sideData[1][1][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 副石③信息</div>
        <el-checkbox class="title" v-model="sideShow3" name="sideShow3">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in sideData[0][2]">
              <tr v-if="canView(item.IsPrivate)" :key="index">
                <template v-if="!sideShow3 || item.Value !== sideData[1][2][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="sideData[1][2].Enums"
                  >{{sideData[1][2][index].Enums.find(i => i.Value === sideData[1][2][index].Value) ? sideData[1][2][index].Enums.find(i => i.Value === sideData[1][2][index].Value).Title : ''}}</td>
                  <td v-else>{{sideData[1][2][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 副石④信息</div>
        <el-checkbox class="title" v-model="sideShow4" name="sideShow4">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in sideData[0][3]">
            <tr v-if="canView(item.IsPrivate)" :key="index">
              <template v-if="!sideShow4 || item.Value !== sideData[1][3][index].Value">
                <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                <td
                  v-if="item.Enums"
                >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                <td v-else>{{item.Value}}</td>
                <td
                  v-if="sideData[1][3].Enums"
                >{{sideData[1][3][index].Enums.find(i => i.Value === sideData[1][3][index].Value) ? sideData[1][3][index].Enums.find(i => i.Value === sideData[1][3][index].Value).Title : ''}}</td>
                <td v-else>{{sideData[1][3][index].Value}}</td>
              </template>
            </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">▼ 副石⑤信息</div>
        <el-checkbox class="title" v-model="sideShow5" name="sideShow4">不显示未修改数据</el-checkbox>
      </div>
      <div class="panel-bd" style="padding: 0">
        <table class="details-table vc-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">属性名称</td>
              <td>修改前</td>
              <td>修改后</td>
            </tr>
            <template v-for="(item, index) in sideData[0][4]">
              <tr v-if="canView(item.IsPrivate)" :key="index">
                <template v-if="!sideShow5 || item.Value !== sideData[1][4][index].Value">
                  <td class="tit">{{item && item.FieldCnName + '：'}}</td>
                  <td
                    v-if="item.Enums"
                  >{{item.Enums.find(i => i.Value === item.Value) ? item.Enums.find(i => i.Value === item.Value).Title : ''}}</td>
                  <td v-else>{{item.Value}}</td>
                  <td
                    v-if="sideData[1][4].Enums"
                  >{{sideData[1][4][index].Enums.find(i => i.Value === sideData[1][4][index].Value) ? sideData[1][4][index].Enums.find(i => i.Value === sideData[1][4][index].Value).Title : ''}}</td>
                  <td v-else>{{sideData[1][4][index].Value}}</td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
  StonePolish,
  StoneSym,
  AppropType,
  WholesaleType,
  RetailType,
  StoneCut,
  StoneClarity,
  StoneColor,
  GiftType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  GoodsType,
  GoodsModifyOrderItemType
} from '@/enums/stocking.js'
import {
  // STOCKING_API_MODIFY_GOODSSTONELIST,
  // STOCKING_API_MODIFY_GOODSBASICLIST,
  // STOCKING_API_SETTING_ATTRIBUTELIST,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS
} from '@/apis/stocking.js'

export default {
  props: {
    goodsId: String,
    modifyId: Number,
    apis: Function,
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
    // refresh: ''
  },
  data() {
    return {
      itemType: GoodsModifyOrderItemType,
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
        GoodsType,
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
      detail: [
        {
          ImageUrl: ''
        },
        {
          ImageUrl: ''
        }
      ],
      detailData: [[], []], // 基础信息
      FieldType: [[[], []], [[], []]], // 主石信息
      sideData: [[[], [], [], [], []], [[], [], [], [], []]], // 副石信息
      StyleId: null, // 修改后StyleId
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
      this.detailData = [[], []]
      this.FieldType = [[[], []], [[], []]]
      this.sideData = [[[], [], [], [], []], [[], [], [], [], []]]
      this.getForm()
    },
    getGoodDetail() {
      this.apis({
        ModifyId: this.modifyId,
        GoodsId: this.goodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data.Rows || [[], []]
          this.StyleId = this.detail[0].ItemType == this.itemType.Before ? this.detail[0].StyleId : this.detail[1].StyleId
          this.detailData[0].forEach(item => {
            item.Value =
              item.Precision > 0
                ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[0][item.FieldEnName]) : this.$root.toFloat(this.detail[1][item.FieldEnName])
                : this.detail[0].ItemType == this.itemType.Before ? this.detail[0][item.FieldEnName] : this.detail[1][item.FieldEnName]
          })
          this.detailData[1].forEach(item => {
            item.Value =
              item.Precision > 0
                ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[1][item.FieldEnName]) : this.$root.toFloat(this.detail[0][item.FieldEnName])
                : this.detail[0].ItemType == this.itemType.Before ? this.detail[1][item.FieldEnName] : this.detail[0][item.FieldEnName]
          })
          this.FieldType[0].map(item => {
            item.map(item1 => {
              item1.Value =
                item1.Precision > 0
                  ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[0][item1.FieldEnName]) : this.$root.toFloat(this.detail[1][item1.FieldEnName])
                  : this.detail[0].ItemType == this.itemType.Before ? this.detail[0][item1.FieldEnName] : this.detail[1][item1.FieldEnName]
            })
          })
          this.FieldType[1].map(item => {
            item.map(item1 => {
              item1.Value =
                item1.Precision > 0
                  ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[1][item1.FieldEnName]) : this.$root.toFloat(this.detail[0][item1.FieldEnName])
                  : this.detail[0].ItemType == this.itemType.Before ? this.detail[1][item1.FieldEnName] : this.detail[0][item1.FieldEnName]
            })
          })
          this.sideData[0].map(item => {
            item.map(item1 => {
              item1.Value =
                item1.Precision > 0
                  ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[0][item.FieldEnName]) :this.$root.toFloat(this.detail[1][item.FieldEnName])
                  : this.detail[0].ItemType == this.itemType.Before ? this.detail[0][item.FieldEnName] : this.detail[1][item.FieldEnName]
            })
          })
          this.sideData[1].map(item => {
            item.map(item1 => {
              item1.Value =
                item1.Precision > 0
                  ? this.detail[0].ItemType == this.itemType.Before ? this.$root.toFloat(this.detail[1][item.FieldEnName]) : this.$root.toFloat(this.detail[0][item.FieldEnName])
                  : this.detail[0].ItemType == this.itemType.Before ? this.detail[1][item.FieldEnName] : this.detail[0][item.FieldEnName]
            })
          })
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
          this.detailData = [[], []]
          this.FieldType = [[[], []], [[], []]]
          this.sideData = [[[], [], [], [], []], [[], [], [], [], []]]
          this.data.forEach(item => {
            if (item.IsEnable === YNStatus.Yes) {
              switch (item.SmallType) {
                case this.enums.SettingCustomizedFieldSmallType.Basic: {
                  item.index = this.detailData.length
                  // 添加表单
                  // this.$set(this.form, item.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  const obj = JSON.stringify(item)
                  const clone1 = JSON.parse(obj)
                  const clone2 = JSON.parse(obj)
                  this.detailData[0].push(clone1)
                  this.detailData[1].push(clone2)
                }
                  break
                case this.enums.SettingCustomizedFieldSmallType.MainStone: {
                  item.index = this.FieldType.length
                  let item1 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item1.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item1.FieldEnName.indexOf('1') == 5) {
                    // item1.FieldCnName = item1.FieldCnName.substr(5)
                    const obj = JSON.stringify(item1)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.FieldType[0][0].push(clone1)
                    this.FieldType[1][0].push(clone2)
                  }

                  let item2 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item2.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item2.FieldEnName.indexOf('2') == 5) {
                    // item2.FieldCnName = item2.FieldCnName.substr(5)
                    const obj = JSON.stringify(item2)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.FieldType[0][1].push(clone1)
                    this.FieldType[1][1].push(clone2)
                  }
                  break
                }
                case this.enums.SettingCustomizedFieldSmallType.SlaveStone: {
                  item.index = this.sideData.length
                  let item3 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item3.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item3.FieldEnName.indexOf('3') == 5) {
                    // item3.FieldCnName = item3.FieldCnName.substr(5)
                    const obj = JSON.stringify(item3)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.sideData[0][0].push(clone1)
                    this.sideData[1][0].push(clone2)
                  }

                  let item4 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item4.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item4.FieldEnName.indexOf('4') == 5) {
                    // item4.FieldCnName = item4.FieldCnName.substr(5)
                    const obj = JSON.stringify(item4)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.sideData[0][1].push(clone1)
                    this.sideData[1][1].push(clone2)
                  }

                  let item5 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item5.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item5.FieldEnName.indexOf('5') == 5) {
                    // item5.FieldCnName = item5.FieldCnName.substr(5)
                    const obj = JSON.stringify(item5)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.sideData[0][2].push(clone1)
                    this.sideData[1][2].push(clone2)
                  }

                  let item6 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item6.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item6.FieldEnName.indexOf('6') == 5) {
                    // item6.FieldCnName = item6.FieldCnName.substr(5)
                    const obj = JSON.stringify(item6)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.sideData[0][3].push(clone1)
                    this.sideData[1][3].push(clone2)
                  }

                  let item7 = Object.assign({}, item)
                  // 添加表单
                  // this.$set(this.form, item7.FieldEnName, item.FieldType == SettingCustomizedFieldType.SelectOfEnums ? 0 : '')
                  if (item7.FieldEnName.indexOf('7') == 5) {
                    // item7.FieldCnName = item7.FieldCnName.substr(5)
                    const obj = JSON.stringify(item7)
                    const clone1 = JSON.parse(obj)
                    const clone2 = JSON.parse(obj)
                    this.sideData[0][4].push(clone1)
                    this.sideData[1][4].push(clone2)
                  }
                  break
                }
                default:
                  break
              }
            }
            // if (item.IsEnable === this.enums.YNStatus.Yes) {
            //   switch (item.SmallType) {
            //     case this.enums.SettingCustomizedFieldSmallType.Basic:
            //       this.detailData[0].push(item)
            //       this.detailData[1].push(item)
            //       break;
            //     case this.enums.SettingCustomizedFieldSmallType.MainStone:
            //       item.FieldEnName += '1'
            //       this.FieldType[0].push(item)
            //       this.FieldType[1].push(item)
            //       break;
            //     case this.enums.SettingCustomizedFieldSmallType.SlaveStone:
            //       let item2 = Object.assign({}, item)
            //       item2.FieldEnName += '2'
            //       this.sideData[0][0].push(item2)
            //       this.sideData[1][0].push(item2)
            //       let item3 = Object.assign({}, item)
            //       item3.FieldEnName += '3'
            //       this.sideData[0][1].push(item3)
            //       this.sideData[1][1].push(item3)
            //       let item4 = Object.assign({}, item)
            //       item4.FieldEnName += '4'
            //       this.sideData[0][2].push(item4)
            //       this.sideData[1][2].push(item4)
            //       let item5 = Object.assign({}, item)
            //       item5.FieldEnName += '5'
            //       this.sideData[0][3].push(item5)
            //       this.sideData[1][3].push(item5)
            //       break;
            //   }
            // }
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
  },
  beforeMount() {
  },
  mounted() {
    this.change()
  },
  watch: {
    goodsId: 'change'
    // refresh: 'change'
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


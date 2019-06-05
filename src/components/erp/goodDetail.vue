<template>
  <el-dialog title="查看货品详情" class="details-table-dialog" :visible="visible" @update:visible="$emit('update:visible', $event)" width="600px">
    <div v-loading="basicLoading">
      <div class="panel">
        <div class="panel-hd">
          <div class="title">基本信息</div>
          <el-checkbox v-model="basicShow" name="basicShow">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-if="!basicShow || detail.ImageUrl">
                <td class="tit">图片</td>
                <td>
                  <el-popover trigger="hover">
                    <img
                      :src="detail.ImageUrl.indexOf('http') > -1 ? detail.ImageUrl : ($root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl ? detail.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg'))"
                    >
                    <img
                      slot="reference"
                      :src="detail.ImageUrl.indexOf('http') > -1 ? detail.ImageUrl : ($root.settings.DOMAIN_IMG_FILE + (detail.ImageUrl ? detail.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg'))"
                    >
                  </el-popover>
                </td>
              </tr>
              <template v-for="(item, index) in basicItems">
                <tr :key="index" v-if="!basicShow || detail[item.FieldEnName] || item.IsRequired === YNStatus.Yes">
                  <td class="tit">{{item.FieldCnName + '：'}}</td>
                  <td>
                    <template v-if="item.FieldEnName.indexOf('Image') > -1">
                      <el-popover trigger="hover">
                        <img
                          :src="detail[item.FieldEnName].slice(0,4) === 'http' ? detail[item.FieldEnName] : $root.settings.DOMAIN_IMG_FILE + (detail[item.FieldEnName] ? detail[item.FieldEnName].replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                        >
                        <img
                          slot="reference"
                          :src="detail[item.FieldEnName].slice(0,4) === 'http' ? detail[item.FieldEnName] : $root.settings.DOMAIN_IMG_FILE +(detail[item.FieldEnName] ? detail[item.FieldEnName].replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                        >
                      </el-popover>
                    </template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && item.FieldEnName.slice(-2) == 'Ek'"
                    >{{detail[item.FieldEnName.replace('Ek', 'Ev')]}}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">主石①信息</div>
          <el-checkbox name="stoneShow1" v-model="stoneShow1">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in mainStoneItems[0]">
                <tr :key="index" v-if="!stoneShow1 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">主石②信息</div>
          <el-checkbox name="stoneShow2" v-model="stoneShow2">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in mainStoneItems[1]">
                <tr :key="index" v-if="!stoneShow2 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">副石①信息</div>
          <el-checkbox v-model="sideShow1">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in slaveStoneItemms[0]">
                <tr :key="index" v-if="!sideShow1 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">副石②信息</div>
          <el-checkbox v-model="sideShow2">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in slaveStoneItemms[1]">
                <tr :key="index" v-if="!sideShow2 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">副石③信息</div>
          <el-checkbox v-model="sideShow3">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in slaveStoneItemms[2]">
                <tr :key="index" v-if="!sideShow3 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">副石④信息</div>
          <el-checkbox v-model="sideShow4">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in slaveStoneItemms[3]">
                <tr :key="index" v-if="!sideShow4 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <div class="title">副石⑤信息</div>
          <el-checkbox v-model="sideShow5">不显示空数据</el-checkbox>
        </div>
        <div class="panel-bd">
          <table class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <template v-for="(item, index) in slaveStoneItemms[2]">
                <tr :key="index" v-if="!sideShow5 || detail[item.FieldEnName]">
                  <td class="tit">{{item && item.FieldCnName.slice(5) + '：'}}</td>
                  <td>
                    <template
                      v-if="item.FieldType === SettingCustomizedFieldType.SelectOfEnums && detail[item.FieldEnName] && item.Enums"
                    >{{ item.Enums.find(ele => ele.Value === detail[item.FieldEnName]) && item.Enums.find(ele => ele.Value === detail[item.FieldEnName]).Title }}</template>
                    <template
                      v-else-if="item.FieldType === SettingCustomizedFieldType.TextOfDecimal || item.FieldType === SettingCustomizedFieldType.TextOfPercent"
                    >{{detail[item.FieldEnName] ? $root.toFloat(detail[item.FieldEnName], item.Precision) : ''}}</template>
                    <template v-else>{{detail[item.FieldEnName] || ''}}</template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  SettingCustomizedFieldType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType
} from '@/enums/stocking.js'
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_BASIC_GET,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS
} from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    goodsId: [Number, String],
    kindType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      YNStatus,
      SettingCustomizedFieldType,
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
      mainStoneItems: [[], []],// 主石信息
      basicItems: [],// 基础信息
      slaveStoneItemms: [[], [], [], [], [],],// 副石信息
      basicLoading: false
    }
  },
  methods: {
    getGoodDetail() {
      this.basicLoading = true
      STOCKING_API_GOODS_BASIC_GET({
        GoodsId: this.goodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = Object.assign(this.detail, res.data.Data)
        }
        this.basicLoading = false
      })
    },

    getItemms() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({
        OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        KindTypeEk: this.kindType,
        SmallType: 0,
        IsView: this.YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Rows.forEach(item => {
            if (item.IsEnable === YNStatus.Yes && (item.IsPrivate === YNStatus.No || this.$store.getters.user_session.CanViewPrivateField === YNStatus.Yes)) {
              if (item.SmallType === SettingCustomizedFieldSmallType.Basic) {
                this.basicItems.push(item)
              }
              switch (item.FieldEnName.slice(5, 6)) {
                case '1':
                  this.mainStoneItems[0].push(item)
                  break
                case '2':
                  this.mainStoneItems[1].push(item)
                  break
                case '3':
                  this.slaveStoneItemms[0].push(item)
                  break
                case '4':
                  this.slaveStoneItemms[1].push(item)
                  break
                case '5':
                  this.slaveStoneItemms[2].push(item)
                  break
                case '6':
                  this.slaveStoneItemms[3].push(item)
                  break
                case '7':
                  this.slaveStoneItemms[4].push(item)
                  break
                default:
                  break
              }
            }
          })
        }
      })
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.basicShow = true
        this.stoneShow1 = true
        this.stoneShow2 = true
        this.sideShow1 = true
        this.sideShow2 = true
        this.sideShow3 = true
        this.sideShow4 = true
        this.sideShow5 = true
        this.mainStoneItems = [[], []]// 主石信息
        this.basicItems = []// 基础信息
        this.slaveStoneItemms = [[], [], [], [], [],]// 副石信息
        this.getItemms()
        this.getGoodDetail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.details-table {
  .tit {
    width: 200px;
  }
}
.el-checkbox {
  float: right;
  margin: 0;
}
.panel {
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 20px;
  border: 0;
  .panel-hd {
    overflow: hidden;
    height: 32px;
    line-height: 32px;
    > .title {
      height: 32px;
      line-height: 32px;
    }
    border: 1px solid #ddd;
    border-bottom: 0;
  }
  .panel-bd {
    padding: 0;
  }
}

/* @module 左右结构的数据表格 */
.details-table-double,
.details-table-dialog {
  .details-table {
    font-size: 12px;
    border-top: solid 1px #e5e5e5;
    border-left: solid 1px #e5e5e5;

    .note {
      max-width: 300px;
      word-break: break-word;
      word-break: break-all;
    }

    th,
    td {
      height: 25px;
      padding: 0 8px;
      border-right: solid 1px #e5e5e5;
      border-bottom: solid 1px #e5e5e5;
    }

    th,
    .tit {
      background-color: #f5f5f5;
      color: #555;
      text-align: right;
    }

    th {
      font-weight: normal;
      text-align: center;
    }

    td {
      text-align: left;
      color: #333;

      img {
        width: 40px;
        height: 40px;
        margin-top: 5px;
      }
    }
  }
}
</style>


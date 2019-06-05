<template>
  <el-dialog
    title="查看货品详情"
    class="details-table-dialog"
    :visible.sync="visible"
  >
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 基本信息
        </div>
        <el-checkbox
          class="title"
          name="basicShow" v-model="basicShow"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr v-if="!basicShow || (detail.ImageUrl && detail.ImageUrl.indexOf('default') === -1)">
              <td class="tit">图片</td>
              <td>
                <img :src="$root.settings.DOMAIN_IMAGE + detail.ImageUrl.replace('{0}', '150x150')">
              </td>
            </tr>
            <tr
              v-for="(item, index) in detailData"
              :key="index"
              v-if="!basicShow || detail[item.AttributeField] || item.IsRequired === enums.YNStatus.Yes"
            >
              <td class="tit">{{item && (item.AttributeName === '数量' ? '采购数量' : item.AttributeName) + '：'}}</td>
              <td v-if="item.AttributeField === 'SeriesType' && detail.SeriesTypeName">{{detail.SeriesTypeName}}</td>
              <td v-else>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField] || ''}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="title">
          ▼ 主石信息
        </div>
        <el-checkbox
          class="title"
          name="stoneShow" v-model="stoneShow"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr
              v-for="(item, index) in stoneData"
              :key="index"
              v-if="!stoneShow || detail[item.AttributeField]"
            >
              <td class="tit">{{item && item.AttributeName + '：'}}</td>
              <td>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField]}}</td>
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
        <el-checkbox
          class="title"
          name="sideShow1" v-model="sideShow1"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr
              v-for="(item, index) in sideData[0]"
              :key="index"
              v-if="!sideShow1 || detail[item.AttributeField]"
            >
              <td class="tit">{{item && item.AttributeName + '：'}}</td>
              <td>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField]}}</td>
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
        <el-checkbox
          class="title"
          name="sideShow2" v-model="sideShow2"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr
              v-for="(item, index) in sideData[1]"
              :key="index"
              v-if="!sideShow2 || detail[item.AttributeField]"
            >
              <td class="tit">{{item && item.AttributeName + '：'}}</td>
              <td>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField]}}</td>
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
        <el-checkbox
          class="title"
          name="sideShow3" v-model="sideShow3"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr
              v-for="(item, index) in sideData[2]"
              :key="index"
              v-if="!sideShow3 || detail[item.AttributeField]"
            >
              <td class="tit">{{item && item.AttributeName + '：'}}</td>
              <td>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField]}}</td>
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
        <el-checkbox
          class="title"
          name="sideShow4" v-model="sideShow4"
        >不显示空数据</el-checkbox>
      </div>
      <div class="panel-bd">
        <table
          class="details-table"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr
              v-for="(item, index) in sideData[3]"
              :key="index"
              v-if="!sideShow4 || detail[item.AttributeField]"
            >
              <td class="tit">{{item && item.AttributeName + '：'}}</td>
              <td>{{item.AttributeType === enums.SettingCustomizedFieldType.SelectOfEnums ? enums[item.Enumerate].Types[detail[item.AttributeField]] : detail[item.AttributeField]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  GoodsType,
  RetailType,
  ProcessType,
  PriceType,
  FeeType,
  GiftType,
  StoneColor,
  StoneClarity,
  StoneCut,
  StonePolish,
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
} from '@/enums/stocking.js'
import {
  YNStatus,
} from '@/enums/common.js'
import {
  STOCKING_API_GOODS_GOODSDETAIL,
  STOCKING_API_GOODS_STONEDETAIL,
  STOCKING_API_SETTING_ATTRIBUTELIST
} from '@/apis/stocking.js'

export default {
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      enums: {
        YNStatus,
        GoodsType,
        RetailType,
        ProcessType,
        PriceType,
        FeeType,
        GiftType,
        StoneColor,
        StoneClarity,
        StoneCut,
        StonePolish,
        SettingCustomizedFieldType,
        SettingCustomizedFieldSmallType,
        GoldType: this.$store.getters.goldType,
        MaterialType: this.$store.getters.materialType,
        CategoryType: this.$store.getters.categoryType,
        SeriesType: this.$store.getters.seriesType,
        PaymentType: this.$store.getters.paymentType
      },
      visible: this.data.visible,
      basicShow: true,
      stoneShow: true,
      sideShow1: true,
      sideShow2: true,
      sideShow3: true,
      sideShow4: true,
      detail: {
        ImageUrl: ''
      },
      detailData: [], // 基础信息
      stoneData: [], // 主石信息
      sideData: [[], [], [], []] // 副石信息
    }
  },
  methods: {
    getGoodDetail() {
      STOCKING_API_GOODS_GOODSDETAIL({
        GoodsId: this.data.goodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = Object.assign(this.detail, res.data.Data)
          this.getGoodStone()
        }
      })
    },
    getGoodStone() {
      STOCKING_API_GOODS_STONEDETAIL({
        GoodsId: this.data.goodsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = Object.assign(this.detail, res.data.Data)
          this.getForm()
        }
      })
    },
    getForm() {
      STOCKING_API_SETTING_ATTRIBUTELIST({
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.forEach(item => {
            if (
              item.IsEnable === this.enums.YNStatus.Yes &&
              item.IsPrivate === this.enums.YNStatus.No
            ) {
              switch (item.GroupType) {
                case this.enums.SettingCustomizedFieldSmallType.Basic:
                  this.detailData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.Stone1:
                  item.AttributeField += '1'
                  this.stoneData.push(item)
                  break
                case this.enums.SettingCustomizedFieldSmallType.Stone2:
                  var item2 = Object.assign({
                  }, item)
                  item2.AttributeField += '2'
                  this.sideData[0].push(item2)
                  var item3 = Object.assign({
                  }, item)
                  item3.AttributeField += '3'
                  this.sideData[1].push(item3)
                  var item4 = Object.assign({
                  }, item)
                  item4.AttributeField += '4'
                  this.sideData[2].push(item4)
                  var item5 = Object.assign({
                  }, item)
                  item5.AttributeField += '5'
                  this.sideData[3].push(item5)
                  break
                default:
                  break
              }
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getGoodDetail()
  },
  watch: {
    visible() {
      this.$emit('listenGoodDetailDialog', false)
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


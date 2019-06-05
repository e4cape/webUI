<template>
  <div class="content">
    <div class="container" v-loading="isLoading">
      <div class="name" v-if="marproId == 1">
        <div class="product-icon product-1"></div>
        <div class="product-desc">
          <p>金利来</p>
          <p>是针对素转非以旧换新营销产品，客户购买按克销售的素金类商品参与金利来可获鼓励金，后期客户可带原商品+鼓励金换购非素类商品，从而达到素转非的目的。</p>
        </div>
      </div>
      <div class="name" v-if="marproId == 2">
        <div class="product-icon product-2"></div>
        <div class="product-desc">
          <p>随心换</p>
          <p>是针对非转非以旧换新营销产品，客户购买非素类商品参与随心换可获置换金，后期客户可带原商品+置换金换购非素类商品，提高复购率。</p>
        </div>
      </div>
      <div class="name" v-if="marproId == 3">
        <div class="product-icon product-4"></div>
        <div class="product-desc">
          <p>翡常值</p>
          <p>是针对翡翠玉石类的营销产品，客户购买翡翠玉石参与翡常值获得抵用金，后期客户再次购买相应商品时，可使用抵用金抵扣一定比例的商品金额。</p>
        </div>
      </div>
      <div class="name" v-if="marproId == 4">
        <div class="product-icon product-3"></div>
        <div class="product-desc">
          <p>超值购</p>
          <p>是针对全材质的营销产品，客户购买相应材质的商品参与超值购获得购物金，客户再次购买相应商品时，可使用购物金抵扣一定比率的商品金额。</p>
        </div>
      </div>
      <table style="margin-bottom:10px">
        <tr>
          <td>参与条件</td>
          <td>
            {{( settingDetail.MaterialTypes || '' )
            .split(',')
            .map(item => $store.getters.materialType.Types[item])
            .join('，')}}
          </td>
        </tr>
        <tr></tr>
      </table>
      <el-form v-for="(item, index) in couponList" :key="index" :model="item" ref="item" :rules="rules">
        <table>
          <tr>
            <td>赠送收益</td>
            <td>{{CouponType.Types[item.CouponType]}}</td>
          </tr>
          <tr>
            <td>收益比率</td>
            <td v-if="item.editing" class="edit-form">
              <el-form-item prop="CouponRate" style="margin:0">
                <el-input name="inputCouponRate" v-model="item.CouponRate" style="width:230px" @keyup.native="item.CouponRate=$root.toFixed(item.CouponRate, 1)"></el-input>
                <span>%</span>
              </el-form-item>
            </td>
            <td v-else>{{item.CouponRate}}%</td>
          </tr>
          <tr>
            <td>收益天数</td>
            <td v-if="item.editing" class="edit-form">
              <el-form-item prop="Days" style="margin:0">
                <el-input name="inputDays" v-model="item.Days" style="width:230px" @keyup.native="item.Days=$root.toFixed(item.Days, 0)"></el-input>
                <span>天</span>
              </el-form-item>
            </td>
            <td v-else>{{item.Days}}天</td>
          </tr>
          <tr>
            <td>赠送方式</td>
            <td>按天赠送</td>
          </tr>
          <tr v-if="item.CouponType == CouponType.Equiv">
            <td>赠送数量</td>
            <td v-if="item.editing" class="edit-form">
              <el-form-item prop="CardAmt" style="margin:0">
                <el-input name="inputCardAmt" v-model="item.CardAmt" style="width:230px" @keyup.native="item.CardAmt=$root.toFixed(item.CardAmt, 0)"></el-input>
                <span>张（最多 5 张）</span>
              </el-form-item>
            </td>
            <td v-else>{{item.CardAmt}}张</td>
          </tr>
          <tr>
            <td>收益递减</td>
            <td v-if="item.editing" class="edit-form">
              <el-form-item prop="SubtractDays" style="margin:0">
                <span>收益赠送完</span>
                <el-input name="inputSubtractDays" v-model="item.SubtractDays" style="width:230px" @keyup.native="item.SubtractDays=$root.toFixed(item.SubtractDays, 0)"></el-input>
                <span>天后按天递减</span>
              </el-form-item>
            </td>
            <td v-else>收益赠送完 {{item.SubtractDays}} 天后按天递减</td>
          </tr>
          <tr>
            <td v-if="marproId == 3 || marproId == 4">可抵扣商品类别</td>
            <td v-else>可换购商品类别</td>
            <td>
              <p>
                {{(item.MaterialTypes || '')
                .split(',')
                .map(item => $store.getters.materialType.Types[item])
                .join('，') || '-'}}
              </p>
            </td>
          </tr>
          <tr v-if="item.CouponType == CouponType.Agrece">
            <td>换购计算金额</td>
            <td>今日金价 × 重量（克）＋ 鼓励金</td>
          </tr>
          <tr v-else-if="item.CouponType == CouponType.Gond">
            <td>抵扣比率</td>
            <td v-if="item.editing" class="edit-form">
              <div style="display:flex;align-items:center">
                <el-form-item prop="MaxiRate1" style="margin:0">
                  <span>黄金</span>
                  <el-input name="inputMaxiRate1" v-model="item.MaxiRate1" style="width:100px" @keyup.native="item.MaxiRate1=$root.toFixed(item.MaxiRate1, 1)"></el-input>
                  <span>%，</span>
                </el-form-item>
                <el-form-item prop="MaxiRate2" style="margin:0;display:inline-block">
                  <span>非黄金</span>
                  <el-input name="inputMaxiRate2" v-model="item.MaxiRate2" style="width:100px" @keyup.native="item.MaxiRate2=$root.toFixed(item.MaxiRate2, 1)"></el-input>
                  <span>%</span>
                </el-form-item>
                <span class="m-l-10">抵扣比率须大于或等于0，但两个不能同时为0，否则不能保存</span>
              </div>
            </td>
            <td v-else>
              <span v-if="parseFloat(item.MaxiRate1) > 0" class="m-r-10">黄金{{item.MaxiRate1}}%</span>
              <span v-if="parseFloat(item.MaxiRate2) > 0">非黄金{{item.MaxiRate2}}%</span>
            </td>
          </tr>
          <tr v-else-if="item.CouponType == CouponType.Agitate">
            <td>换购计算金额</td>
            <td v-if="item.editing" class="edit-form">
              <div style="display:flex">
                <el-form-item prop="Cpmultiple" style="margin:0;display:inline-block">
                  <span>换购新品价格小于等于旧品价格(购价+置换金)的</span>
                  <el-input name="inputCpmultiple" v-model="item.Cpmultiple" style="width:100px" @keyup.native="item.Cpmultiple=$root.toFixed(item.Cpmultiple, 1)"></el-input>
                  <span>倍时，</span>
                </el-form-item>
                <el-form-item prop="CpfeeRate" style="margin:0;display:inline-block">
                  <span>则门店额外收取旧品价格的</span>
                  <el-input name="inputCpfeeRate" v-model="item.CpfeeRate" style="width:100px" @keyup.native="item.CpfeeRate=$root.toFixed(item.CpfeeRate, 1)"></el-input>
                  <span>% 折旧工费；</span>
                </el-form-item>
              </div>
              <div :class="item.editing? 'm-t-5' : ''">换购商品差价大于旧品价格（购价+置换金）的 {{item.Cpmultiple}} 倍时不收取折旧工费</div>
            </td>
            <td v-else>换购新品价格小于等于旧品价格(购价+置换金)的{{item.Cpmultiple}}倍时，则门店额外收取旧品价格的 {{item.CpfeeRate}}% 折旧工费；换购商品差价大于旧品价格（购价+置换金）的 {{settingDetail.Items[index].Cpmultiple}} 倍时不收取折旧工费</td>
          </tr>
          <tr v-else>
            <td>换购计算金额</td>
            <td>每单仅可使用 1 张，用后作废，不找零</td>
          </tr>
          <tr>
            <td></td>
            <td v-if="characterType==CharacterType.Company || wechatSettingType == CompanyBasicMountType.Store">
              <div v-if="item.editing">
                <el-button name="btnUpdate" type="primary" @click="update(index)">保存</el-button>
                <el-button name="btnCancel" @click="edit(index, false)">取消</el-button>
              </div>
              <el-button name="btnEdit" v-else type="primary" @click="edit(index, true)">编辑</el-button>
            </td>
          </tr>
        </table>
      </el-form>
      <table>
        <tr>
          <td>活动规则</td>
          <td v-if="counponNoteEdit" class="edit-form">
            <el-form :model="settingDetail" ref="counponNote" :rules="rules">
              <el-form-item style="margin-bottom:0" prop="CouponNote">
                <el-input name="inputCouponNote" v-model="settingDetail.CouponNote" type="textarea" :rows="5" style="width:50%"></el-input>
              </el-form-item>
            </el-form>
          </td>
          <td v-else>
            <p v-html="settingDetail.CouponNoteExt" style="line-height:20px"></p>
          </td>
        </tr>
        <tr>
          <td></td>
          <td v-if="characterType==CharacterType.Company || wechatSettingType == CompanyBasicMountType.Store">
            <div v-if="counponNoteEdit">
              <el-button name="btnCounponNoteUpdate" type="primary" @click="counponNoteUpdate">保存</el-button>
              <el-button name="btnCancels" @click="counponNoteUpdateCancel">取消</el-button>
            </div>
            <el-button name="btnCounponNoteEdit" type="primary" @click="counponNoteEdit=true" v-else>编辑</el-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {
  MARKETING_API_STORE_SETTING_COUPON_GET,
  MARKETING_API_STORE_SETTING_COUPON_STORECOUPONUPDATE,
  MARKETING_API_STORE_SETTING_MARKET_NOTE_COUPONNOTEUPDATE
} from '@/apis/marketing'
import { CouponType } from '@/enums/marketing'
import { CharacterType } from '@/enums/common'
import { CompanyBasicMountType } from '@/enums/merchant'
import { percentValid, daysValid, countValid, twoDecNumValid } from '@/rules/formValidate'
export default {
  data() {
    return {
      CouponType,
      CharacterType,
      CompanyBasicMountType,
      isLoading: false,
      settingDetail: {},
      marproId: '',
      couponList: [],
      counponNoteEdit: false,
      editIndex: 0,
      oldCouponNote: '',
      rules: {
        CouponRate: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: percentValid,
            trigger: 'blur'
          }
        ],
        MaxiRate1: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: this.maxiRate1Valid,
            trigger: 'blur'
          }
        ],
        MaxiRate2: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: this.maxiRate2Valid,
            trigger: 'blur'
          }
        ],
        CpfeeRate: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: percentValid,
            trigger: 'blur'
          }
        ],

        SubtractDays: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: daysValid,
            trigger: 'blur'
          }
        ],
        Days: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: daysValid,
            trigger: 'blur'
          }
        ],
        CardAmt: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: countValid,
            trigger: 'blur'
          }
        ],
        CouponNote: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            max: 500,
            message: '不能超过 500 字',
            trigger: 'blur'
          }
        ],
        Cpmultiple: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: twoDecNumValid,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
  },
  mounted() {
    this.init()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  watch: {
    $route: 'init'
  },
  beforeRouteUpdate: (to, from, next) => {
    // 根据id切换路由标题
    if (to.params.id == 1) {
      to.meta.name = '金利来'
    } else if (to.params.id == 2) {
      to.meta.name = '随心换'
    } else if (to.params.id == 4) {
      to.meta.name = '超值购'
    } else {
      to.meta.name = '翡常值'
    }
    next()
  },
  methods: {
    init() {
      this.marproId = this.$route.params.id
      this.getDetail()
    },
    edit(index, enable) {
      this.$set(this.couponList, index, {
        ...this.settingDetail.Items[index]
      })
      this.couponList[index].editing = enable
      this.editIndex = index
    },
    update(index) {
      this.$refs['item'][index].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.couponList[index])
          params.CardAmt = parseInt(params.CardAmt)
          params.CouponRate = this.$root.toInt(params.CouponRate) / 100
          params.CpfeeRate = this.$root.toInt(params.CpfeeRate) / 100
          params.Cpmultiple = this.$root.toInt(params.Cpmultiple)
          params.Days = parseInt(params.Days)
          params.MaxiRate1 = this.$root.toInt(params.MaxiRate1) / 100
          params.MaxiRate2 = this.$root.toInt(params.MaxiRate2) / 100
          params.SubtractDays = parseInt(params.SubtractDays)
          delete params.editing
          MARKETING_API_STORE_SETTING_COUPON_STORECOUPONUPDATE(params).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: res.data.Message,
                  type: 'success'
                })
                this.couponList[index].editing = false
                this.settingDetail.Items[index] = {
                  ...this.couponList[index]
                }
                this.getDetail()
              }
            }
          )
        }
      })
    },
    counponNoteUpdate() {
      this.$refs.counponNote.validate(valid => {
        if (valid) {
          MARKETING_API_STORE_SETTING_MARKET_NOTE_COUPONNOTEUPDATE({
            MarproId: parseInt(this.marproId),
            CharacterId: this.$store.getters.user_session.CharacterId,
            Note: this.settingDetail.CouponNote
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.counponNoteEdit = false
              this.oldCouponNote = this.settingDetail.CouponNote
              this.settingDetail.CouponNoteExt = this.settingDetail.CouponNote.replace(
                /(\n)/g,
                '<br>'
              )
            }
          })
        }
      })
    },
    counponNoteUpdateCancel() {
      this.counponNoteEdit = false
      this.settingDetail.CouponNote = this.oldCouponNote
    },
    getDetail() {
      this.isLoading = true
      MARKETING_API_STORE_SETTING_COUPON_GET({
        MarproId: this.marproId,
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.settingDetail = res.data.Data
          this.oldCouponNote = this.settingDetail.CouponNote || ''
          this.settingDetail.CouponNoteExt = this.couponNoteFormat(this.settingDetail.CouponNote) || ''
          this.couponList = res.data.Data.Items.map(item => {
            item.CouponRate = this.$root.toFloat(item.CouponRate * 100, 1)
            item.MaxiRate1 = this.$root.toFloat(item.MaxiRate1 * 100, 1)
            item.MaxiRate2 = this.$root.toFloat(item.MaxiRate2 * 100, 1)
            item.CpfeeRate = this.$root.toFloat(item.CpfeeRate * 100, 1)
            item.Cpmultiple = this.$root.toFloat(item.Cpmultiple)
            this.$set(item, 'editing', false)
            return {
              ...item
            }
          })
        }
      })
    },
    couponNoteFormat(couponNote) {
      return !!couponNote && couponNote.replace(/(\n)/g, '<br>')
    },
    maxiRate1Valid(rule, value, callback) {
      let flag = /^(?!100(\.[1-9])$)([1-9]\d?|\d|100)(\.\d{1})?$/g.test(value)
      if (!flag) {
        callback(new Error('输入有误'))
      } else {
        if (this.couponList[this.editIndex].MaxiRate2 == 0) {
          this.$refs['item'][this.editIndex].validateField('MaxiRate2')
        }
        callback()
      }
    },
    maxiRate2Valid(rule, value, callback) {
      let flag = /^(?!100(\.[1-9])$)([1-9]\d?|\d|100)(\.\d{1})?$/g.test(value)
      if (
        !flag ||
        (value == 0 && this.couponList[this.editIndex].MaxiRate1 == 0)
      ) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  margin-bottom: 50px;
  border: 1px solid #e5e5e5;
  .container {
    position: relative;
    margin: 0 10px;
    padding-bottom: 10px;
    // width: 1200px;
    .name {
      padding-top: 23px;
      padding-bottom: 15px;
      display: flex;
      align-items: center;
      height: 89px;
      .product-icon {
        width: 50px;
        height: 50px;
        &.product-1 {
          background: url('/static/images/market_product_1.png') no-repeat;
        }
        &.product-2 {
          background: url('/static/images/market_product_2.png') no-repeat;
        }
        &.product-3 {
          background: url('/static/images/market_product_3.png') no-repeat;
        }
        &.product-4 {
          background: url('/static/images/market_product_4.png') no-repeat;
        }
        // background-size: cover;
      }
      .product-desc {
        padding-left: 15px;
        p {
          &:first-child {
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            color: #4b8ab5;
          }
          &:last-child {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
    table {
      tr {
        td {
          padding: 10px 20px;
          border: 1px solid #e5e5e5;
          &:first-child {
            width: 200px;
            border-left: none;
            color: #777;
            background-color: #f5f5f5;
          }
          &:last-child {
            border-right: none;
            color: #333;
          }
          &.edit-form {
            padding: 2px 20px;
          }
        }
        &:last-child {
          td {
            border: none;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.edit-form {
  .el-form-item__error {
    position: relative;
  }
}
</style>


<template>
  <div v-loading="loading">
    <el-row
      :gutter="30"
      v-loading="loading"
    >
      <el-col :xl="16">
        <ul class="detail-list">
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >卡券ID：</el-col>
            <el-col :span="21">{{Basic.CouponId}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CouponType==CouponSettingType.Sale"
          >
            <el-col
              :span="3"
              style="width:94px"
            >类型：</el-col>
            <el-col :span="21">{{CouponSaleType.Types[Basic.CouponSaleType]}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >卡券名称：</el-col>
            <el-col :span="21">{{Basic.CouponName}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
              v-if="Basic.CouponType!=CouponSettingType.Sale"
            >投放时间：</el-col>
            <el-col
              :span="3"
              style="width:94px"
              v-else
            >销售日期：</el-col>
            <el-col :span="21">

              {{$options.filters.filterDate(Basic.Expireb)+'至'+(Basic.Expiree&&Basic.Expiree.substring(0,4)=='2100'? '长期':$options.filters.filterDate(Basic.Expiree))}}
            </el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
              v-if="Basic.CouponType!=CouponSettingType.Sale"
            >投放数量：</el-col>
            <el-col
              :span="3"
              style="width:94px"
              v-else
            >数量：</el-col>
            <el-col :span="21">{{Basic.GiveAmt==0?'不限':Basic.GiveAmt}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CouponType==CouponSettingType.Sale&&Basic.CouponSaleType == CouponSaleType.Online"
          >
            <el-col
              :span="3"
              style="width:94px"
            >销售限制：</el-col>
            <el-col :span="21">不限</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CouponType==CouponSettingType.Sale"
          >
            <el-col
              :span="3"
              style="width:94px"
            >销售价：</el-col>
            <el-col :span="21">{{$root.toFloat(Basic.SalePrice)}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >卡券面额：</el-col>
            <el-col :span="21">
              <el-table
                v-if="Basic.CouponType==CouponSettingType.Voucher && Basic.IsHistory == YNStatus.No"
                :data="Detail.CouponRanks"
              >
                <el-table-column
                  prop="MaxPrice"
                  label="消费金额满"
                >
                  <template slot-scope="scoped">{{$root.toFloat(scoped.row.CashPrice)+'元'}}</template>
                </el-table-column>
                <el-table-column
                  prop="Price1"
                  label="第1张金额（元）"
                >
                  <template slot-scope="scope">{{$root.toFloat(scope.row.Price1)}}</template>
                </el-table-column>
                <el-table-column
                  prop="Price2"
                  label="第2张金额（元）"
                >
                  <template slot-scope="scope">{{$root.toFloat(scope.row.Price2)}}</template>
                </el-table-column>
                <el-table-column
                  prop="Price3"
                  label="第3张金额（元）"
                >
                  <template slot-scope="scope">{{$root.toFloat(scope.row.Price3)}}</template>
                </el-table-column>
              </el-table>
              <div v-else>
                <span>{{GivePriceType.Types[Basic.GivePriceType]}}</span>
                <span v-if="Basic.GivePriceType == GivePriceType.Fixed&&Basic.EventType != EventType.Gifted">{{$root.toFloat(Basic.Price)}}元</span>
                <span v-if="Basic.GivePriceType == GivePriceType.Rate&&Basic.EventType != EventType.Gifted">{{$root.toFloat(Basic.Rate)}}倍</span>
              </div>
            </el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            v-if="Basic.EventType == EventType.Gifted"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >&nbsp;</el-col>
            <el-col :span="21">
              <p
                v-for="item in Detail.CouponRanks"
                :key="item.CashPrice"
              >消费满 {{$root.toFloat(item.CashPrice)}} 元，送 {{$root.toFloat(item.Price)}} 元</p>
            </el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            v-else-if="Basic.GivePriceType == GivePriceType.Random"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >&nbsp;</el-col>
            <el-col :span="21">
              <p
                v-for="item in Detail.CouponRanks"
                :key="item.CashPrice.value"
              >{{$root.toFloat(item.MinPrice)}} - {{$root.toFloat(item.MaxPrice)}} 元，占比 {{$root.toFloat(item.Weight*100) }} %</p>
            </el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="!/^(salecards)/.test(path)"
          >
            <el-col
              :span="3"
              style="width:94px"
            >赠送规则：</el-col>
            <el-col :span="21">
              <span>{{Basic.CouponType == CouponSettingType.Voucher&&Basic.IsHistory == YNStatus.No?'购买指定材质达指定金额自动赠送':EventType.Types[Basic.EventType]}}</span>
              <template v-if="Basic.EventType==EventType.RepeatedCount">累计购买{{Basic.Counts}}次或以上</template>
              <template v-if="Basic.EventType==EventType.Material||Basic.CouponType == CouponSettingType.Voucher&&Basic.IsHistory == YNStatus.No">（{{Basic.MaterialTypes}}）</template>
              <template v-if="(Basic.EventType==EventType.RepeatedBuy||Basic.EventType==EventType.RepeatedCount||Basic.EventType==EventType.Gifted||Basic.EventType==EventType.Material)&&Basic.CouponType == CouponSettingType.Universal">
                <div class="p-t-10">•全黄金订单 {{Basic.OrderRtype1 == YNStatus.Yes?'送券':'不送券'}}</div>
                <div class="p-t-10">•黄金+非素订单 {{Basic.OrderRtype2 == YNStatus.Yes?'送券':'不送券'}}</div>
                <div class="p-t-10">•单件非素订单 {{Basic.OrderRtype3 == YNStatus.Yes?'送券':'不送券'}}</div>
                <div class="p-t-10">•多件非素订单 {{Basic.OrderRtype4 == YNStatus.Yes?'送券':'不送券'}}</div>
              </template>
            </el-col>
          </el-row>

          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CouponType!=CouponSettingType.Sale"
          >
            <el-col
              :span="3"
              style="width:94px"
            >赠送限制：</el-col>
            <el-col :span="21">
              <span v-if="Basic.CouponType==CouponSettingType.Universal||Basic.CouponType==CouponSettingType.Voucher&&Basic.IsHistory == YNStatus.Yes">{{Basic.PerQty}} 张/人/次</span>
              <span v-if="(Basic.CouponType==CouponSettingType.Universal||Basic.CouponType==CouponSettingType.Voucher&&Basic.IsHistory == YNStatus.Yes)&&(Basic.EventType==EventType.RepeatedBuy||Basic.EventType==EventType.RepeatedCount||Basic.EventType==EventType.Material)">，</span>
              <span v-if="Basic.EventType==EventType.RepeatedBuy||Basic.EventType==EventType.RepeatedCount||Basic.EventType==EventType.Material">同一用户限赠次数：{{Basic.LimitCounts?Basic.LimitCounts+'次':'不限'}}</span>
            </el-col>
          </el-row>
          <!-- <el-row tag="li" type="flex" :gutter="10">
              <el-col :span="3" style="width:94px">赠送卡券：</el-col>
              <el-col :span="21">{{CardType.Types[Basic.CardType]}}</el-col>
          </el-row>-->
          <!-- <el-row tag="li" type="flex" :gutter="10">
              <el-col :span="3" style="width:94px">适用品类：</el-col>
              <el-col :span="21">{{Basic.MaterialTypes}}</el-col>
          </el-row>-->
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >适用及抵扣：</el-col>
            <el-col :span="21">
              <!-- <div v-if="Basic.DRateType==CardDRateType.Default">
                  <template v-if="Basic.CardType==CardType.Gond">黄金类{{Basic.MaxiRate1}}%，</template>非黄金类 {{Basic.MaxiRate2}}%
                </div>
                <div v-else>
                  <span v-for="(item, index) in Basic.ActicityRates" :key="item.MaterialType">{{`${MaterialType.Types[item.MaterialType]} ${item.Rate}%${index==Basic.ActicityRates.length-1?'':'，'}`}}</span>
              </div>-->
              <span
                v-for="(item,index) in Detail.CouponRates&&Detail.CouponRates.map(item=>({
                  CouponId: item.CouponId,
                  MaterialType: item.MaterialType,
                  Rate: $root.toFloat(item.Rate*100),
                  RateId: item.RateId
                }))"
                :key="index"
              >{{MaterialType.Types[item.MaterialType]}}{{item.Rate+'%'}}{{index==Detail.CouponRates.length-1?'':'，'}}</span>
            </el-col>
          </el-row>

          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >有效期：</el-col>
            <el-col :span="21">{{ExpireType.Types[Basic.ExpireType]}} {{Basic.ExpireType==ExpireType.Fixed?(Basic.ExpireDays + "天," + "领取后" + Basic.ActiveDays + "天生效"):($options.filters.filterDate(Basic.ExpireStart)+'至'+(Basic.ExpireStop&&Basic.ExpireStop.substring(0,4)=='2100'? '长期':$options.filters.filterDate(Basic.ExpireStop)))}}</el-col>
          </el-row>
          <!-- <el-row tag="li" type="flex" :gutter="10" v-if ="Basic.CouponType != CouponSaleType.Offline">
            <el-col :span="3" style="width:94px">到期提醒：</el-col>
            <el-col :span="21">
              到期前{{Basic.ExpiryDays}}天提醒
            </el-col>
          </el-row>-->
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >使用限制：</el-col>
            <el-col :span="21">{{Basic.RuleType==RuleType.Reached?('消费满'+$root.toFloat(Basic.RulePrice)+'元可用'):RuleType.Types[Basic.RuleType]}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CouponType==CouponSettingType.Voucher"
          >
            <el-col
              :span="3"
              style="width:94px"
            >使用送积分：</el-col>
            <el-col :span="21">{{Basic.IsGiveScore == YNStatus.Yes?`按被转赠人所获积分的${$root.toFloat(Basic.ScoreRate*100)}%赠送`:'不送积分'}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="/^(salecards)/.test(path)"
          >
            <el-col
              :span="3"
              style="width:94px"
            >绑定销售人员：</el-col>
            <el-col :span="21">{{YNStatus.Types[Basic.IsBindSale]}}</el-col>
          </el-row>
          <template v-if="Basic.IsBindSale == YNStatus.Yes">
            <el-row
              tag="li"
              type="flex"
              :gutter="10"
              v-if="/^(salecards)/.test(path)"
            >
              <el-col
                :span="3"
                style="width:94px"
              >销售人员：</el-col>
              <el-col :span="21">
                <el-table :data="Detail.CouponEmployees">
                  <el-table-column
                    prop="UserName"
                    label="员工姓名"
                  ></el-table-column>
                  <el-table-column
                    v-if="characterType==CharacterType.Company"
                    prop="StoreName"
                    label="门店名称"
                  ></el-table-column>
                  <el-table-column
                    v-if="Basic.CouponSaleType==CouponSaleType.Offline"
                    prop="SaleTarget"
                    label="目标张数"
                  ></el-table-column>
                  <el-table-column
                    v-if="Basic.CouponSaleType==CouponSaleType.Online"
                    prop="SaleCode"
                    label="销售代码"
                  ></el-table-column>
                  <el-table-column
                    v-if="Basic.CouponSaleType==CouponSaleType.Online"
                    prop="StoreName"
                    label="销售二维码"
                  >
                    <template slot-scope="scoped">
                      <el-button
                        name="btnGetSaleMan"
                        type="text"
                        size="mini"
                        @click="getSaleMan(scoped.row)"
                        :disabled="Basic.CheckStatus != CardAuditStatus.Audit"
                      >查看</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="Basic.CouponSaleType==CouponSaleType.Offline"
                    prop="SaleTarget"
                    label="查看编号"
                  >
                    <template>
                      <router-link
                        name="linkCheck"
                        :to="'/market/coupon/couponorderunlinelist/'+Basic.CouponId"
                      >查看</router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row
              tag="li"
              type="flex"
              :gutter="10"
              v-if="/^(salecards)/.test(path)"
            >
              <el-col
                :span="3"
                style="width:94px"
              >销售奖励：</el-col>
              <el-col :span="21">{{Basic.IsReward==YNStatus.Yes?'启用':'不启用'}}</el-col>
            </el-row>
            <el-row
              tag="li"
              type="flex"
              :gutter="10"
              v-if="/^(salecards)/.test(path)"
            >
              <el-col
                :span="3"
                style="width:94px"
              >奖励周期：</el-col>
              <!-- <el-col :span="21">{{dayjs(new Date(Basic.RewardStart)).format('YYYY-MM-DD')=='1900-01-01'?'不限周期':dayjs(new Date(Basic.RewardStart)).format('YYYY-MM-DD')+' ~ '+dayjs(new Date(Basic.RewardStop)).format('YYYY-MM-DD')}}</el-col> -->
              <el-col :span="21">{{Basic.RewardStart&&Basic.RewardStart.substring=='1900-01-01'?'不限周期':($options.filters.filterDate(Basic.RewardStart)+' ~ '+$options.filters.filterDate(Basic.RewardStop))}}</el-col>
            </el-row>
            <el-row
              tag="li"
              type="flex"
              :gutter="10"
              v-if="$route.path.split('/')[3]=='salecardsonlinebasic'||$route.path.split('/')[3]=='salecardsunlinebasic'||$route.path.split('/')[3]=='salecardslist'"
            >
              <el-col
                :span="3"
                style="width:94px"
              >奖励设置：</el-col>
              <el-col :span="21">
                <span>{{Basic.RewardType==CouponRewardType.Fixed?'固定奖励'+$root.toFloat(Basic.RewardPrice)+'元/张':'阶梯奖励'}}</span>
                <el-table
                  v-if="Basic.RewardType==CouponRewardType.Step"
                  :data="Detail.CouponSaleItems"
                  class="m-t-15"
                >
                  <el-table-column
                    label="销售数量"
                    prop="MinSale"
                  >
                    <template slot-scope="scoped">{{scoped.row.MinSale+'-'+scoped.row.MaxSale}}</template>
                  </el-table-column>
                  <el-table-column
                    label="奖励"
                    prop="Price"
                  >
                    <template slot-scope="scoped">{{$root.toFloat(scoped.row.Price)+'元 / 张'}}</template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </template>

          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >使用说明：</el-col>
            <el-col :span="21">
              <p
                v-html="Basic.CouponNote"
                style="word-break:break-all"
              ></p>
            </el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >状态：</el-col>
            <el-col :span="21">{{Basic.CheckStatus>5?'已终止':CardAuditStatus.Types[Basic.CheckStatus]}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
            v-if="Basic.CheckStatus==CardAuditStatus.Abandon"
          >
            <el-col
              :span="3"
              style="width:94px"
            >作废原因：</el-col>
            <el-col :span="21">{{Basic.CheckNote}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >创建人：</el-col>
            <el-col :span="21">{{Basic.CreateUser}}</el-col>
          </el-row>
          <el-row
            tag="li"
            type="flex"
            :gutter="10"
          >
            <el-col
              :span="3"
              style="width:94px"
            >创建时间：</el-col>
            <el-col :span="21">{{Basic.CreateTime | filterDate}}</el-col>
          </el-row>
        </ul>
      </el-col>
      <el-col :xl="8">
        <div
          v-if="Basic.CouponSaleType==CouponSaleType.Offline"
          class="excel-download"
        >
          <el-button
            name="btnDownloadExcel"
            type="text"
            :disabled="Basic.CheckStatus!=CardAuditStatus.Audit"
            @click="downloadExcel"
          >下载Excel</el-button>
          <p>下载卡券编号后，可用于纸质到实体卡券上。</p>
        </div>
        <div
          class="side-content coupon"
          v-if="Basic.CouponSaleType!=CouponSaleType.Offline"
        >
          <p class="fz-14 m-b-20 text-center">卡券样式</p>
          <div class="preview-coupon">
            <!-- <img
              :src="Basic.StyleImageUrl?DOMAIN_IMAGE+Basic.StyleImageUrl.replace('{0}','1080x0'):''"
              alt=""
            >-->
            <img
              :src="Basic.StyleImageUrl?$root.settings.DOMAIN_IMG_FILE+Basic.StyleImageUrl.replace('{0}','1080x0'):''"
              alt
            >
            <div class="coupon-item">
              <div class="top">
                <div class="logo">{{Basic.ShortName}}</div>
                <div class="rule">{{Basic.RuleType==RuleType.Reached?('消费满'+$root.toFloat(Basic.RulePrice)+'元可用'):RuleType.Types[Basic.RuleType]}}</div>
              </div>
              <div class="middle">
                <span v-if="Basic.GivePriceType==GivePriceType.Fixed">
                  <b style="font-size:16px">￥</b>
                  {{$root.toFloat(Basic.Price)}}
                </span>
                <span
                  v-else
                  style="font-size:20px"
                >{{GivePriceType.Types[Basic.GivePriceType]}}</span>
              </div>
              <div class="bottom">
                <div class="name">
                  <p>{{Basic.CouponName}}</p>
                  <p>xxxx-xx-xx - xxxx-xx-xx</p>
                </div>
                <div class="no">NO. xxxxxxxxxxxxxxxx</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="side-content m-t-10"
          v-if="Basic.EventType == EventType.Share||Basic.EventType==EventType.Included||(Detail.CouponEmployees&&Detail.CouponEmployees.length === 0 || !Detail.CouponEmployees)&&Basic.CouponSaleType==CouponSaleType.Online"
        >
          <div class="code">
            <p
              class="fz-14"
              v-if="(Detail.CouponEmployees&&Detail.CouponEmployees.length === 0 || !Detail.CouponEmployees)&&Basic.CouponType == CouponSettingType.Sale"
            >销售二维码</p>
            <p
              class="fz-14"
              v-else
            >卡券二维码</p>
            <div>
              <img
                ref="qrCode"
                :src="Detail.QrcodeUrl? ('data:image/jpeg;base64,'+ Detail.QrcodeUrl) : saleQrcode"
                alt
              >
              <p>
                <el-button
                  name="btnDownload"
                  type="primary"
                  @click="download"
                >下载二维码</el-button>
              </p>
              <a ref="download"></a>
              <dl>
                <dt>二维码使用说明：</dt>
                <dd>举行活动时，在确认客户转发朋友圈后，邀请客户扫描该二维码领取赠送的卡券。</dd>
                <dd>若无法保存，请点击鼠标右键，选择图片另存为！</dd>
              </dl>
            </div>
            <!-- <div v-else style="border:1px #ddd solid;width:150px;height:150px;text-align:center;line-height: 150px;margin:10px auto;background-color: #fff">
              未生成二维码
            </div>-->
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="销售二维码"
      :visible.sync="dialogQrcode"
      width="500px"
      @open="getSaleQrcode"
    >
      <div
        style="text-align:center"
        v-loading="dialogLoading"
      >
        <img
          :src="saleQrcode"
          alt
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  SCORING_API_COUPON_ORDER_ORDERLISTEXPORT3, // 纸质优惠券(导出)
  SCORING_API_COUPON_BASIC_GET, // 优惠券 - 加载
  SCORING_API_COUPON_BASIC_GETSALEQRCODE // 优惠券 - 获取员工销售二维码
} from '@/apis/scoring'

import { YNStatus, CharacterType } from '@/enums/common'
import {
  CardType,
  EventType,
  GivePriceType,
  ExpireType,
  RuleType,
  CardAuditStatus,
  CardDRateType,
  CouponSettingType,
  CouponSaleType,
  CouponRewardType,
  CouponStatus
} from '@/enums/scoring'
import { MaterialType } from '@/enums/marketing'

import { DOMAIN_IMAGE } from '@/configs/appSettings.js'

export default {
  data() {
    return {
      CouponRewardType,
      CouponStatus,
      CouponSettingType,
      path: this.$route.path.split('/')[3],
      DOMAIN_IMAGE,
      Basic: {},
      Detail: {},
      CardType,
      activeIndex: '1',
      EventType,
      ExpireType,
      RuleType,
      GivePriceType,
      CardAuditStatus,
      CardDRateType,
      MaterialType,
      dayjs,
      loading: true,
      storeName: JSON.parse(sessionStorage.getItem('userDetail'))
        ? JSON.parse(sessionStorage.getItem('userDetail')).CharacterName
        : '',
      YNStatus,
      CouponSaleType,
      CharacterType,
      dialogQrcode: false,
      saleMan: {
        SaleCode: '',
        UserName: '',
        CouponId:
          (this.$route.params.id && this.$route.params.id.split('&')[0]) ||
          (this.CouponId && this.CouponId.split('&')[0])
      },
      saleQrcode: '',
      dialogLoading: false
    }
  },
  props: {
    CouponId: {
      type: [Number, String]
    }
  },
  mounted() {
    // this.getEnums()
    this.getDetail(this.CouponId)
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    downloadExcel() {
      SCORING_API_COUPON_ORDER_ORDERLISTEXPORT3({
        CouponId: this.$route.params.id && this.$route.params.id.split('&')[0]
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    getDetail(id) {
      this.loading = true
      SCORING_API_COUPON_BASIC_GET({
        CouponId: id
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.Detail = res.data.Data
            this.Basic = res.data.Data.Basic
            const MaterialTypes = res.data.Data.Basic.MaterialTypes.split(',')
            this.Basic.MaterialTypes = []
            MaterialTypes.forEach(m => {
              this.Basic.MaterialTypes.push(MaterialType.Types[m])
            })
            this.Basic.MaterialTypes = this.Basic.MaterialTypes.join('，')
            /* this.Basic.Expireb = dayjs(new Date(this.Basic.Expireb)).format(
              'YYYY-MM-DD'
            )
            this.Basic.Expiree =
              this.Basic.Expiree.substring(0, 4) == '2100'
                ? '长期'
                : dayjs(new Date(this.Basic.Expiree)).format('YYYY-MM-DD')
            this.Basic.ExpireStart = dayjs(
              new Date(this.Basic.ExpireStart)
            ).format('YYYY-MM-DD')
            this.Basic.ExpireStop =
              this.Basic.ExpireStop.substring(0, 4) == '2100'
                ? '长期'
                : dayjs(new Date(this.Basic.ExpireStop)).format('YYYY-MM-DD') */
            this.Basic.CouponNote = this.Basic.CouponNote.replace(
              /\n\r?/g,
              '<br>'
            )
            this.loading = false
            return res.data.Data
          }
        })
        .then(detail => {
          if (
            (detail.CouponEmployees && detail.CouponEmployees.length === 0) ||
            !detail.CouponEmployees
          ) {
            this.getSaleQrcode()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    download() {
      let canvas = document.createElement('canvas')
      canvas.width = this.$refs.qrCode.width
      canvas.height = this.$refs.qrCode.height
      canvas.getContext('2d').drawImage(this.$refs.qrCode, 0, 0)
      this.$refs.download.href = canvas.toDataURL('image/png')
      this.$refs.download.download = 'qrCode.png'
      this.$refs.download.click()
    },
    getSaleMan(row) {
      // 获取销售二维码参数
      this.dialogQrcode = true
      this.saleMan.SaleCode = row.SaleCode
      this.saleMan.UserName = row.UserName
    },
    getSaleQrcode() {
      this.dialogLoading = true
      SCORING_API_COUPON_BASIC_GETSALEQRCODE(this.saleMan).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.saleQrcode = 'data:image/jpeg;base64,' + res.data.Data.QrcodeUrl
        }
        this.dialogLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.excel-download {
  line-height: 1.5;
  padding: 100px 20px;
  background: url('~@/assets/images/excel.png') no-repeat center 20px;
  border: 1px #e5e5e5 solid;
  text-align: center;
}
.code {
  text-align: center;
  line-height: 1.5;
  dl {
    text-align: left;
  }
}

.side-content {
  position: relative;
  padding: 20px;
  border: 1px #ddd solid;
  background-color: #f5f5f5;
  overflow: hidden;
  &.coupon {
    height: 200px;
  }
  .preview-coupon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    height: 150px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
    }
    .coupon-item {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      color: #fff;
      .top {
        padding: 10px;
        display: flex;
        justify-content: space-between;

        .logo {
          position: relative;
          padding-left: 22px;
          width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 18px;
            height: 13px;
            background: url(/static/images/coupon_icon.png) no-repeat;
            background-size: cover;
          }
        }
      }
      .middle {
        padding: 17px 10px;
        font-size: 40px;
        text-align: right;
      }
      .bottom {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
        p:last-child {
          color: #999;
        }
        .no {
          color: #999;
        }
      }
    }
  }
}

.detail-list {
  line-height: 1.8;
  font-size: 12px;
  li {
    padding: 5px 0;
  }
}
</style>

<template>
  <div class="content">
    <div class="el-table tables el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition f12">
      <div class="el-table__body-wrapper" style="overflow-x: auto;">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
          <tbody>
            <tr class="el-table__row">
              <td class="label tit">
                <div class="cell tit required m-l-5">卡券样式</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-button @click="ticketChoose">选择</el-button>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">卡券名称</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-input class="m-r-5" :maxlength="8" v-model="cardFrom.TicketName" style="width: 220px!important;" placeholder="输入卡券名称"></el-input>
                  <span>2-8个汉子或等量字符</span>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">投放日期</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-date-picker v-model="cardFrom.CreateTime" :unlink-panels="true" style="width: 220px!important;" type="daterange"></el-date-picker>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">投放数量</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-input
                    class="m-r-5"
                    :disabled="checked"
                    v-model="cardFrom.PrepareQty"
                    :maxlength="8"
                    @keyup.native="cardFrom.PrepareQty = $root.toFixed(cardFrom.PrepareQty, 0)"
                    style="width: 220px!important;"
                    placeholder
                  ></el-input>
                  <span class="m-r-5">张</span>
                  <el-checkbox v-model="checked">不限</el-checkbox>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell">卡券类型</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-radio-group v-model="cardFrom.TicketType">
                    <template v-for="(item, index) in ticketBasicTicketType.Types">
                      <el-radio :label="parseInt(index)" :key="index">{{item}}</el-radio>
                    </template>
                  </el-radio-group>
                </div>
              </td>
            </tr>
            <tr class="el-table__row" v-if="cardFrom.TicketType == ticketBasicTicketType.Gift">
              <td class="label">
                <div class="cell required m-l-5">赠送数量</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-input class="m-r-5" v-model="cardFrom.GiftPerQty" style="width: 220px!important;" placeholder="输入卡券名称"></el-input>
                  <span class="m-r-5">张/人/次，同一用户限赠送次数</span>
                  <el-select class="m-r-5" name="State" v-model="cardFrom.GiftMaxQty" style="width: 100px!important;" placeholder="全部">
                    <el-option label="不限" :value="'0'"></el-option>
                    <el-option v-for="item in 20" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                  <span>次</span>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">卡券面额</div>
              </td>
              <td class="value">
                <div class="cell">
                  <template v-if="cardFrom.TicketType == ticketBasicTicketType.Gift">
                    <div class="m-t-5">
                      <el-radio-group v-model="cardFrom.GiftValType">
                        <template v-for="(item, index) in ticketBasicGiftValType.Types">
                          <el-radio :label="parseInt(index)" :key="index">{{item}}</el-radio>
                        </template>
                      </el-radio-group>
                    </div>
                    <div v-if="cardFrom.GiftValType == ticketBasicGiftValType.Fixed" class="m-t-5">
                      <!--固定金额-->
                      <el-input class="m-r-5" v-model="cardFrom.GiftValPrice" style="width: 220px!important;" placeholder="输入金额"></el-input>
                      <span>元</span>
                    </div>
                    <!--随机金额-->
                    <template v-else v-for="(item, index) in randomPrices">
                      <div :key="index" class="m-t-5">
                        <el-input class="m-r-5" v-model="item.MinPrice" style="width: 100px!important;" placeholder="输入金额"></el-input>
                        <span class="m-r-5">~</span>
                        <el-input class="m-r-5" v-model="item.MaxPrice" style="width: 100px!important;" placeholder="输入金额"></el-input>
                        <span class="m-r-5">元，数量</span>
                        <el-input class="m-r-5" v-model="item.PrepareQty" style="width: 80px!important;" placeholder="输入数量"></el-input>
                        <span class="m-r-5">张</span>
                        <i class="icon-add text-btn m-r-5 random-add" v-if="index == randomPrices.length - 1" @click="addRandomPrice"></i>
                        <i class="icon-reduce red random-add" v-if="index" @click="delRandomPrice(index)"></i>
                      </div>
                    </template>
                  </template>

                  <div v-else>
                    <!--固定金额-->
                    <el-input class="m-r-5" v-model="cardFrom.GiftValPrice" style="width: 220px!important;" placeholder="输入金额"></el-input>
                    <span>元</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="el-table__row" v-if="cardFrom.TicketType == ticketBasicTicketType.Sale">
              <td class="label">
                <div class="cell required m-l-5">销售价</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-input class="m-r-5" v-model="cardFrom.SalePrice" style="width: 220px!important;" placeholder="输入销售价"></el-input>
                  <span>元</span>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">适用及抵扣</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-button @click="ticketChoose">设置</el-button>
                  <p>sdjsa;djsa;ldjk;slakd;sakd;lsakd;lksa;dlksa;ldk;salkd;aslkd;lsak</p>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">有效期</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-input class="m-r-5" v-model="cardFrom.ExpireDays" style="width: 100px!important;" placeholder="输入有效期"></el-input>
                  <span class="m-r-5">天，领取后</span>
                  <el-input class="m-r-5" v-model="cardFrom.ActiveDays" style="width: 100px!important;" placeholder="输入生效天数"></el-input>
                  <span class="m-r-5">天生效</span>
                  <span>（0表时即时生效，最长不能超过30天）</span>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">到期提醒</div>
              </td>
              <td class="value">
                <div class="cell">
                  <span class="m-r-5">到期前</span>
                  <el-input class="m-r-5" v-model="cardFrom.TipsDays" style="width: 100px!important;" placeholder="输入生效天数"></el-input>
                  <span class="m-r-5">天提示</span>
                  <span>填0表示到期当天提醒。</span>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell">使用限制</div>
              </td>
              <td class="value">
                <div class="cell">
                  <el-select class="m-r-5" name="State" v-model="cardFrom.RuleType" style="width: 220px!important;" placeholder="全部">
                    <el-option label="无门槛无低消" :value="ticketBasicRuleType.None"></el-option>
                    <el-option label="消费满指定金额可用" :value="ticketBasicRuleType.Full"></el-option>
                  </el-select>
                  <template v-if="cardFrom.RuleType == ticketBasicRuleType.Full">
                    <span class="m-r-5">消费满</span>
                    <el-input class="m-r-5" v-model="cardFrom.RulePrice" @keyup.native="cardFrom.RulePrice = $root.toFixed(cardFrom.RulePrice)" style="width: 100px!important;" placeholder="输入生效天数"></el-input>
                    <span>元可用</span>
                  </template>
                </div>
              </td>
            </tr>
            <tr class="el-table__row">
              <td class="label">
                <div class="cell">使用说明</div>
              </td>
              <td class="value">
                <div class="cell">
                  <textarea name="usemessage" id cols="90" rows="5" v-model="cardFrom.TicketNote"></textarea>
                  <span :class="{red: cardFrom.TicketNote.length > 300}">{{(cardFrom.TicketNote.length||0) + '/' + 300}}</span>
                </div>
              </td>
            </tr>

            <tr class="el-table__row">
              <td class="label">
                <div class="cell required m-l-5">适用门店</div>
              </td>
              <td class="value">
                <div class="cell">
                  <div>
                    <el-button @click="storeChooseVisible = true">选择门店</el-button>
                  </div>
                  <el-table class="m-t-5" :data="adressData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="门店编码" min-width="120" fixed></el-table-column>
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="门店名称" min-width="120" fixed></el-table-column>
                    <el-table-column show-overflow-tooltip prop="TicketCode" label="地区" min-width="220" fixed></el-table-column>
                  </el-table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="buttons">
      <el-button name="createCompany" type="primary" @click="createCard" :loading="$store.getters.is_loading">保存</el-button>
      <el-button name="cancel" @click="$router.push({path: '/alliance/allianceCardManage/index'})" :loading="$store.getters.is_loading">取消</el-button>
    </div>

    <select-store :visible.sync="storeChooseVisible" @listenSelectStore="listenSelectStore"></select-store>
  </div>
</template>

<script>
import { TicketBasicTicketType, TicketBasicGiftValType, TicketBasicRuleType } from '@/enums/alliance'
import selectStore from '@/components/alliance/selectStore'
export default {
  data() {
    return {
      ticketBasicRuleType: TicketBasicRuleType,
      ticketBasicGiftValType: TicketBasicGiftValType,
      ticketBasicTicketType: TicketBasicTicketType,
      ticketVisible: false,
      storeChooseVisible: false,
      adressData: [],
      randomPrices: [
        {
          MinPrice: 1,
          MaxPrice: 2,
          PrepareQty: 3
        }
      ],
      checked: null,
      cardFrom: {
        StyleId: '',
        TicketName: '',
        RuleType: '',
        RulePrice: '',
        Expireb: '',
        Expiree: '',
        PrepareQty: '',
        GiftMaxQty: '',
        GiftPerQty: '',
        GiftValType: TicketBasicGiftValType.Fixed,
        GiftValPrice: '',
        GiftVprices: '',
        SaleValPrice: '',
        SalePrice: '',
        Rates: '',
        Scopes: '',
        ActiveDays: '',
        ExpireDays: '',
        TipsDays: '',
        TicketNote: '451435432132543',
        TicketType: parseInt(TicketBasicTicketType.Gift)
      }
    }
  },
  methods: {
    createCard() {
    },
    cancel() {
    },
    addRandomPrice() {
      this.randomPrices.push({
        MinPrice: 1,
        MaxPrice: 2,
        PrepareQty: 3
      })
    },
    delRandomPrice(index) {
      this.randomPrices.splice(index, 1)
    },
    ticketChoose() {
      console.log(2222)
      this.ticketVisible = true
    },
    // 修改图片
    uploadSucc(ImageUrl) {
      this.cardFrom.ImageUrl = ImageUrl
    },
    listenSelectStore(row) {
      console.log(row)
    }
  },
  components: {
    selectStore
  }
}
</script>
<style lang="scss" scoped>
.label {
  width: 120px;
  background-color: #f5f5f5;
}
.f12 {
  font-size: 12px;
}
.random-add {
  font-size: 22px;
  vertical-align: middle;
}
</style>


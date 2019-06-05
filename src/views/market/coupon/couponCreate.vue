<template>
  <div class="content">
    <!-- <div class="title"> 新建卡券 </div> -->
    <div class="content-view border-1px">
      <el-form
        :model="formInline"
        class="form fix-w"
        ref="formInline"
        :rules="rules"
        label-width="20px"
      >
        <table class="table-box-border">
          <tr>
            <td>
              <span class="require">*</span>卡券样式</td>
            <td>
              <el-form-item>
                <el-button
                  name="btnGetStyleImageList"
                  type="primary"
                  class="m-t-25"
                  @click="getStyleImageList"
                >选择</el-button>
                <div class="img-box m-y-10">
                  <img
                    v-if="formInline.StyleImageUrl"
                    :src="$root.settings.DOMAIN_IMG_FILE + formInline.StyleImageUrl"
                    alt=""
                  >
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>卡券名称</td>
            <td>
              <el-form-item
                label=""
                prop="CouponName"
                :show-message="false"
              >
                <el-input
                  name="inputCouponName"
                  v-model="formInline.CouponName"
                  class="w-312"
                  placeholder="输入卡券名称"
                  maxlength="8"
                ></el-input>
                <span class="font-dec m-l-10">2-8个字</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>投放时间</td>
            <td>
              <el-form-item>
                <el-form-item
                  name="datePickerExpireb"
                  v-show="UnSection"
                  prop="Expireb"
                  style="display:inline-block"
                  :rules="[{required: UnSection, message: '不能为空'}]"
                  :show-message="false"
                >
                  <el-date-picker
                    v-model="formInline.Expireb"
                    type="date"
                    :editable="false"
                    placeholder="选择开始日期"
                    class="w-312"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions1"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item
                  name="datePickerSection"
                  v-show="!UnSection"
                  style="display:inline-block"
                  :rules="[{required: !UnSection, message: '不能为空',trigger: 'change' }]"
                  :show-message="false"
                >
                  <el-date-picker
                    :editable="false"
                    v-model="section"
                    @change="SetSectionDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions1"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item style="display:inline-block">
                  <el-checkbox
                    name="checkboxUnSection"
                    v-model="UnSection"
                    @change="ReseActivityTime"
                    class="m-l-10"
                  >不限结束日期</el-checkbox>
                </el-form-item>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>投放数量</td>
            <td>
              <el-form-item
                label=""
                prop="GiveAmt"
                :rules="!isNotLimit?[
          { required: true, message: '请输入赠送数量', trigger:'blur' },
          { validator: $route.path=='/market/coupon/giftcouponcreate'?this.voucherGiveAmtValid:this.giveAmtValid }]:[{required:false}]"
                :show-message="false"
              >
                <el-input
                  name="inputGiveAmt"
                  v-model="formInline.GiveAmt"
                  style="max-width:312px"
                  placeholder="请输入赠送数量"
                  :disabled="isNotLimit"
                >
                  <span slot="append">张</span>
                </el-input>
                <el-checkbox
                  name="checkboxIsNotLimit"
                  v-model="isNotLimit"
                  style="margin-left: 10px"
                >不限</el-checkbox>
                <span style="margin-left:10px; color:#777">投放数量有限时，送完即止，若要长期赠送，请选择【不限】</span>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <span class="require">*</span>卡券类型</td>
            <td>
              <el-form-item prop="CouponType" :show-message="false">
                <el-select v-model="formInline.CouponType" @change="getCouponTypeName" placeholder="请选择">
                  <el-option v-for="item in couponTypeList" :key="item.Value" :label="item.Name" :value="item.Value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr> -->
          <tr>
            <td>
              <span class="require">*</span>赠送规则</td>
            <td>
              <el-form-item
                class="give-style"
                :show-message="false"
                v-if="$route.path!='/market/coupon/giftcouponcreate'"
              >
                <el-select
                  name="selcetEventType"
                  class="w-312"
                  @change="ExChangeEventType"
                  v-model="formInline.EventType"
                >
                  <el-option
                    v-for="item in EventTypeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span
                  v-if="formInline.EventType==EventType.FirstAttention"
                  class="font-dec"
                >&nbsp;&nbsp;仅限首次关注公众号时赠送，取消再次关注不再赠送</span>
                <span
                  v-if="formInline.EventType==EventType.RepeatedBuy"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放期内重复消费成功按单赠送，可自定义同一用户赠送次数</span>
                <span
                  v-if="formInline.EventType==EventType.RepeatedCount"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放期内累计购买达到指定次数按单赠送，可自定义同一用户赠送次数</span>
                <span
                  v-if="formInline.EventType==EventType.Gifted"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放内消费达到指定金额按单赠送，不限赠送次数</span>
                <span
                  v-if="formInline.EventType==EventType.Material"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放期内购买指定材质商品数赠送，可自定义同一用户赠送次数</span>
                <span
                  v-if="formInline.EventType==EventType.Share"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放期内，分享指定内容手动按次赠送，不限赠送次数</span>
                <span
                  v-if="formInline.EventType==EventType.Included"
                  class="font-dec"
                >&nbsp;&nbsp;卡券投放期内，参与指定活动手动按次赠送，不限赠送次数</span>
                <!-- <span v-if="formInline.EventType==EventType.Share" class="font-dec">&nbsp;&nbsp;卡券投放期内， 选择指定客户手动按次赠送，不限赠送次数</span> -->
                <span
                  class="show-give-style"
                  @click="dialogVisible = true"
                >查看赠送规则</span>
              </el-form-item>
              <el-form-item>
                <p v-if="formInline.CouponType==CouponSettingType.Voucher">购买指定材质达指定金额自动赠送 <span class="font-dec m-l-10">卡券投放期内购买指定材质商品数赠送，可自定义同一用户赠送次数</span></p>
                <div
                  key="EventType.Material"
                  v-if="formInline.EventType==EventType.Material||$route.path=='/market/coupon/giftcouponcreate'"
                >
                  <el-form-item
                    prop="MaterialTypes"
                    :show-message="true"
                    class="material"
                  >
                    <el-checkbox-group
                      name="checkboxGroupRuleGiveMaterial"
                      v-model="ruleGiveMaterial"
                      @change="getMaterialTypes"
                    >
                      <el-checkbox
                        v-for="item in materialList"
                        :key="item.MaterialType"
                        :label="item.MaterialType"
                        style="margin-left:0;padding: 0 10px 0 0"
                      >{{materialType.Types[item.MaterialType]}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                <div
                  key="EventType.RepeatedCount"
                  class="give-style"
                  v-if="formInline.EventType==EventType.RepeatedCount"
                >
                  <el-form-item
                    prop="Counts"
                    :show-message="false"
                  >
                    <el-input
                      name="inputCounts"
                      v-model="formInline.Counts"
                      style="width:400px !important"
                    >
                      <template slot="prepend">活动期间，累计购买</template>
                      <template slot="append">次或以上</template>
                    </el-input>
                  </el-form-item>
                </div>
                <div
                  key="EventType.RepeatedBuy"
                  v-if="$route.path=='/market/coupon/couponcreate'&&(formInline.EventType==EventType.RepeatedBuy||formInline.EventType==EventType.RepeatedCount||formInline.EventType==EventType.Gifted||formInline.EventType==EventType.Material)"
                >
                  <p class="font-dec">赠送设置：（请设置订单内包含不同材质的多件或单商品时是否送券）</p>
                  <el-row
                    type="flex"
                    class="m-b-10"
                  >
                    <el-col>
                      <el-form-item
                        label="全黄金订单"
                        prop="OrderRtype1"
                        label-width="72px"
                      >
                        <el-select
                          name="selectOrderRtype1"
                          v-model="formInline.OrderRtype1"
                        >
                          <el-option
                            v-for="(item,key) in YNStatus.Types"
                            :key="key"
                            :label="key==YNStatus.Yes?'送券':'不送券'"
                            :value="parseInt(key)"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item
                        label=" 黄金+非素订单"
                        prop="OrderRtype2"
                        label-width="91px"
                      >
                        <el-select
                          name="selectOrderRtype2"
                          v-model="formInline.OrderRtype2"
                        >
                          <el-option
                            v-for="(item,key) in YNStatus.Types"
                            :key="key"
                            :label="key==YNStatus.Yes?'送券':'不送券'"
                            :value="parseInt(key)"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item
                        label="单件非素订单"
                        prop="OrderRtype3"
                        label-width="86px"
                      >
                        <el-select
                          name="selectOrderRtype3"
                          v-model="formInline.OrderRtype3"
                        >
                          <el-option
                            v-for="(item,key) in YNStatus.Types"
                            :key="key"
                            :label="key==YNStatus.Yes?'送券':'不送券'"
                            :value="parseInt(key)"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item
                        label="多件非素订单"
                        prop="OrderRtype4"
                        label-width="85px"
                      >
                        <el-select
                          name="selectOrderRtype4"
                          v-model="formInline.OrderRtype4"
                        >
                          <el-option
                            v-for="(item,key) in YNStatus.Types"
                            :key="key"
                            :label="key==YNStatus.Yes?'送券':'不送券'"
                            :value="parseInt(key)"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>卡券面额</td>
            <td>
              <template v-if="formInline.EventType!=EventType.Gifted&&$route.path!='/market/coupon/giftcouponcreate'">
                <el-form-item
                  label=""
                  required
                >
                  <el-radio-group
                    name="radioGroupGivePriceType"
                    v-model="formInline.GivePriceType"
                  >
                    <template v-for="(item, index) in GivePriceTypeOpt">
                      <el-radio
                        :key="item.value"
                        :label="item.value"
                        v-if="index!=GivePriceTypeOpt.length-1||formInline.EventType!=1&&formInline.EventType!=7&&formInline.EventType!=9&&formInline.EventType!=13&&formInline.EventType!=15"
                      >{{item.label}}</el-radio>
                    </template>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  key="GivePriceType.Fixed"
                  v-if="formInline.GivePriceType==GivePriceType.Fixed"
                >
                  <el-form-item
                    prop="Price"
                    :rules="[{required: true, message: '不能为空'},{validator:MustNumber}]"
                    :show-message="false"
                  >
                    <el-input
                      name="inputPrice"
                      class="w-312"
                      v-model="formInline.Price"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item
                  key="GivePriceType.Random"
                  v-else-if="formInline.GivePriceType==GivePriceType.Random"
                  style="min-width:800px;width:60%"
                >
                  <ul
                    style="margin-bottom:10px;display:flex;"
                    v-for="(Ranks,index) in formInline.Ranks"
                    :key="index"
                  >
                    <li>
                      <el-form-item
                        :prop="'Ranks.' + index + '.MinPrice'"
                        :rules="[{required: formInline.GivePriceType==GivePriceType.Random?true:false, message: '不能为空'},{validator:MustNumber}]"
                        :show-message="false"
                      >
                        <el-input
                          name="inputMinPrice"
                          v-model="Ranks.MinPrice"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </li>
                    <li class="p-x-10">-</li>
                    <li>
                      <el-form-item
                        :prop="'Ranks.' + index + '.MaxPrice'"
                        :rules="[{required: formInline.GivePriceType==GivePriceType.Random?true:false, message: '不能为空'},{validator:MustNumber}]"
                        :show-message="false"
                      >
                        <el-input
                          name="inputMaxPrice"
                          v-model="Ranks.MaxPrice"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </li>
                    <li class="p-l-10">
                      <el-form-item
                        :prop="'Ranks.' + index + '.Weight'"
                        :rules="[{required: formInline.GivePriceType==GivePriceType.Random?true:false, message: '不能为空'},{validator:MaxiRateValidator}]"
                        :show-message="false"
                      >
                        <el-input
                          name="inputWeight"
                          v-model="Ranks.Weight"
                        >
                          <template slot="prepend">占比</template>
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                    </li>
                    <li class="p-l-10">
                      <img
                        src="/static/images/icon-4.png"
                        v-if="index!=0"
                        @click="delRandom(Ranks)"
                        style="vertical-align:middle;cursor:pointer;margin-right:10px"
                        alt=""
                      >
                      <img
                        src="/static/images/icon-5.png"
                        v-if="index == formInline.Ranks.length - 1"
                        @click="addRandom"
                        style="vertical-align:middle;cursor:pointer;"
                        alt=""
                      >
                    </li>
                  </ul>
                </el-form-item>
                <el-form-item
                  key="GivePriceType.Rate"
                  v-else
                >
                  <el-form-item
                    prop="Rate"
                    :rules="[{required: true, message: '不能为空'},{validator:twoNumber}]"
                    :show-message="false"
                  >
                    <el-input
                      name="inputRate"
                      v-model="formInline.Rate"
                      style="width:400px !important"
                    >
                      <template slot="append">倍(按客户购买商品金额的倍率赠送)</template>
                    </el-input>
                  </el-form-item>
                </el-form-item>
              </template>
              <el-form-item
                v-if="formInline.EventType==EventType.Gifted||$route.path=='/market/coupon/giftcouponcreate'"
                label=""
                required
              >
                <div class="card-price-box">
                  <div class="price-list">
                    <el-row
                      type="flex"
                      class="price-split"
                      :gutter="10"
                      v-for="(Ranks,index) in formInline.Ranks"
                      :key="index"
                    >
                      <el-col
                        :span="4"
                        style="min-width: 240px"
                      >
                        <el-form-item
                          :prop="'Ranks.'+index+'.CashPrice'"
                          :rules="[{required: formInline.EventType==EventType.Gifted?true:false, message: '不能为空'},{validator:MustNumber}]"
                          :show-message="false"
                        >
                          <el-input
                            name="inputCashPrice"
                            v-model="Ranks.CashPrice"
                            placeholder="请输入金额"
                          >
                            <template slot="prepend">消费满 </template>
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col
                        v-if="$route.path == '/market/coupon/couponcreate'"
                        :span="4"
                        style="min-width: 240px"
                      >
                        <el-form-item
                          :prop="'Ranks.'+index+'.Price'"
                          :rules="[{required: formInline.EventType==EventType.Gifted?true:false, message: '不能为空'},{validator:MustNumber}]"
                          :show-message="false"
                        >
                          <el-input
                            name="inputPrice"
                            v-model="Ranks.Price"
                            placeholder="请输入金额"
                          >
                            <template slot="prepend">赠送</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="4"
                        v-if="$route.path == '/market/coupon/giftcouponcreate'"
                      >
                        <el-form-item
                          :prop="'Ranks.'+index+'.Price1'"
                          :rules="[{required: true, message: '不能为空'},{validator:twoNumber}]"
                          :show-message="false"
                        >
                          <el-input
                            name="inputPrice1"
                            v-model="Ranks.Price1"
                            placeholder="第一张金额"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="4"
                        v-if="$route.path == '/market/coupon/giftcouponcreate'"
                      >
                        <el-form-item
                          :prop="'Ranks.'+index+'.Price2'"
                          :rules="[{required: Ranks.Price3!== null?true:false, message: '不能为空'},{validator:twoNumberOther}]"
                          :show-message="false"
                        >
                          <el-input
                            name="inputPrice2"
                            v-model="Ranks.Price2"
                            placeholder="第二张金额"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="4"
                        v-if="$route.path == '/market/coupon/giftcouponcreate'"
                      >
                        <el-form-item
                          :prop="'Ranks.'+index+'.Price3'"
                          :rules="[{required: false, message: '不能为空'},{validator:twoNumberOther}]"
                          :show-message="false"
                        >
                          <el-input
                            name="inputPrice3"
                            v-model="Ranks.Price3"
                            placeholder="第三张金额"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col
                        tag="div"
                        :span="2"
                      >
                        <img
                          src="/static/images/icon-4.png"
                          v-if="index!=0"
                          @click="delQuota(Ranks)"
                          style="vertical-align: middle;cursor:pointer;margin-right:5px"
                          alt=""
                        />
                        <img
                          src="/static/images/icon-5.png"
                          v-if="index == formInline.Ranks.length - 1"
                          @click="addQuota"
                          style="vertical-align: middle;cursor:pointer"
                          alt=""
                        />
                      </el-col>
                    </el-row>
                  </div>

                  <div
                    class="voucher-tip"
                    v-if="$route.path == '/market/coupon/giftcouponcreate'"
                  >
                    <p>1、最多送三张</p>
                    <p>2、阶梯有填，赠送金额第1张就必填，赠送需按1-3依次填写，不能间隔填写</p>
                    <p>3、默认3级阶梯，最多加到6级</p>
                  </div>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>赠送限制</td>
            <td>
              <el-form-item
                class="give-style"
                label=""
                prop="PerQty"
                :show-message="false"
              >
                <el-input
                  name="inputPerQty"
                  v-if="$route.path!=='/market/coupon/giftcouponcreate'"
                  v-model="formInline.PerQty"
                  class="w-312"
                >
                  <template slot="append">
                    张/人/次
                  </template>
                </el-input>
                <i v-if="!disableLimitCounts||$route.path=='/market/coupon/giftcouponcreate'">
                  <span class="font-dec">&nbsp;&nbsp;同一用户限赠次数&nbsp;&nbsp;</span>
                  <el-select
                    name="selectLimitCounts"
                    class="w-80"
                    v-model="formInline.LimitCounts"
                    :disabled="$route.path=='/market/coupon/giftcouponcreate'?false:disableLimitCounts"
                  >
                    <el-option
                      v-for="item in NumCounts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <span class="font-dec">&nbsp;&nbsp;次</span>
                </i>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>适用及抵扣</td>
            <td>
              <el-form-item>
                <el-button
                  name="btnSet"
                  class="m-y-6"
                  @click="dialogapply = true"
                  type="primary"
                >设置</el-button>
                <p>
                  <span
                    v-for="(item,index) in formInline.Rates"
                    :key="index"
                  >{{MaterialType.Types[item.MaterialType]}}{{$root.toFloat(item.Rate*100)}}%{{index==formInline.Rates.length-1?'':'，'}}</span>
                </p>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>有效期</td>
            <td>
              <el-form-item
                label=""
                required
              >
                <el-radio
                  name="radioExpireType"
                  v-model="formInline.ExpireType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="ExpireType.Fixed"
                  class="m-r-10"
                >固定有效期</el-radio>
                <el-form-item
                  style="display:inline-block"
                  prop="ExpireDays"
                  :rules="formInline.ExpireType==ExpireType.Fixed?[{required: true, message: '不能为空'},{validator:daysValid}]:[{required: false}]"
                  :show-message="false"
                >
                  <el-input
                    name="inputExpireDays"
                    style="max-width:150px"
                    :disabled="formInline.ExpireType==ExpireType.Designated?true:false"
                    v-model="formInline.ExpireDays"
                    class="m-r-10"
                  >
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  style="display:inline-block"
                  prop="ActiveDays"
                  :rules="[{required: formInline.ExpireType==ExpireType.Fixed?true:false, message: '不能为空'},{validator:ActiveDaysValidate}]"
                  :show-message="false"
                >
                  <el-input
                    name="inputActiveDays"
                    style="width:480px!important "
                    :disabled="formInline.ExpireType==ExpireType.Designated?true:false"
                    v-model="formInline.ActiveDays"
                  >
                    <template slot="prepend">领取后</template>
                    <template slot="append">天生效，填0表示即时生效，最长不能超过30天</template>
                  </el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item
                name="formItemvalidSection"
                v-show="!UnSection"
                :rules="[{required: formInline.ExpireType==ExpireType.Designated&&!UnSection?true:false, message: '不能为空'}]"
                :show-message="false"
              >
                <el-radio
                  name="radioExpireTypes"
                  v-model="formInline.ExpireType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="ExpireType.Designated"
                  class="m-r-10"
                >指定有效期</el-radio>
                <el-date-picker
                  :editable="false"
                  v-model="validSection"
                  @change="SetValidSection"
                  :disabled="formInline.ExpireType==ExpireType.Fixed?true:false"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions1"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                name="formItemExpireStart"
                v-show="UnSection"
                prop="ExpireStart"
                :rules="[{required: formInline.ExpireType==ExpireType.Designated&&UnSection?true:false, message: '不能为空'}]"
                :show-message="false"
              >
                <el-radio
                  name="radioExpireTypeSp"
                  v-model="formInline.ExpireType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="ExpireType.Designated"
                  class="m-r-10"
                >指定有效期</el-radio>
                <el-date-picker
                  :editable="false"
                  v-model="formInline.ExpireStart"
                  :disabled="formInline.ExpireType==ExpireType.Fixed?true:false"
                  type="date"
                  unlink-panels
                  placeholder="选择开始日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions1"
                >
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <span class="require">*</span>到期提醒</td>
            <td>
              <el-form-item label="" prop="ExpiryDays" :rules="[{required: true, message: '不能为空'},{validator:MustNumberOrZero}]" :show-message="false">
                <el-input  v-model="formInline.ExpiryDays" style="max-width:370px">
                  <template slot="prepend">到期前</template>
                  <template slot="append">天提示，填0表示到期当天提醒。</template>
                </el-input>
              </el-form-item>
            </td>
          </tr> -->
          <tr>
            <td>使用限制</td>
            <td>
              <el-form-item
                label=""
                required
              >
                <el-select
                  name="selectRuleType"
                  v-model="formInline.RuleType"
                >
                  <el-option
                    v-for="item in RuleTypeOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label=""
                prop="RulePrice"
                v-if="formInline.RuleType==RuleType.Reached"
                :show-message="false"
              >
                <el-input
                  name="inputRulePrice"
                  v-model="formInline.RulePrice"
                  style="max-width:312px"
                >
                  <i slot="prepend">消费满</i>
                  <i slot="append">元可用</i>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="$route.path=='/market/coupon/giftcouponcreate'">
            <td>使用送积分</td>
            <td>
              <el-form-item
                label=""
                required
              >
                <el-select
                  name="selectIsGiveScore"
                  v-model="formInline.IsGiveScore"
                >
                  <el-option
                    v-for="(item, key) in YNStatus.Types"
                    :key="key"
                    :label="item"
                    :value="parseInt(key)"
                  ></el-option>
                </el-select>
                <span
                  class="m-l-10"
                  style="color: #999"
                >指被转赠人使用人情券后，是否赠送积分给转赠人</span>
              </el-form-item>
              <el-form-item
                label=""
                prop="ScoreRate"
                v-if="formInline.IsGiveScore==YNStatus.Yes"
                :show-message="false"
                :rules="[{required: true, trigger:'blur'},{ validator: RatesValid, trigger: 'blur' }]"
              >
                <el-input
                  name="inputScoreRate"
                  v-model="formInline.ScoreRate"
                  style="width:312px !important"
                >
                  <i slot="prepend">按被转赠人所获积分的</i>
                  <i slot="append">%赠送</i>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>使用说明</td>
            <td>
              <el-form-item label="">
                <el-input
                  name="inputCouponNote"
                  v-model="formInline.CouponNote"
                  type="textarea"
                  class="w-430 m-y-10"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  :maxlength="200"
                ></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
        <div class=" to-center m-t-10">
          <el-button
            name="btnSubmit"
            type="primary"
            @click="submit"
            :loading="saveLoading"
          >提交</el-button>
          <el-button
            name="btnBack"
            @click="$router.go(-1)"
          >取消</el-button>
        </div>
      </el-form>
      <el-dialog
        title="赠送规则说明"
        class="dialog-style-box"
        :visible.sync="dialogVisible"
        width="1000px"
        center
      >
        <!-- <h2 class="rule-t">赠送规则</h2> -->
        <div class="panel-body">
          <dl>
            <dt>1、首次关注公众号自动赠送</dt>
            <dd>1）卡券投放期内，用户第一次关注商家公众号时赠送，取消后再次关注不赠送；</dd>
            <dd>2）非卡券投放期内，首次关注不赠送；</dd>
          </dl>
          <dl>
            <dt>2、复购自动赠送</dt>
            <dd>1）卡券投放期内，重复购买按单赠送，可设定同一用户限赠次数；</dd>
            <dd>2）非卡券投放期内，重复购买不赠送；</dd>
          </dl>
          <dl>
            <dt>3、复购达指定次数自动赠送</dt>
            <dd>1）卡券投放期内，重复购买达到指定次数按单赠送，可设定同一用户限赠次数；</dd>
            <dd>2）非卡券投放期内，购买达到指定次数不赠送；</dd>
          </dl>
          <dl>
            <dt>4、消费达指定金额自动赠送</dt>
            <dd>1）卡券投放期内，消费达指定金额，按单赠送，可设定同一用户限赠次数；</dd>
            <dd>2）非卡券投放期内，参与活动不赠送；</dd>
          </dl>
          <dl>
            <dt>5、购买指定材质自动赠送</dt>
            <dd>1）卡券投放期内，购买指定材质时，可赠送对应的卡券，按单内符合赠送材质的情况选择送与不送，可设定同一用户限赠次数；</dd>
            <dd>2）非卡券投放期内，不赠送；</dd>
            <!-- <dd>
              <p>3）例：购买黄金送钻石券；</p>
              <p>自定义赠送卡券为：钻石券；</p>
              <p>抵扣比率为20%；</p>
              <p>赠送规则为：购买指定材质赠送（黄金）；</p>
              <p>赠送数量为：1张/人，同一用户限赠1次；</p>
              <p>券面金额为：固定金额100元；</p>
              <p>结果：卡券投放期内，用户订单内购买了2件黄金商品，按商品排序赠送1张100元钻石券；因设置了同一用户限赠1次，所以该用户购买的第二钻石商品时，不会再赠送钻石券。若设置的为“赠送数量为：1张/人，同一用户不限赠送次数”，那么用户订单内购买了2件黄金商品，会赠送2张100元钻石券。</p>
            </dd> -->
          </dl>
          <dl>
            <dt>6、分享成功手动赠送</dt>
            <dd>1）卡券投放期内，商家引导用户分享成功后，按分享次数，手动按次赠送一张卡券，用户扫描二维码领取；</dd>
            <dd>2）非卡券投放期内，分享成功不赠送；</dd>
          </dl>
          <dl>
            <dt>7、参与活动手动赠送</dt>
            <dd>1）卡券投放期内，成功参与活动，由商家手动按次赠送一张卡券，用户扫描二维码领取；</dd>
            <dd>2）非卡券投放期内，参与活动不赠送；</dd>
          </dl>
          <dl>
            <dt>8、其它手动赠送</dt>
            <dd>指在进行售后服务或会员维护时，手动按次向指定的会员赠送卡券；</dd>
            <dd>例 ：在CRM中向指定的会员赠送卡券</dd>
          </dl>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="dialogVisible = false"
            type="primary"
          >关 闭</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="选择券面样式"
        class="dialog-style-box"
        :visible.sync="dialogStyle"
        width="820px"
      >
        <el-row
          class="p-y-10"
          type="flex"
          justify="space-between"
          align="middle"
        >
          <el-col :span="5">请选择券面样式</el-col>
          <!-- <el-col :span="5">
            <el-select v-model="formInline.CouponType" >
              <el-option v-for="item in couponTypeList" :key="item.Value" :label="item.Name" :value="item.Value">
              </el-option>
            </el-select>
          </el-col> -->
        </el-row>
        <div class="style-box-wrap border-1px">
          <ul
            class="style-box-list"
            v-loading="styleListLoading"
          >
            <li
              v-for="(item, index) in dataStyles"
              @click="chooseCard(item)"
              :key="index"
              class="img-box"
            >
              <img
                :src="$root.settings.DOMAIN_IMG_FILE + item.ImageUrl"
                alt=""
              >
            </li>
          </ul>
        </div>
        <pagination
          :total="total"
          :pg="page.PageIndex"
          :size="page.PageSize"
          @currentChange="handleCurrentChange"
          @sizeChange="handleSizeChange"
        ></pagination>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            name="btnDialogStyle"
            @click="dialogStyle = false"
            type="primary"
          >关 闭</el-button>
          <!-- <el-button type="primary" @click="dialogStyle = false">确 定</el-button> -->
        </span>
      </el-dialog>
      <el-dialog
        title="适用品类及抵扣"
        :visible.sync="dialogapply"
        width="720px"
        @close="toggleSelection(multipleSelection)"
      >
        <span class="font-dec">1. 选择卡券在消费哪些品类时可用 2. 设置消费指定品类时抵扣消费金额的比率 </span>
        <el-form
          :model="materailForm"
          ref="materailForm"
          class="fix-w"
          :show-message="false"
        >
          <el-table
            ref="multipleTable"
            class="table-material m-y-10"
            :data="materailForm.list"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="500"
          >
            <el-table-column
              type="selection"
              align="center"
              width="55"
            ></el-table-column>
            <el-table-column
              align="center"
              label="适用品类"
              prop="MaterialType"
              :formatter="formatMaterial"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="rate"
              label="抵扣比率"
            >
              <template slot-scope="scoped">
                <el-form-item
                  :prop="`list[${scoped.$index}].Rate`"
                  :rules="{ validator: RatesValid, trigger: 'blur' }"
                >
                  <el-input
                    name="inputRates"
                    v-model="scoped.row.Rate"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <span class="font-dec">注：至少选择1种品类，选择了品类，抵扣比率必填</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            name="btnSureDefinedMetarial"
            @click="sureDefinedMetarial"
            type="primary"
          >确 定</el-button>
          <el-button
            name="btnToggleSelection"
            @click="toggleSelection(multipleSelection)"
          >取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  SCORING_API_COUPON_SETTING_STYLE_GETS, // 卡券样式 - 检索
  SCORING_API_COUPON_BASIC_CREATE // 优惠券 - 创建
} from '@/apis/scoring'

import { YNStatus } from '@/enums/common'
import {
  EventType,
  GivePriceType,
  ExpireType,
  RuleType,
  CouponSettingType
} from '@/enums/scoring'
import { MaterialType } from '@/enums/marketing'

import pagination from '@/components/pagination'

import {
  RatesValid,
  MaxiRateValidator,
  MustNumber,
  MustNumberOrZero,
  twoNumber,
  twoNumberOther,
  giveAmtValid,
  voucherGiveAmtValid
} from '@/rules/scoring/validate'
import { daysValid } from '@/rules/formValidate'
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      const reg = /^([1-9]{1,8})$/g
      if (!reg.test(value)) {
        return callback(new Error('输入有误！'))
      } else {
        return callback()
      }
    }
    return {
      daysValid,
      CouponSettingType,
      giveAmtValid,
      voucherGiveAmtValid,
      materialType: MaterialType,
      Instructions: '',
      saveLoading: false,
      dialogVisible: false,
      dialogStyle: false,
      isNotLimit: false,
      dialogapply: false,
      section: [],
      validSection: [],
      formInline: {
        IsGiveScore: 3, // 使用送积分
        ScoreRate: null, // 积分赠送比率
        CouponName: '',
        CouponType:
          this.$route.path.split('/')[3] == 'couponcreate'
            ? CouponSettingType.Universal
            : CouponSettingType.Voucher,
        CouponTypeName: '',
        StyleId: '',
        StyleImageUrl: '',
        Expireb: '',
        EventType:
          this.$route.path.split('/')[3] == 'couponcreate'
            ? EventType.FirstAttention
            : EventType.Material,
        GivePriceType: 1,
        GiveAmt: null,
        RuleType: RuleType.Indefinitely,
        ExpireType: ExpireType.Fixed,
        ExpireStart: '',
        ExpireStop: '',
        LimitCounts:
          this.$route.path == '/market/coupon/giftcouponcreate' ? 0 : 1,
        PerQty: null,
        Ranks: [
          {
            CashPrice: null,
            Price: null,
            MinPrice: null,
            MaxPrice: null,
            Weight: null,
            Price1: null,
            Price2: null,
            Price3: null
          },
          {
            CashPrice: null,
            Price: null,
            MinPrice: null,
            MaxPrice: null,
            Weight: null,
            Price1: null,
            Price2: null,
            Price3: null
          },
          {
            CashPrice: null,
            Price: null,
            MinPrice: null,
            MaxPrice: null,
            Weight: null,
            Price1: null,
            Price2: null,
            Price3: null
          }
        ],
        Rates: [],
        MaterialTypes: '',
        RulePrice: null,
        OrderRtype1: 0,
        OrderRtype2: 0,
        OrderRtype3: 0,
        OrderRtype4: 0
      },
      dataStyles: [], // 样式列表
      UnSection: false,
      ExpireType,
      EventType,
      YNStatus,
      RuleType,
      GivePriceType,
      materialList: [],
      NumCounts: [],
      EventTypeOpt: [],
      GivePriceTypeOpt: [],
      RuleTypeOpt: [],

      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        }
      },
      pickerOptions: {
        // 日期快捷键设置
        disabledDate(time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      rules: {
        CouponName: [
          /* {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '长度为 2 到 8 个字',
            trigger: 'blur'
          } */
          {
            required: true,
            validator: (rule, value, callback) => {
              if ((value && value.trim() == '') || value.length == 0) {
                callback(new Error('请输入活动名称'))
              } else if (value && value.trim().length < 2) {
                callback(new Error('长度为2到8个字'))
              }
              callback()
            }
          }
        ],
        /*        GiveAmt: [
                  { required: true, message: "请输入赠送数量", trigger: "blur" },
                  { validator: this.MustNumber }
                ],*/
        GiveAmt: [
          { required: true, message: '请输入赠送数量', trigger: 'blur' },
          { validator: this.MustNumber }
        ],
        PerQty: [
          {
            required:
              this.$route.path == '/market/coupon/giftcouponcreate'
                ? false
                : true,
            message: '不能为空！'
          }
          // {
          //   validator:
          //     this.$route.path == '/market/coupon/giftcouponcreate'
          //       ? MustNumberOteher
          //       : MustNumber
          // }
        ],
        Counts: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            validator: checkNum
          }
        ],
        MaterialTypes: [
          {
            required: true,
            message: '不能为空！',
            trigger: 'change'
          }
        ],
        RulePrice: [
          {
            required: true,
            message: '请输入赠送数量',
            trigger: 'blur'
          },
          {
            validator: this.twoNumber
          }
        ]
      },
      isEidtMaterial: false,
      customMaterial: [],
      MaterialType: MaterialType,
      ruleGiveMaterial: [],
      page: {
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      styleListLoading: false,
      couponTypeList: [], // 卡券类型
      materailForm: {
        list: []
      },
      multipleSelection: [],
      disableLimitCounts: true
    }
  },
  watch: {
    isNotLimit(val) {
      if (val) {
        this.formInline.GiveAmt = null
      }
    }
  },
  created() {
    // this.getCouponTypeList()
    this.getEnums()
  },
  components: {
    pagination
  },

  methods: {
    chooseCard(item) {
      // 选择样式
      this.dialogStyle = false
      this.formInline.StyleId = item.StyleId
      this.formInline.StyleImageUrl = item.ImageUrl
    },
    getStyles(p) {
      this.styleListLoading = true
      SCORING_API_COUPON_SETTING_STYLE_GETS(
        Object.assign({}, p, {
          IsAsced: YNStatus.No
        })
      )
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.dataStyles = res.data.Data.Rows
            this.total = res.data.Data.Count
          }
          this.styleListLoading = false
        })
        .catch(() => {
          this.styleListLoading = false
        })
    },
    getStyleImageList() {
      this.dialogStyle = true
      this.page.PageIndex = 1
      this.page.PageSize = 20
      this.getStyles(this.page)
    },
    handleSizeChange(val) {
      document.getElementsByClassName('style-box-wrap')[0].scrollTop = 0
      this.page.PageIndex = 1
      this.page.PageSize = parseInt(val)
      this.getStyles(this.page)
    },
    handleCurrentChange(val) {
      document.getElementsByClassName('style-box-wrap')[0].scrollTop = 0
      this.page.PageIndex = parseInt(val)
      this.getStyles(this.page)
    },
    giveAmtChange() {
      if (this.formInline.GiveAmt == 0) {
        this.isNotLimit = true
      }
    },
    ExChangeEventType(value) {
      this.formInline = Object.assign({}, this.formInline, {
        OrderRtype1: '',
        OrderRtype2: '',
        OrderRtype3: '',
        OrderRtype4: ''
      })
      switch (parseInt(value)) {
        case EventType.FirstAttention:
        case EventType.Share:
        case EventType.Included:
          this.formInline.GivePriceType =
            this.formInline.GivePriceType == 5
              ? 1
              : this.formInline.GivePriceType
          break
        case EventType.RepeatedBuy:
        case EventType.RepeatedCount:
        case EventType.Gifted:
        case EventType.Material:
          this.formInline = Object.assign({}, this.formInline, {
            OrderRtype1: YNStatus.Yes,
            OrderRtype2: YNStatus.No,
            OrderRtype3: YNStatus.Yes,
            OrderRtype4: YNStatus.No
          })
          break
        default:
          break
      }
      if (value == 11) {
        this.formInline.GivePriceType = 1
      }
      if (
        value == EventType.RepeatedBuy ||
        value == EventType.RepeatedCount ||
        value == EventType.Material
      ) {
        this.disableLimitCounts = false
        if (value == EventType.RepeatedCount) {
          this.formInline.LimitCounts = 1
        } else {
          this.formInline.LimitCounts = 0
        }
      } else {
        this.disableLimitCounts = true
        if (value == EventType.Gifted) {
          this.formInline.LimitCounts = 0
        } else {
          this.formInline.LimitCounts = 1
        }
      }
      this.formInline.Ranks = [
        {
          CashPrice: null,
          Price: null,
          MinPrice: null,
          MaxPrice: null,
          Weight: null
        },
        {
          CashPrice: null,
          Price: null,
          MinPrice: null,
          MaxPrice: null,
          Weight: null
        },
        {
          CashPrice: null,
          Price: null,
          MinPrice: null,
          MaxPrice: null,
          Weight: null
        }
      ]
    },
    sureDefinedMetarial() {
      this.$refs.materailForm.validate(valid => {
        if (valid) {
          if (
            this.multipleSelection.length > 0 &&
            this.multipleSelection.every(item => item.Rate)
          ) {
            this.dialogapply = false
            this.formInline.Rates = []
            this.multipleSelection.forEach(item => {
              this.formInline.Rates.push({
                MaterialType: item.MaterialType,
                Rate: this.$root.toInt(item.Rate) / 100
              })
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请选择适用品类并输入抵扣比率'
            })
          }
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          let flag = this.formInline.Rates.some(
            item =>
              item.MaterialType == row.MaterialType && item.Rate == row.Rate
          )
          if (!flag) {
            row.Rate = 100
            this.$refs.multipleTable.toggleRowSelection(row)
          }
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
      this.dialogapply = false
    },
    formatMaterial() {
      return MaterialType.Types[arguments[2]]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getMaterialTypes(value) {
      this.formInline.MaterialTypes = value.sort((a, b) => a - b).join(',')
    },
    dateRangeValid(rule, value, callback) {
      if (this.UnSection) {
        callback()
      } else if (
        dayjs(value[0]).format('YYYY-MM-DD') ==
        dayjs(value[1]).format('YYYY-MM-DD')
      ) {
        callback(new Error('开始日期与结束日期不能相同！'))
      } else {
        callback()
      }
    },
    getEnums() {
      // 获取枚举
      for (let item in MaterialType.Types) {
        this.materialList.push({
          MaterialType: parseInt(item),
          // label: MaterialType.Types[item],
          Rate: 100
        })
        this.materailForm.list = this.materialList.slice(0)
      }
      for (let item in EventType.Types) {
        this.EventTypeOpt.push({
          value: parseInt(item),
          label: EventType.Types[item]
        })
      }
      for (let item in GivePriceType.Types) {
        this.GivePriceTypeOpt.push({
          value: parseInt(item),
          label: GivePriceType.Types[item]
        })
      }
      for (let item in RuleType.Types) {
        this.RuleTypeOpt.push({
          value: parseInt(item),
          label: RuleType.Types[item]
        })
      }
      for (let i = 0; i < 21; i++) {
        this.NumCounts.push({
          value: i,
          label: i == 0 ? '不限' : i
        })
      }
    },
    SetSectionDate() {
      // 投放时间设置
      this.formInline.Expireb = dayjs(new Date(this.section[0])).format(
        'YYYY-MM-DD'
      )
      this.formInline.Expiree = dayjs(new Date(this.section[1])).format(
        'YYYY-MM-DD'
      )
    },
    SetValidSection() {
      // 有限时间设置
      this.formInline.ExpireStart = dayjs(
        new Date(this.validSection[0])
      ).format('YYYY-MM-DD')
      this.formInline.ExpireStop = dayjs(new Date(this.validSection[1])).format(
        'YYYY-MM-DD'
      )
    },
    ReseActivityTime() {
      // 切换结束期限制
      this.section = []
      this.validSection = []
      this.formInline.Expireb = ''
      this.formInline.Expiree = ''
      this.formInline.ExpireStart = ''
      this.formInline.ExpireStop = ''
    },
    addRandom() {
      // 添加随机金额
      if (this.formInline.Ranks.length == 6) {
        this.$message({
          message: '最多添加6条随机区间',
          type: 'warning'
        })
        return
      }
      this.formInline.Ranks.push({
        MinPrice: '',
        MaxPrice: '',
        Weight: ''
      })
    },
    delRandom(item) {
      // 删除随机金额
      var index = this.formInline.Ranks.indexOf(item)
      if (index !== -1) {
        this.formInline.Ranks.splice(index, 1)
      }
    },
    addQuota() {
      // 添加指定金额区间
      if (this.formInline.Ranks.length == 6) {
        this.$message({
          message: '最多添加6条指定金额区间',
          type: 'warning'
        })
        return
      }
      this.formInline.Ranks.push({
        CashPrice: null,
        Price: null,
        MinPrice: null,
        MaxPrice: null,
        Weight: null,
        Price1: null,
        Price2: null,
        Price3: null
      })
    },
    delQuota(item) {
      // 删除指定金额区间
      var index = this.formInline.Ranks.indexOf(item)
      if (index !== -1) {
        this.formInline.Ranks.splice(index, 1)
      }
    },
    submit() {
      // 表单提交
      this.$refs['formInline'].validate(valid => {
        /* const objs = Object.assign({}, this.formInline, {
          GiveAmt: +this.formInline.GiveAmt
        })
        console.log(objs) */
        let flag = false
        if (valid) {
          if (!this.formInline.StyleId) {
            this.$message({
              type: 'warning',
              message: '请选择卡券样式'
            })
            flag = true
          }
          if (this.formInline.EventType == EventType.Gifted) {
            let ary = this.formInline.Ranks
            ary.forEach((item, index) => {
              if (index > 0) {
                // console.log(item.CashPrice <= ary[index - 1].CashPrice)
                // console.log(item.Price +'/'+ ary[index - 1].Price)
                if (
                  parseFloat(item.CashPrice) <=
                    parseFloat(ary[index - 1].CashPrice) ||
                  parseFloat(item.Price) <= parseFloat(ary[index - 1].Price)
                ) {
                  this.$message({
                    type: 'warning',
                    message: '消费满指定金额区间必须依次递增'
                  })
                  flag = true
                }
              }
            })
          }
          if (this.formInline.GivePriceType == GivePriceType.Random) {
            let ary = this.formInline.Ranks
            let rateAll = 0

            ary.forEach((item, index) => {
              rateAll += parseFloat(item.Weight)

              if (index > 0) {
                if (
                  parseFloat(item.MinPrice) <=
                    parseFloat(ary[index - 1].MaxPrice) ||
                  parseFloat(item.MinPrice) >= parseFloat(item.MaxPrice)
                ) {
                  this.$message({
                    type: 'warning',
                    message: '随机金额区间必须依次递增'
                  })
                  flag = true
                }
              } else {
                if (parseFloat(item.MinPrice) >= parseFloat(item.MaxPrice)) {
                  this.$message({
                    type: 'warning',
                    message: '随机金额区间必须依次递增'
                  })
                  flag = true
                }
              }
            })

            if (rateAll != 100) {
              this.$message({
                type: 'warning',
                message: '券面金额比率总和必须等于100%！'
              })
              flag = true
            }
          }
          if (
            this.$route.path !== '/market/coupon/giftcouponcreate' &&
            this.formInline.GiveAmt % this.formInline.PerQty != 0
          ) {
            this.$message({
              type: 'warning',
              message: '卡券数量必须是赠送数量的倍数'
            })
            flag = true
          }
          if (this.formInline.Rates.length == 0) {
            this.$message({
              type: 'warning',
              message: '请选择卡券适用品类及抵扣比率'
            })
            flag = true
          }
          if (
            !this.UnSection &&
            this.formInline.ExpireType == ExpireType.Designated
          ) {
            const ATime = this.section
            const BTime = this.validSection

            if (new Date(BTime[0]) < new Date(ATime[0])) {
              this.$message({
                type: 'warning',
                message: '指定有效期开始日期必须大于等于投放时间的开始日期'
              })
              flag = true
            }

            if (new Date(ATime[1]).getTime() > new Date(BTime[1]).getTime()) {
              this.$message({
                type: 'warning',
                message: '有效期结束时间应控制不能小于投放时间的结束时间'
              })
              flag = true
            }
          }
          if (
            this.UnSection &&
            this.formInline.ExpireType == ExpireType.Designated
          ) {
            if (
              new Date(this.formInline.ExpireStart) <
              new Date(this.formInline.Expireb)
            ) {
              this.$message({
                type: 'warning',
                message: '指定有效期开始日期必须大于等于投放时间的开始日期'
              })
              flag = true
            }
          }

          if (flag) {
            return
          }
          this.saveLoading = true
          const {
            ActiveDays,
            GiveAmt,
            PerQty,
            Price,
            ExpireDays,
            RulePrice,
            OrderRtype1,
            OrderRtype2,
            OrderRtype3,
            OrderRtype4,
            ScoreRate,
            Ranks,
            Counts,
            Rate
          } = this.formInline
          SCORING_API_COUPON_BASIC_CREATE(
            Object.assign({}, this.formInline, {
              ActiveDays: +ActiveDays,
              GiveAmt: +GiveAmt,
              PerQty: +PerQty,
              Price: this.$root.toInt(Price),
              ExpireDays: +ExpireDays,
              RulePrice: this.$root.toInt(RulePrice),
              OrderRtype1: +OrderRtype1,
              OrderRtype2: +OrderRtype2,
              OrderRtype3: +OrderRtype3,
              OrderRtype4: +OrderRtype4,
              ScoreRate: this.$root.toInt(ScoreRate) / 100,
              Ranks: Ranks.map(item => ({
                CashPrice: this.$root.toInt(item.CashPrice),
                Price: this.$root.toInt(item.Price),
                MinPrice: this.$root.toInt(item.MinPrice),
                MaxPrice: this.$root.toInt(item.MaxPrice),
                Weight: this.$root.toInt(item.Weight) / 100,
                Price1: this.$root.toInt(item.Price1),
                Price2: this.$root.toInt(item.Price2),
                Price3: this.$root.toInt(item.Price3)
              })),
              Counts: +Counts,
              Rate: this.$root.toInt(Rate)
            })
          )
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: res.data.Message
                })
                this.$router.push(
                  '/market/coupon/' +
                    (this.$route.path.split('/')[3] == 'couponcreate'
                      ? 'index'
                      : 'giftcoupon')
                )
              }

              this.saveLoading = false
            })
            .catch(() => {
              this.saveLoading = false
            })
        }
      })
    },
    RatesValid,
    MaxiRateValidator,
    twoNumber,
    MustNumber,
    MustNumberOrZero,
    twoNumberOther,

    noZeroNumValid(rule, value, callback) {
      // 非必填非零数字验证
      const reg = /^([1-9]{1}[0-9]{0,8})$/g
      // console.log(value);
      const flag = reg.test(value)
      if (!flag && this.formInline.ExpireType == ExpireType.Fixed) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    MustNumberOrEmpty1(rule, value, callback) {
      // 非必填数字验证
      const reg = /^([1-9]\d{0,8}|[0]{1,1})$/g
      // console.log(value);
      const flag = reg.test(value)
      if (!flag && this.formInline.ExpireType == ExpireType.Fixed) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    MustNumberOrEmpty2(rule, value, callback) {
      // 非必填数字验证
      const reg = /^([1-9]{1}[0-9]{0,8})|0$/g

      const flag = reg.test(value)
      if (!flag && this.formInline.ExpireType == ExpireType.Designated) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    ActiveDaysValidate(rule, value, callback) {
      let reg = /^\d{1,2}$/
      if (this.formInline.ExpireType == ExpireType.Fixed) {
        if (!reg.test(value) || parseInt(value) > 30) {
          callback(new Error('输入有误！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss">
.form {
  font-size: 12px !important;
  .el-form-item__label,
  .el-form-item__content {
    line-height: 40px;
  }
  .material {
    .el-form-item__content {
      line-height: 22px;
    }
    &.is-error {
      padding-bottom: 15px;
    }
  }
}
.require {
  color: #f56c6c;
}

.tag-box .el-tag {
  margin-right: 10px !important;
}

.table-box-border tr td .el-form-item {
  margin: 0;
}

.give-style .el-select {
  display: inline-block !important;
}

.dialog-style-box .el-dialog--center .el-dialog__body {
  padding: 20px 20px 15px;
}

.table-material {
  .el-form-item--mini.el-form-item {
    margin: 0;
  }
}

.price-split {
  margin-bottom: 0;
  // max-width: 1242px;
  .el-input {
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped>
.title {
  padding: 0;
  margin: 0;
  padding-left: 30px;
  height: 34px;
  color: #777;
  line-height: 34px;
  font-size: 12px;
  font-weight: bold;
  border-top: 1px solid #e5e5e5;
  // border-bottom: 1px solid #e5e5e5;
  background-color: #f5f5f5;
}

.style-box-wrap {
  // width: 1024px;
  height: 500px;
  overflow: auto;
  background-color: #f5f5f5; // padding-top: 20px;

  .style-box-list {
    display: flex;
    flex-wrap: wrap;

    li {
      padding: 10px;
      padding-bottom: 0;
    }
  }
}

.img-box {
  img {
    display: block;
    width: 350px;
    height: 150px;
  }
}

.table-box-border {
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-collapse: collapse;

  tr {
    td {
      border: 1px solid #ddd;

      &:nth-of-type(1) {
        width: 200px;
        text-align: center;
      }
    }
  }
}

.font-dec {
  font-size: 12px;
  color: #999999;
}

.show-give-style {
  float: right;
  margin-right: 20px;
  cursor: pointer;
  color: #0f6db6;
}

.rule-t {
  background: #f5f5f5;
  border: 1px #ddd solid;
  border-radius: 5px 5px 0 0;
  line-height: 40px;
  font-size: 14px;
  text-indent: 20px;
}

.panel-body {
  border: 1px #ddd solid; // border-top: none;
  padding: 20px;
  height: 500px;
  overflow: auto;
  font-size: 12px;
}

.panel-body {
  // margin-bottom: 20px;
  line-height: 1.5;

  dl {
    margin-bottom: 10px;

    dt {
      font-weight: bold;
    }
  }
}

.rate-form-item {
  display: inline-block;
  padding: 0 5px;
  margin-bottom: 10px;
}

.m-t-25 {
  margin-top: 25px;
}

.border-none {
  border: none !important;
}

.card-price-box {
  display: flex;
  align-items: center;
  .voucher-tip {
    p {
      line-height: 20px;
      color: #999;
    }
  }
}
</style>
<template>
  <div class="content">
    <div class="content-view border-1px">
      <el-form
        :model="formInline"
        class="form form-box-b fix-w"
        :show-message="false"
        ref="formInline"
        :rules="rules"
        label-width="20px"
      >
        <table class="table-box-border">
          <tr v-if="$route.params.id!=2">
            <td>
              <span class="require">*</span> 卡券样式
            </td>
            <td>
              <el-form-item>
                <el-button
                  type="primary"
                  class="m-t-25"
                  @click="getStyleImageList"
                >选择</el-button>
                <div class="img-box m-y-10">
                  <img
                    v-if="formInline.StyleImageUrl"
                    :src="$root.settings.DOMAIN_IMG_FILE + formInline.StyleImageUrl"
                    alt
                  >
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span> 卡券名称
            </td>
            <td>
              <el-form-item
                label
                prop="CouponName"
                :show-message="false"
              >
                <el-input
                  v-model="formInline.CouponName"
                  class="w-312"
                  placeholder="输入卡券名称"
                ></el-input>
                <span class="font-dec m-l-10">2-8个汉字或等量字符</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span> 销售时间
            </td>
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
                    :popper-append-to-body="false"
                    :picker-options="pickerOptions1"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  name="datePickerSection"
                  v-show="!UnSection"
                  style="display:inline-block"
                  prop="Section"
                  :rules="[{required: !UnSection, message: '不能为空',trigger: 'change' }]"
                  :show-message="false"
                >
                  <el-date-picker
                    :editable="false"
                    v-model="formInline.Section"
                    @change="SetSectionDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :popper-append-to-body="false"
                    :picker-options="pickerOptions1"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item style="display:inline-block;">
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
              <span class="require">*</span> 数量
            </td>
            <td>
              <el-form-item
                prop="GiveAmt"
                :rules="$route.params.id ==2?[{required: true, message: '不能为空', trriger: 'blur'},{validator:unlineAmtValid}]:[{required:false}]"
              >
                <el-input
                  name="inputGiveAmt"
                  v-if="$route.params.id==2"
                  v-model="formInline.GiveAmt"
                >
                  <template slot="append">张</template>
                </el-input>
                <span v-else>不限</span>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="$route.params.id!=2">
            <td>
              <span class="require">*</span> 销售限制
            </td>
            <td>
              <el-form-item>不限</el-form-item>
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
          </tr>-->
          <tr>
            <td>
              <span class="require">*</span> 卡券面额
            </td>
            <td>
              <el-form-item key="GivePriceType.Fixed">
                <el-form-item
                  prop="Price"
                  :rules="[{required: true, message: '不能为空'},{validator:twoNumberOther}]"
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
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span> 销售价
            </td>
            <td>
              <el-form-item key="GivePriceType.Fixed">
                <el-form-item
                  prop="SalePrice"
                  :rules="[{required: true, message: '不能为空'},{validator:salePriceValid}]"
                >
                  <el-input
                    name="inputSalePrice"
                    class="w-312"
                    v-model="formInline.SalePrice"
                  >
                    <template slot="append">元（金额不能小于 1 元）</template>
                  </el-input>
                </el-form-item>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <span class="require">*</span>适用及抵扣
            </td>
            <td>
              <el-form-item>
                <el-button
                  name="btnDialogapply"
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
              <span class="require">*</span>有效期
            </td>
            <td>
              <el-form-item
                label
                required
                v-if="$route.params.id == 1"
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
                  :rules="formInline.ExpireType==ExpireType.Fixed?[{required: true},{validator:daysValid}]:[{required: false}]"
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
                name="formItemValidSection"
                v-show="!UnSection"
                prop="ValidSection"
                :rules="[{required: formInline.ExpireType==ExpireType.Designated&&!UnSection?true:false, message: '不能为空'}]"
                :show-message="false"
              >
                <el-radio
                  name="radioExpireTypes"
                  v-model="formInline.ExpireType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="ExpireType.Designated"
                  v-if="$route.params.id == 1"
                  class="m-r-10"
                >指定有效期</el-radio>
                <el-date-picker
                  :editable="false"
                  v-model="formInline.ValidSection"
                  @change="SetValidSection"
                  :disabled="formInline.ExpireType==ExpireType.Fixed&&$route.params.id == 1?true:false"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                ></el-date-picker>
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
                  :picker-options="pickerOptions2"
                ></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <span class="require">*</span>到期提醒</td>
            <td>
              <el-form-item label='' prop="ExpiryDays" :rules="[{required: true, message: '不能为空'},{validator:MustNumberOrZero}]" :show-message="false">
                <el-input  v-model="formInline.ExpiryDays" style="max-width:370px">
                  <template slot="prepend">到期前</template>
                  <template slot="append">天提示，填0表示到期当天提醒。</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>-->
          <tr>
            <td>使用限制</td>
            <td>
              <el-form-item
                label
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
                label
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
          <tr>
            <td>绑定销售人员</td>
            <td>
              <el-form-item
                label
                required
              >
                <el-radio-group
                  name="radioGroupIsBindSale"
                  v-model="formInline.isBindSale"
                >
                  <el-radio :label="YNStatus.Yes">是</el-radio>
                  <el-radio :label="YNStatus.No">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="formInline.isBindSale==YNStatus.Yes">
            <td>
              <span class="require">*</span> 销售人员
            </td>
            <td>
              <el-form-item>
                <el-button
                  name="btnOpenEmployeeDialog"
                  type="primary"
                  @click="openEmployeeDialog"
                >选择</el-button>
                <div
                  v-if="$route.params.id==1"
                  :key="1"
                >
                  <el-row
                    type="flex"
                    v-for="(item,index) in formInline.Employees"
                    :key="index"
                  >
                    <el-col style="width: 100px">{{item.UserName}}</el-col>
                    <el-col>
                      <el-form-item
                        :prop="'Employees.'+index+'.SaleCode'"
                        :rules="[{required:true,validator: enNumValidate}]"
                      >
                        <el-input
                          name="inputSaleCode"
                          v-model="item.SaleCode"
                          placeholder="销售代码（销售卡券时的身份识别码）"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div
                  v-else
                  key="2"
                >
                  <el-row
                    type="flex"
                    v-for="(item,index) in formInline.Employees"
                    :key="index"
                  >
                    <el-col style="width: 100px">{{item.UserName}}</el-col>
                    <el-col>
                      <el-form-item
                        :prop="'Employees.'+index+'.SaleTarget'"
                        :rules="[{required:true,validator: initValidate1}]"
                      >
                        <el-input
                          name="inputSaleTarget"
                          v-model="item.SaleTarget"
                          placeholder="销售目标（张）"
                        >
                          <template slot="append">张</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="formInline.isBindSale==YNStatus.Yes">
            <td>销售奖励</td>
            <td>
              <el-form-item
                label
                required
              >
                <el-radio-group
                  name="radioGroupIsReward"
                  v-model="formInline.isReward"
                >
                  <el-radio :label="YNStatus.Yes">启用</el-radio>
                  <el-radio :label="YNStatus.No">停用</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="formInline.isBindSale==YNStatus.Yes&&formInline.isReward==YNStatus.Yes">
            <td>
              <span class="require">*</span> 奖励周期
            </td>
            <td>
              <el-form-item
                name="datePickerRewardTimeRange"
                style="display:inline-block"
                prop="rewardTimeRange"
                :rules="[{required: true, message: '不能为空',trigger: 'change' }]"
                :show-message="false"
              >
                <el-date-picker
                  :editable="false"
                  v-model="formInline.rewardTimeRange"
                  @change="getRewardTime"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :popper-append-to-body="false"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="formInline.isBindSale==YNStatus.Yes&&formInline.isReward==YNStatus.Yes">
            <td>
              <span class="require">*</span> 奖励设置
            </td>
            <td>
              <el-form-item
                label
                required
              >
                <el-radio
                  name="radioRewardType"
                  v-model="formInline.RewardType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="CouponRewardType.Fixed"
                  class="m-r-10"
                >固定奖励</el-radio>
                <el-form-item
                  style="display:inline-block"
                  prop="RewardPrice"
                  :rules="formInline.RewardType==CouponRewardType.Fixed?[{required: true, message: '不能为空'},{validator:twoNumberOther}]:[{required: false}]"
                  :show-message="false"
                >
                  <el-input
                    name="inputRewardPrice"
                    :disabled="formInline.RewardType==CouponRewardType.Step"
                    v-model="formInline.RewardPrice"
                    style="width:300px !important"
                  >
                    <template slot="prepend">奖励单价</template>
                    <template slot="append">元/张</template>
                  </el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item prop="ValidSection">
                <el-radio
                  name="radioRewardTypes"
                  v-model="formInline.RewardType"
                  @change="$refs['formInline'].clearValidate()"
                  :label="CouponRewardType.Step"
                  class="m-r-10"
                >阶梯奖励</el-radio>
                <el-row
                  v-show="formInline.RewardType==CouponRewardType.Step"
                  type="flex"
                  class="price-split"
                  :gutter="10"
                  v-for="(SaleItems,index) in formInline.SaleItems"
                  :key="index"
                >
                  <el-col :style="$route.params?'width:20%':''">
                    <el-form-item
                      :prop="'SaleItems.'+index+'.MinSale'"
                      :rules="[{required: formInline.RewardType==CouponRewardType.Step?true:false, message: '不能为空'},{validator:initValidate}]"
                      :show-message="false"
                    >
                      <el-input
                        name="inputMinSale"
                        v-model="SaleItems.MinSale"
                        :disabled="index!=0"
                        style="width:"
                        placeholder="请输入销售数量"
                      >
                        <template slot="append">至</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :style="$route.params?'width:20%':''">
                    <el-form-item
                      :prop="'SaleItems.'+index+'.MaxSale'"
                      :rules="[{required: formInline.RewardType==CouponRewardType.Step?true:false, message: '不能为空'},{validator:initValidate}]"
                      :show-message="false"
                    >
                      <el-input
                        name="inputMaxSale"
                        v-model="SaleItems.MaxSale"
                        @blur="changeVal(index,SaleItems.MaxSale)"
                        style="width:"
                        placeholder="请输入销售数量"
                      >
                        <template slot="append">张</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :style="$route.params?'width:20%':''">
                    <el-form-item
                      :prop="'SaleItems.'+index+'.Price'"
                      :rules="[{required: formInline.RewardType==CouponRewardType.Step?true:false, message: '不能为空'},{validator:vilidateTwoFlaot}]"
                      :show-message="false"
                    >
                      <el-input
                        name="inputPrices"
                        v-model="SaleItems.Price"
                        placeholder="请输入奖励单价"
                      >
                        <template slot="append">元/每张</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :style="$route.params?'width:20%':''">
                    <img
                      name="clickDelQuota"
                      src="/static/images/icon-4.png"
                      v-if="index!=0"
                      @click="delQuota(SaleItems)"
                      style="vertical-align: middle;cursor:pointer;margin-right: 10px"
                      alt
                    >
                    <img
                      name="clickAddQuota"
                      src="/static/images/icon-5.png"
                      v-if="index == formInline.SaleItems.length - 1"
                      @click="addQuota"
                      style="vertical-align: middle;cursor:pointer"
                      alt
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>使用说明</td>
            <td>
              <el-form-item label>
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
        <el-form-item class="m-t-20 to-center">
          <el-button
            name="btnSubmit"
            type="primary"
            @click="submit"
            :loading="saveLoading"
          >提交</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 选择券面样式对话框 start-->
      <el-dialog
        title="选择券面样式"
        class="dialog-style-box"
        :visible.sync="dialogStyle"
        width="840px"
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
          </el-col>-->
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
                alt
              >
            </li>
          </ul>
        </div>
        <pagination
          :total="page.total"
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
      <!-- 选择券面样式对话框 end-->
      <!-- 设置适用品类及抵扣对话框 start-->
      <el-dialog
        title="适用品类及抵扣"
        :visible.sync="dialogapply"
        width="720px"
        @close="toggleSelection(multipleSelection)"
      >
        <span class="font-dec">1. 选择卡券在消费哪些品类时可用 2. 设置消费指定品类时抵扣消费金额的比率</span>
        <el-form
          :model="materailForm"
          ref="materailForm"
          class="fix-w"
          :show-message="false"
        >
          <el-table
            border
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
            ></el-table-column>
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
                    name="btnRate"
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
          >保存</el-button>
          <el-button
            name="btnToggleSelection"
            @click="toggleSelection(multipleSelection)"
          >取 消</el-button>
        </span>
      </el-dialog>
      <!-- 设置适用品类及抵扣对话框 end-->
      <!-- 选择销售人员对话框 start-->
      <el-dialog
        title="选择销售人员"
        :visible.sync="employeeVisible"
        ref="employeeTable"
        width="1020px"
      >
        <div v-loading="loadingGetStore">
          <el-form
            inline
            :model="employeeForm"
            ref="employeeForm"
            class="form-lh-26"
          >
            <el-form-item
              label="门店"
              prop="CharacterId"
              v-if="characterType == CharacterType.Company"
            >

              <el-select
                name="selectCharacterId"
                v-model="employeeForm.CharacterId"
                @change="departmentArrChange"
              >
                <el-option
                  label="全部"
                  :value="0"
                ></el-option>
                <el-option
                  v-for="(item, index) in storeArr"
                  :key="index"
                  :label="item.Value"
                  :value="item.CharacterId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="姓名"
              prop="TrueName"
            >
              <el-input
                name="inputTrueName"
                v-model="employeeForm.TrueName"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机"
              prop="Mobile"
            >
              <el-input v-model="employeeForm.Mobile"></el-input>
            </el-form-item>
            <el-form-item
              label="部门"
              prop="DepartmentId"
            >
              <el-select
                name="selectDepartmentId"
                v-model="employeeForm.DepartmentId"
              >
                <el-option
                  label="全部"
                  :value="0"
                ></el-option>
                <el-option
                  v-for="item in departmentArr"
                  :key="item.Id"
                  :label="item.Value"
                  :value="item.Id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                name="btnGetEmployee"
                type="primary"
                @click="getEmployee"
              >搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="employeeData"
            @selection-change="employeSelectChange"
            v-loading="$store.getters.tb_loading"
          >
            >
            <el-table-column
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              prop="TrueName"
              label="姓名"
            >
              <template slot-scope="scoped">{{scoped.row.TrueName?scoped.row.TrueName:scoped.row.AliasName}}</template>
            </el-table-column>
            <el-table-column
              prop="StoreName"
              label="门店"
              v-if="characterType == CharacterType.Company"
            ></el-table-column>
            <el-table-column
              prop="JobCode"
              label="工号"
            ></el-table-column>
            <el-table-column
              prop="Mobile"
              label="手机号"
            ></el-table-column>
            <el-table-column
              prop="Department"
              label="部门"
            ></el-table-column>
            <el-table-column
              prop="BerthType"
              label="微信权限"
            >
              <template slot-scope="scope">{{SecurityUserBerthType.Types[scope.row.BerthType]}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer">
          <el-button
            name="btnEmployeeJoin"
            type="primary"
            @click="employeeJoin"
          >确定</el-button>
          <el-button
            name="btnEmployeeVisible"
            type="default"
            @click="employeeVisible=false"
          >取消</el-button>
        </div>
      </el-dialog>
      <!-- 选择销售人员对话框 end-->
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  SCORING_API_COUPON_SETTING_STYLE_GETS, // 卡券样式 - 检索
  SCORING_API_COUPON_BASIC_CREATE // 优惠券 - 创建
} from '@/apis/scoring'
import {
  MERCHANT_API_SECURITY_USER_REQS, // 用户账号服务 - 检索(总部专用,检索总部下所有门店的员工,不包括总部的员工)
  MERCHANT_API_DROPDOWN_STOREDEPARTLIST // 部门 - 下拉(总部专用,检索总部下所有门店的部门,不包括总部的部门);
} from '@/apis/merchant'

import { YNStatus, CharacterType } from '@/enums/common'
import {
  EventType,
  GivePriceType,
  ExpireType,
  RuleType,
  CouponSettingType,
  CouponSaleType,
  CouponRewardType
} from '@/enums/scoring'
import { MaterialType } from '@/enums/marketing'
import { SecurityUserState, SecurityUserBerthType } from '@/enums/merchant'

import pagination from '@/components/pagination'
import {
  RatesValid,
  MaxiRateValidator,
  MustNumber,
  MustNumberOrZero,
  twoNumber,
  twoNumberOther,
  MustNumberOteher,
  unlineAmtValid
} from '@/rules/scoring/validate'
import { daysValid } from '@/rules/formValidate'
import { Promise } from 'q'
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
      unlineAmtValid,
      CouponRewardType,
      CharacterType,
      SecurityUserBerthType,
      materialType: MaterialType,
      Instructions: '',
      saveLoading: false,
      dialogVisible: false,
      dialogStyle: false,
      isNotLimit: false,
      dialogapply: false,
      employeeVisible: false,
      loadingGetStore: true,
      loading: true,
      employeeForm: {
        CharacterId: 0,
        TrueName: '',
        Mobile: '',
        DepartmentId: 0,
        PageIndex: 1,
        PageSize: 1000,
        UserState: SecurityUserState.Audit
      },
      storeArr: [],
      departmentArr: [],
      employeeData: [],
      employeeSelection: [],
      formInline: {
        rewardTimeRange: [], // 奖励周期时间范围
        rewardStart: '', // 奖励起始日期
        rewardStop: '', // 奖励结束日期
        CouponSaleType:
          this.$route.params.id == 1
            ? CouponSaleType.Online
            : CouponSaleType.Offline,
        CouponName: '',
        CouponType: CouponSettingType.Sale,
        CouponTypeName: '',
        StyleId: 0,
        StyleImageUrl: '',
        Expireb: [],
        EventType: 0,
        GivePriceType: 1,
        GiveAmt: null,
        RuleType: RuleType.Indefinitely,
        ExpireType:
          this.$route.params.id == 1 ? ExpireType.Fixed : ExpireType.Designated,
        ExpireStart: '',
        ExpireStop: '',
        Section: [],
        LimitCounts: 1,
        // PerQty: 0,
        isReward: YNStatus.Yes,
        isBindSale: YNStatus.Yes,
        RewardType: CouponRewardType.Fixed,
        SaleItems: [
          {
            MinSale: null,
            MaxSale: null,
            Price: null
          },
          {
            MinSale: null,
            MaxSale: null,
            Price: null
          },
          {
            MinSale: null,
            MaxSale: null,
            Price: null
          }
        ],
        Employees: [],
        Rates: [],
        MaterialTypes: '',
        ValidSection: [],
        RulePrice: null
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
        }
      },
      rules: {
        CouponName: [
          {
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '长度为 2 到 8 个字',
            trigger: 'blur'
          }
        ],
        GiveAmt: [
          { required: true, message: '请输入赠送数量', trigger: 'blur' },
          { validator: this.MustNumber }
        ],
        PerQty: [
          {
            required:
              this.$route.path == '/market/coupon/giftcoponcreate'
                ? false
                : true,
            message: '不能为空！'
          },
          {
            validator:
              this.$route.path == '/market/coupon/giftcoponcreate'
                ? MustNumberOteher
                : MustNumber
          }
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
        PageSize: 10,
        total: 0
      },
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
        this.formInline.GiveAmt = 0
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  created() {
    this.getEnums()
  },
  components: {
    pagination
  },
  methods: {
    getStoreDepartList() {
      return MERCHANT_API_DROPDOWN_STOREDEPARTLIST({
        CharacterId: this.employeeForm.CharacterId,
        State: 0
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          return Promise.resolve(res.data.Data.Rows)
        }
      })
    },
    async openEmployeeDialog() {
      this.employeeVisible = true
      this.loadingGetStore = true
      if (this.$refs.employeeForm) {
        this.$refs.employeeForm.resetFields()
      }
      this.storeArr = await this.$store.dispatch('GET_STORES_DROPLIST')
      this.departmentArr = (await this.getStoreDepartList()) || []
      this.loadingGetStore = false
      this.getEmployee()
    },
    async departmentArrChange() {
      this.departmentArr =
        (await this.$store.dispatch('GET_DEPARTMENTS_DROPLIST', {
          CharacterId: this.employeeForm.CharacterId,
          State: 0
        })) || []
    },
    getRewardTime(value) {
      // 获取奖励周期
      if (value) {
        this.formInline.rewardStart = value[0]
        this.formInline.rewardStop = value[1]
      } else {
        this.formInline.rewardStart = ''
        this.formInline.rewardStop = ''
      }
    },
    employeeJoin() {
      if (this.employeeSelection.length > 0) {
        this.formInline.Employees = []
        this.employeeSelection.forEach((item, index) => {
          this.$set(this.formInline.Employees, index, {
            UserId: item.UserId,
            UserName: item.TrueName || item.AliasName,
            StoreName: item.StoreName,
            SaleCode: '',
            SaleTarget: 0,
            CharacterId: item.CharacterId || 0
          })
        })
        this.employeeVisible = false
      } else {
        this.$message.warning('请选择销售人员')
      }
    },
    changeVal(i, val) {
      const obj = this.formInline.SaleItems[i + 1]
      const curSale = this.formInline.SaleItems[i]
      if (!isNaN(val) && parseInt(curSale.MinSale) < parseInt(val)) {
        if (obj) {
          this.$set(obj, 'MinSale', parseInt(val) + 1)
        }
      } else {
        this.$set(curSale, 'MaxSale', '')
        this.$message.warning('区间结束必须大于开始值！')
      }
    },
    getEmployee() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SECURITY_USER_REQS(this.employeeForm).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.employeeData = res.data.Data.Rows
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    employeSelectChange(val) {
      this.employeeSelection = val
    },
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
            this.page.total = res.data.Data.Count
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
    getCouponTypeName(val) {
      this.formInline.CouponTypeName = this.couponTypeList.find(
        item => item.Value == val
      ).Name
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
          Rate: '100'
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
    SetSectionDate(value) {
      // 投放时间设置
      if (value) {
        this.formInline.Expireb = dayjs(
          new Date(this.formInline.Section[0])
        ).format('YYYY-MM-DD')
        this.formInline.Expiree = dayjs(
          new Date(this.formInline.Section[1])
        ).format('YYYY-MM-DD')
      } else {
        this.formInline.Expireb = ''
        this.formInline.Expiree = ''
      }
    },
    SetValidSection() {
      // 有限时间设置
      this.formInline.ExpireStart = dayjs(
        new Date(this.formInline.ValidSection[0])
      ).format('YYYY-MM-DD')
      this.formInline.ExpireStop = dayjs(
        new Date(this.formInline.ValidSection[1])
      ).format('YYYY-MM-DD')
    },
    ReseActivityTime() {
      // 切换结束期限制
      this.formInline.Section = []
      this.formInline.ValidSection = []
      this.formInline.Expireb = ''
      this.formInline.Expiree = ''
      this.formInline.ExpireStart = ''
      this.formInline.ExpireStop = ''
    },
    addQuota() {
      // 添加指定金额区间
      if (this.formInline.SaleItems.length == 6) {
        this.$message({
          message: '最多添加6条指定金额区间',
          type: 'warning'
        })
        return
      }
      let len = this.formInline.SaleItems.length
      if (this.formInline.SaleItems[len - 1].MaxSale > 0) {
        this.formInline.SaleItems.push({
          MinSale: this.formInline.SaleItems[len - 1].MaxSale * 1 + 1,
          MaxSale: 0,
          Price: 0
        })
      } else {
        this.formInline.SaleItems.push({
          MinSale: 0,
          MaxSale: 0,
          Price: 0
        })
      }
    },
    delQuota(item) {
      // 删除指定金额区间
      var index = this.formInline.SaleItems.indexOf(item)
      if (index !== -1) {
        this.formInline.SaleItems.splice(index, 1)
      }
      this.formInline.SaleItems.forEach((item, index) => {
        if (item.MaxSale && index < this.formInline.SaleItems.length - 1) {
          this.formInline.SaleItems[index + 1].MinSale = item.MaxSale * 1 + 1
        }
      })
    },
    submit() {
      // 表单提交
      this.$refs['formInline'].validate(valid => {
        let flag = false
        if (valid) {
          if (!this.formInline.StyleId && this.$route.params.id != 2) {
            this.$message({
              type: 'warning',
              message: '请选择卡券样式'
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
            const ATime = this.formInline.Section
            const BTime = this.formInline.ValidSection

            if (new Date(BTime[0]) < new Date(ATime[0])) {
              this.$message({
                type: 'warning',
                message: '指定有效期开始日期必须大于等于销售时间的开始日期'
              })
              flag = true
            }

            if (new Date(ATime[1]).getTime() > new Date(BTime[1]).getTime()) {
              this.$message({
                type: 'warning',
                message: '有效期结束时间应控制不能小于销售时间的结束时间'
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
          if (
            this.formInline.isBindSale == YNStatus.Yes &&
            this.formInline.Employees.length <= 0
          ) {
            this.$message.warning('请选择销售人员！')
            flag = true
          }
          if (
            this.formInline.CouponSaleType == CouponSaleType.Offline &&
            this.formInline.isBindSale == YNStatus.Yes &&
            this.formInline.GiveAmt > 0
          ) {
            let sumTarget = 0
            this.formInline.Employees.forEach(item => {
              sumTarget += parseInt(item.SaleTarget)
            })
            if (sumTarget > parseInt(this.formInline.GiveAmt)) {
              this.$message.warning('销售人员销售目标之和不能超过总数')
              flag = true
            }
          }
          if (
            this.formInline.isBindSale == YNStatus.Yes &&
            this.formInline.isReward == YNStatus.Yes
          ) {
            if (
              new Date(this.formInline.rewardStart) <
              new Date(this.formInline.Expireb)
            ) {
              this.$message({
                type: 'warning',
                message: '奖励周期的开始日期必须大于等于销售时间的开始日期'
              })
              flag = true
            }
            if (
              !this.UnSection &&
              new Date(this.formInline.rewardStop) >
                new Date(this.formInline.Expiree)
            ) {
              this.$message({
                type: 'warning',
                message: '奖励周期的结束日期必须小于等于销售时间的结束日期'
              })
              flag = true
            }
            if (this.formInline.RewardType == CouponRewardType.Step) {
              let maxSaleFlag = this.formInline.SaleItems.some(
                (item, index) => {
                  if (index < this.formInline.SaleItems.length - 1) {
                    return (
                      parseInt(item.MaxSale) >=
                        parseInt(
                          this.formInline.SaleItems[index + 1].MaxSale
                        ) || parseInt(item.MinSale) >= parseInt(item.MaxSale)
                    )
                  } else {
                    return parseInt(item.MinSale) >= parseInt(item.MaxSale)
                  }
                }
              )
              let priceFlag = this.formInline.SaleItems.some((item, index) => {
                if (index < this.formInline.SaleItems.length - 1) {
                  return (
                    item.Price * 1 >=
                    this.formInline.SaleItems[index + 1].Price * 1
                  )
                }
              })
              if (priceFlag || maxSaleFlag) {
                flag = true
                this.$message.warning('请正确设置阶梯奖励')
              }
            }
          }

          // 校验销售人员销售目标之和

          if (flag) {
            return
          }
          this.saveLoading = true
          const {
            ActiveDays,
            GiveAmt,
            Price,
            ExpireDays,
            RulePrice,
            StyleId,
            SalePrice,
            RewardPrice,
            Employees,
            SaleItems
          } = this.formInline
          SCORING_API_COUPON_BASIC_CREATE(
            Object.assign({}, this.formInline, {
              ActiveDays: +ActiveDays,
              GiveAmt: +GiveAmt,
              Price: this.$root.toInt(Price),
              ExpireDays: +ExpireDays,
              RulePrice: this.$root.toInt(RulePrice),
              StyleId: +StyleId,
              SalePrice: this.$root.toInt(SalePrice),
              RewardPrice: this.$root.toInt(RewardPrice),
              Employees: Employees.map(item => ({
                UserId: +item.UserId,
                UserName: item.UserName,
                StoreName: item.StoreName,
                SaleCode: item.SaleCode,
                SaleTarget: +item.SaleTarget,
                CharacterId: +item.CharacterId
              })),
              SaleItems: SaleItems.map(item => ({
                MinSale: +item.MinSale,
                MaxSale: +item.MaxSale,
                Price: this.$root.toInt(item.Price)
              }))
            })
          )
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: res.data.Message
                })
                this.$router.push('/market/coupon/salecardslist')
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
    },
    initValidate(rule, value, callback) {
      const reg = /^[1-9][0-9]{0,8}$/
      const flag = reg.test(value)
      if (this.formInline.RewardType == CouponRewardType.Step) {
        if (!flag) {
          callback(new Error())
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    initValidate1(rule, value, callback) {
      const reg = /^[1-9][0-9]{0,8}$/
      const flag = reg.test(value)

      if (!flag) {
        callback(new Error())
      } else {
        callback()
      }
    },
    vilidateTwoFlaot(rule, value, callback) {
      const reg = /^(?!(0[0-9]$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const flag = reg.test(value)
      if (this.formInline.RewardType == CouponRewardType.Step) {
        if (value === '') {
          callback()
        } else {
          if (!flag) {
            callback(new Error('输入有误！'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },
    enNumValidate(rule, value, callback) {
      const reg = /^[a-z-A-Z-0-9]{2,6}$/
      const flag = reg.test(value)
      const ary = this.formInline.Employees.filter(
        item => item.SaleCode == value
      )
      if (!flag || ary.length > 1) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    // 可售卡券销售价验证
    salePriceValid(rule, value, callback) {
      let reg = /^([1-9]\d{0,8})(\.\d{0,2})?$/
      if (!reg.test(value)) {
        callback(new Error('请正确输入数字'))
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

  .el-form-item__content {
    line-height: 40px;
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
  max-width: 1242px;
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
</style>
<style lang="scss">
.form {
  //.el-form-item__content
  .item-inline {
    .el-form-item__content {
      line-height: 28px !important;
    }
  }
}
</style>

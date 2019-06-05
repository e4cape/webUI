<template>
  <div
    class="ct"
    v-loading="isOpening"
  >

    <div class="header">
      <div>
        <template>
          <span class="label">开启赠送规则: </span>
          <el-switch
            name="switchOpen"
            :disabled="!canEdit"
            v-model="open"
            @change="onChange"
          >
          </el-switch>
          <span
            class="giving-date"
            v-show="opened"
          >
            <span
              class="label"
              style="font-weight: normal;"
            >礼金活动时间: </span>
            <el-switch
              name="switchTimeSetOpen"
              v-model="timeSetOpen"
              :disabled="!canEdit"
              @change="onTimeSetChange"
              style="padding-right: 10px;"
            ></el-switch>
            <template v-if="timeSetOpen && canEdit">
              <el-date-picker
                name="datePickerDateRange"
                :style="datePickerStyle"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="dateRange"
                :clearable="false"
                @change="onDateChange"
              />
              <el-select
                name="giveType"
                v-model="giveType"
                @change="goOnDateChange"
              >
                <el-option
                  v-for="item in ActivityGiveType.Types"
                  :key="item.key"
                  :label="item.title"
                  :value="+item.key"
                ></el-option>
              </el-select>
              <span class="m-l-5">{{giveTypeNote}}</span>
            </template>
            <span v-else-if="timeSetOpen">{{ dateRange | rangeText }} {{giveTypeTxt}}</span>
            <span
              v-else
              class="gray9"
            >已关闭，不送礼金</span>
          </span>
        </template>
      </div>
    </div>

    <div v-show="!opened">
      <h2 class="header-warning">
        您尚未开启赠送规则！
        开启后可以为每种材质设置不同的赠送规则。
      </h2>
    </div>

    <section
      v-if="opened"
      class="rules-container"
    >
      <section>
        <div class="container">
          <div class="rules">
            <div
              class="checkPage-hd "
              style="margin-top: 10px;"
            >
              <el-row>
                <el-col :span="12">
                  <i class="icon-list"></i>
                  <span class="title">消费送积分/礼金</span>
                </el-col>
                <el-col
                  :span="12"
                  class="tr"
                >
                </el-col>
              </el-row>
            </div>
            <section class="checkPage-hd">
              <span style="margin-right: 10px;">实付金额计算方式: </span>
              <el-radio-group
                name="radioGroupIsDeducted"
                :disabled="!canEdit"
                v-model="isDeducted"
                @change="onDeductedChange"
              >
                <el-radio :label="false">不扣除手工旧货
                  <el-tooltip
                    placement="bottom"
                    content="按货品实付金额计算"
                  >
                    <span class="hint">?</span>
                  </el-tooltip>
                </el-radio>
                <el-radio :label="true">扣除手工旧货
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      根据零售单实付金额，按照零售单中新品实付金额所占比率计算该新品应得积分/礼金。
                      例如：新品a实付金额为100元，新品b实付金额为200元，旧货回收150元，则该零售单实付金额为150元，如果1元赠送1个积分，新品a赠送150×(100÷(100+200))=50积分，新品b赠送150×(200÷(100+200))=100积分
                    </div>
                    <span class="hint">?</span>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </section>
            <el-row
              class="rules-options"
              :gutter="24"
            >
              <el-col
                :class="ruleHeaderClazz"
                :span="24"
                :gutter="24"
              >
                <el-col :span="2">材质类型</el-col>
                <el-col
                  v-for="(s) in sort"
                  :key="s.value"
                  :span=" canEdit ? 10 : 11"
                >
                  <span>
                    赠送{{s.description}}
                  </span>
                  <!-- <span
                    class="giving-date"
                    v-if="s.value == 2"
                  >
                    <span
                      class="label"
                      style="font-weight: normal;"
                    >活动时间: </span>
                    <el-switch
                      name="switchTimeSetOpen"
                      v-model="timeSetOpen"
                      :disabled="!canEdit"
                      @change="onTimeSetChange"
                      style="padding-right: 10px;"
                    ></el-switch>
                    <template v-if="timeSetOpen && canEdit">
                      <el-date-picker
                        name="datePickerDateRange"
                        :style="datePickerStyle"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        v-model="dateRange"
                        :clearable="false"
                        @change="onDateChange"
                      />
                      <el-select
                        name="giveType"
                        v-model="giveType"
                        @change="goOnDateChange"
                      >
                        <el-option
                          v-for="item in ActivityGiveType.Types"
                          :key="item.key"
                          :label="item.title"
                          :value="+item.key"
                        ></el-option>
                      </el-select>
                    </template>
                    <span v-else-if="timeSetOpen">{{ dateRange | rangeText }}</span>
                  </span> -->
                </el-col>
                <el-col
                  :span="2"
                  v-if="canEdit"
                >操作
                </el-col>
              </el-col>
              <el-col class="rule-items">
                <rule-item
                  v-for="(rule) in rules"
                  :editable="canEdit"
                  :key="rule.materialType"
                  :rule="rule"
                  :sort="sort"
                  @set-editing="editingId = $event"
                  :isEditing="!!editingId === true"
                  @success="onRuleSuccess"
                  :isActive="editingId === rule.materialType"
                />
              </el-col>
            </el-row>
          </div>

          <div>
            <div
              class="checkPage-hd"
              style="margin-top: 10px;"
            >
              <el-row>
                <el-col :span="12">
                  <i class="icon-list"></i>
                  <span class="title">特定日期加倍赠送</span>
                </el-col>
                <el-col
                  :span="12"
                  class="tr"
                >
                </el-col>
              </el-row>
            </div>
            <el-row
              class="date-rules"
              :gutter="24"
            >

              <el-col
                class="col-header"
                :span="24"
                :gutter="24"
              >
                <el-col :span="2">日期名称</el-col>
                <el-col :span="4">日期</el-col>
                <el-col :span="6">赠送倍率</el-col>
                <el-col :span="6">备注</el-col>
                <el-col :span=" canEdit ? 4 : 6">状态</el-col>
                <el-col
                  :span="2"
                  v-if="canEdit"
                >操作</el-col>
              </el-col>
              <date-rule
                :editable="canEdit"
                @set-edit="onSetDateRule"
                v-for="(rule, index) in dateRules"
                @delete="onDateRuleDelete"
                :key="index"
                :rule="rule"
              />
            </el-row>
            <div
              style="margin-top: 10px; margin-left: 40px;"
              v-if="canEdit"
            >
              <span class="add-action">
                <i class="el-icon-plus"></i>
                <span
                  name="clickAddDateRule"
                  @click="addDateRule"
                >添加规则</span>
              </span>
              <span class="sub">(最多添加20个)</span>
            </div>
          </div>
          <div class="footer-note">注：有效期填0，表示永久有效。最多可设置20个特定日期，如果日期重复，按最高的倍率赠送，不叠加。</div>
        </div>
      </section>
      <date-rule-modal
        @success="onDateRuleSuccess"
        :visible.sync="ruleModelOpen"
        :isCreate="isCreate"
        :init="changeDateRule"
      />
    </section>

  </div>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGGLOBAL_SEARCH,
  MEMBERSHIP_API_SETTINGGLOBAL_ENABLED,
  MEMBERSHIP_API_SETTINGGLOBAL_DISABLE,
  MEMBERSHIP_API_SCORERULE_SEARCH,
  MEMBERSHIP_API_SCORERULE_SEARCHBYRATERULES,
  MEMBERSHIP_API_SETTINGGLOBAL_SETACTIVITYPOWER,
  MEMBERSHIP_API_SETTINGGLOBAL_GETACTIVITYPOWER
} from '@/apis/membership'
import { YNStatus } from '@/enums/common.js'
import { SettingGlobalTypes, ActivityGiveType } from '@/enums/membership'
import { debounce } from 'lodash'
import DateRule from './dateRule'
import RuleItem from './ruleItem'
import DateRuleModal from './dateRuleModal'
import dayjs from 'dayjs'

export default {
  components: {
    DateRule,
    RuleItem,
    DateRuleModal
  },
  data() {
    return {
      ActivityGiveType: ActivityGiveType,
      // layout
      open: false,
      type: SettingGlobalTypes.GiveRule,
      opened: false,
      // pager
      loading: false,
      isDeducted: false,
      rules: [],
      sort: [],
      dateRules: [],
      editingId: '',
      isCreate: false,
      ruleModelOpen: false,
      changeDateRule: {},
      timeSetOpen: false,
      giveType: ActivityGiveType.GoldenRice,
      dateRange: [],
      isOpening: false
    }
  },
  filters: {
    rangeText(val) {
      if (!Array.isArray(val)) {
        return ''
      }
      const format = 'YYYY-MM-DD'
      return val
        .map(s => {
          return dayjs(s).format(format)
        })
        .join(' ~ ')
    }
  },
  computed: {
    datePickerStyle() {
      return {
        opacity: this.timeSetOpen ? 1 : 0,
        'padding-left': '2px',
        'max-width': '250px'
      }
    },
    ruleHeaderClazz() {
      return ['col-header', this.rules.length > 12 ? 'is-scrollable' : '']
    },
    // 可以在一号多店的总部修改
    // 可以在一号一店修改
    canEdit() {
      return this.isOneNumberManyShopCompany || this.isOneNumberOneStore
    },
    giveTypeTxt() {
      let obj = {}
      ActivityGiveType.Types.forEach(item => {
        obj[item.key] = item.title
      })
      return obj[this.giveType]
    },
    giveTypeNote() {
      if (this.giveType == ActivityGiveType.GoldenRiceAndScore) {
        return '在活动时间内，即送礼金又送积分'
      } else if (this.giveType == ActivityGiveType.GoldenRiceOrScore) {
        return '在活动时间内，满足了送礼金的条件就送礼金，否则就送积分'
      } else {
        return '在活动时间内只送礼金'
      }
    }
  },
  methods: {
    async onChange(val) {
      try {
        this.isOpening = true
        const api = val
          ? MEMBERSHIP_API_SETTINGGLOBAL_ENABLED
          : MEMBERSHIP_API_SETTINGGLOBAL_DISABLE
        const {
          data: { Code }
        } = await api(this.type)
        if (Code === 'CORRECT') {
          this.opened = val
          val && this.getData()
        }
      } catch (err) {
        throw new Error(err)
      } finally {
        this.isOpening = false
      }
    },
    async initRequest() {
      const res = await MEMBERSHIP_API_SETTINGGLOBAL_SEARCH(this.type)
      if (res.data.Code === 'CORRECT') {
        this.opened = res.data.Data
        this.open = res.data.Data
        this.getData()
      }
    },
    async onDateRuleDelete(model) {
      const index = this.dateRules.findIndex(d => d.rateId === model.rateId)
      this.dateRules.splice(index, 1)
    },
    async onDeductedChange(val) {
      const type = SettingGlobalTypes.Deducted
      const api = val
        ? MEMBERSHIP_API_SETTINGGLOBAL_ENABLED
        : MEMBERSHIP_API_SETTINGGLOBAL_DISABLE
      const res = await api(type)
      if (res.data.Code === 'CORRECT') {
        this.$message.success('操作成功!')
      }
    },
    onDateRuleSuccess(model) {
      if (this.isCreate) {
        this.dateRules.push(model)
      } else {
        const index = this.dateRules.findIndex(d => d.rateId === model.rateId)
        this.dateRules.splice(index, 1, model)
      }
      this.ruleModelOpen = false
    },
    addDateRule() {
      if (this.dateRules.length >= 20) {
        this.$message.warning('已达上限!')
        return
      } else {
        this.isCreate = true
        this.changeDateRule = {}
        this.ruleModelOpen = true
      }
    },
    onSetDateRule(rule) {
      this.isCreate = false
      this.changeDateRule = rule
      this.ruleModelOpen = true
    },
    onRuleSuccess(rule) {
      const index = this.rules.findIndex(
        r => r.materialType === rule.materialType
      )
      this.rules.splice(index, 1, rule)
      this.editingId = ''
    },
    async getData() {
      if (!this.opened) {
        return
      }
      const self = this
      this.loading = true
      try {
        const res = await Promise.all([
          MEMBERSHIP_API_SCORERULE_SEARCH('').then(res => res.data.Data),
          MEMBERSHIP_API_SCORERULE_SEARCHBYRATERULES().then(
            res => res.data.Data
          ),
          MEMBERSHIP_API_SETTINGGLOBAL_GETACTIVITYPOWER().then(
            res => res.data.Data
          )
        ])
        const [rules, dateRules, dateData] = res
        Object.keys(rules).forEach(k => {
          self[k] = rules[k]
        })
        // self.rules = self.rules.slice(0, 5)
        this.dateRules = dateRules
        if (dateData) {
          const { dateStart, dateEnd, isOpen, giveType } = dateData.powerString
          this.dateRange = dateStart ? [dateStart, dateEnd] : []
          this.timeSetOpen = isOpen === YNStatus.Yes
          this.giveType =
            giveType > 0 ? giveType + '' : ActivityGiveType.GoldenRice
        }
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },
    goOnDateChange() {
      this.loading = true
      const { dateRange, giveType } = this
      const param = {
        powerString: {
          dateStart: dateRange[0],
          dateEnd: dateRange[1],
          isOpen: this.timeSetOpen ? YNStatus.Yes : YNStatus.No,
          giveType
        }
      }
      MEMBERSHIP_API_SETTINGGLOBAL_SETACTIVITYPOWER(param)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('活动时间设置成功!')
          }
          this.loading = false
        })
        .catch(() => (this.loading = false))
    },
    async onDateChange([dateStart, dateEnd]) {
      this.loading = true
      const res = await MEMBERSHIP_API_SETTINGGLOBAL_SETACTIVITYPOWER({
        powerString: {
          dateStart,
          dateEnd,
          isOpen: this.timeSetOpen ? YNStatus.Yes : YNStatus.No,
          giveType: this.giveType
        }
      })
      if (res.data.Code === 'CORRECT') {
        this.$message.success('活动时间设置成功!')
      }
      this.loading = false
    },
    async onTimeSetChange(val) {
      const { dateRange } = this
      await MEMBERSHIP_API_SETTINGGLOBAL_SETACTIVITYPOWER({
        powerString: {
          isOpen: val ? YNStatus.Yes : YNStatus.No,
          dateStart: dateRange[0],
          dateEnd: dateRange[1],
          giveType: this.giveType
        }
      })
    }
  },
  created() {
    this.onChange = debounce(this.onChange, 300)
    this.onDeductedChange = debounce(this.onDeductedChange, 300)
    this.onTimeSetChange = debounce(this.onTimeSetChange, 300)
  },
  async mounted() {
    this.initRequest()
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
$border-color: #e5e5e5;

.header-warning {
  background: #faf7e3;
  color: #da0000;
  padding: 20px 0;
  text-align: center;
  margin-top: 12px;
}
.rules-options {
  min-width: 1086px;
  border-bottom: 1px solid $border-color;
  .rule-items {
    max-height: 480px;
    overflow-y: auto;
    padding-left: 0 !important;
    padding-right: 0 !important;
    .el-col {
      padding-right: 0 !important;
      padding-left: 0 !important;
    }
  }
  .col-header {
    > div {
      font-weight: bold;
      &:first-child {
        padding-left: 20px !important;
      }
    }
    > div:not(:last-child) {
      border-right: 1px solid $border-color;
    }
  }
}
.hint {
  background: #94bcd8;
  font-size: 14px;
  color: white;
  line-height: 20px;
  display: inline-block;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  transform: scale(0.6);
}

.col-header {
  line-height: 30px;
  background: #f5f5f5;
  border-bottom: 1px solid $border-color;
  border-top: 1px solid $border-color;

  padding-left: 0 !important;
  padding-right: 0 !important;
  &.is-scrollable {
    padding-right: 17px !important;
  }
  > div {
    &.el-col {
      padding-right: 0 !important;
      padding-left: 0 !important;

      &:nth-child(2),
      &:nth-child(3) {
        @media screen and (max-width: 1920px) {
          padding-left: 30px !important;
        }
      }
      &:last-child {
        padding-left: 30px !important;
      }
    }
  }
}

.rules-container {
  border: 1px solid $border-color;
  margin: 10px 0px;
  :global(.el-col) {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  :global(.el-row) {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
}

.add-action {
  color: #1f91df;
  cursor: pointer;
}

.sub {
  color: #777;
}

.footer-note {
  color: #da0000;
  line-height: 36px;
  height: 36px;
  margin-top: 18px;
}
.sub {
  color: #ffa200;
  padding-left: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 24px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
}

.ct {
  min-width: 1125px;
}

.label {
  padding: 0 5px;
}
.giving-date {
  margin-left: 10px;
  display: inline-flex;
  justify-items: center;
  align-items: center;
}
</style>


<template>
  <el-col class="date-rule" :span="24" :gutter="24">
    <el-col :span="2">{{rule.dateName}}</el-col>
    <el-col :span="4">{{dateText}}</el-col>
    <el-col :span="6">
      积分按
      <span class="number">{{rule.scoreRate}}</span> 倍赠送,
      礼金按
      <span class="number">{{rule.goldenRiceRate}}</span> 倍赠送
    </el-col>
    <el-col :span="6">
      <span>{{rule.remark || '&nbsp;'}}</span>
    </el-col>
    <el-col :span="editable ? 4 : 6 ">
      <el-switch name="switchOnStatuesChange" @change="onStatuesChange" :disabled="!editable" v-model="open"></el-switch>
    </el-col>
    <el-col :span="2" v-if="editable">
      <div>
        <el-button name="btnEdit" type="text" @click="$emit('set-edit', rule)">编辑</el-button>
        <el-button name="btnDel" v-if="!isBirth" type="text" @click="onDelete">删除</el-button>
      </div>
    </el-col>
  </el-col>
</template>

<script>
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { YNStatus } from '@/enums/common'
import { RateRuleTypes } from '@/enums/membership'
import {
  MEMBERSHIP_API_SCORERULE_UPDATESTATUSBYRATERULE,
  MEMBERSHIP_API_SCORERULE_DELETEBYRATERULE
} from '@/apis/membership'
export default {
  props: {
    rule: Object,
    editable: Boolean,
  },
  components: {},
  data() {
    return {
      open: this.rule.state == YNStatus.Yes
    }
  },
  watch: {
    rule(newVal) {
      this.open = newVal.state == YNStatus.Yes
    }
  },
  computed: {
    isBirth() {
      return this.rule.type == RateRuleTypes.Birthday || this.rule.type == RateRuleTypes.Commemorate
    },
    dateText() {
      if (this.rule.type == RateRuleTypes.Birthday) {
        return '生日当天'
      } else if (this.rule.type == RateRuleTypes.Commemorate) {
        return '纪念日当天'
      }
      const { dateStart, dateEnd } = this.rule
      const format = 'YYYY年MM月DD日'
      if (dateStart && dateEnd) {
        const s = dayjs(dateStart)
        const e = dayjs(dateEnd)
        const isSameYear = s.year() === e.year()
        const endFormat = isSameYear ? 'MM月DD日' : format
        return `${dayjs(dateStart).format(format)}~${dayjs(dateEnd).format(
          endFormat
        )}`
      }
      return dayjs(dateStart).format(format)
    }
  },
  methods: {
    async onStatuesChange(val) {
      const res = await MEMBERSHIP_API_SCORERULE_UPDATESTATUSBYRATERULE({
        rateId: this.rule.rateId,
        state: val ? YNStatus.Yes : YNStatus.No
      })
      if (res.data.Code === 'CORRECT') {
        this.$message.success('状态设置成功!')
        let rule = JSON.parse(JSON.stringify(this.rule))
        rule.state = val ? YNStatus.Yes : YNStatus.No
        this.$emit('statusChange', rule)
      }
    },
    async onDelete() {
      const res = await MEMBERSHIP_API_SCORERULE_DELETEBYRATERULE(
        this.rule.rateId
      )
      if (res.data.Code === 'CORRECT') {
        this.$message.success('删除成功!')
        this.$emit('delete', this.rule)
      }
    }
  },
  created() {
    this.onStatuesChange = debounce(this.onStatuesChange, 300)
  }
}
</script>

<style lang="scss" scoped>
.date-rule {
  line-height: 32px;
  height: 32px;
  border-bottom: 1px solid #d9d9d9;
  > div {
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
    word-break: keep-all;
  }
}
.number {
  color: #ffa200;
  font-weight: bold;
}
</style>

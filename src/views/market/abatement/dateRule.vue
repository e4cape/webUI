<template>
  <el-col
    class="date-rule"
    :span="24"
    :gutter="24"
  >
    <el-col :span="2">{{rule.dateName}}</el-col>
    <el-col :span="4">{{dateText}}</el-col>
    <el-col :span="6">
      积分按 <span class="number">{{rule.scoreRate}}</span> 倍赠送,
      礼金按 <span class="number">{{rule.goldenRiceRate}}</span> 倍赠送
    </el-col>
    <el-col :span="6"><span>{{rule.remark || '&nbsp;'}}</span></el-col>
    <el-col :span="editable ? 4 : 6 ">
      <el-switch
        name="switchStatus"
        @change="onStatuesChange"
        :disabled="!editable"
        v-model="open"
      ></el-switch>
    </el-col>
    <el-col
      :span="2"
      v-if="editable"
    >
      <div>
        <el-button
          name="btnEdit"
          type="text"
          @click="$emit('set-edit', rule)"
        >编辑</el-button>
        <el-button
          name="btnDel"
          v-if="!isBirth"
          type="text"
          @click="onDelete"
        >删除</el-button>
      </div>
    </el-col>
  </el-col>
</template>

<script>
import {
  debounce 
} from 'lodash'
import dayjs from 'dayjs'
import {
  YNStatus 
} from '@/enums/marketing'
import {
  MEMBERSHIP_API_SCORERULE_UPDATESTATUSBYRATERULE,
  MEMBERSHIP_API_SCORERULE_DELETEBYRATERULE
} from '@/apis/membership'
export default {
  /**
     * rateId (string, optional): 主键id ,
       dateName (string, optional): 特定日期名称 ,
dateStart (string, optional): 开始时间 ,
dateEnd (string, optional): 结束时间 ,
scoreRate (number, optional): 起送倍率值 ,
goldenRiceRate (number, optional): 赠送倍率 ,
remark (string, optional): 备注 ,
type (integer, optional): 类型 = ['0', '1'],
state (integer, optional): 状态 = ['1', '3'],
createUserId (integer, optional): 创建人Id ,
createUser (string, optional): ,
createTime (string, optional): ,
characterId (integer, optional): 角色id
     */
  props: ['rule', 'editable'],
  components: {
  },
  data() {
    return {
      open: this.rule.state == YNStatus.Yes
    }
  },
  watch: {
    rule(newVal, oldVal) {
      this.open = newVal.state == YNStatus.Yes
    }
  },
  computed: {
    isBirth() {
      return this.rule.type == 0
    },
    dateText() {
      if (this.isBirth) {
        return '生日当天'
      }
      const {
        dateStart, dateEnd 
      } = this.rule
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

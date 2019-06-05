<template>
  <div class="detail">
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">对赌类型：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{WagerType.Types[Detail.WagerType]}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">姓名：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.UserName || ''}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">职位：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.Position}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="Detail.WagerType===WagerType.Team">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">对赌业绩团队：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.Department}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">对赌业绩目标：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{priceFormatter(Detail.TargetPrice)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">对赌金额：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{priceFormatter(Detail.BasicPrice)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">业绩完成奖励金额：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{priceFormatter(Detail.RewardPrice)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">对赌业绩周期：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.CycleMonths ? Detail.CycleMonths + '个月' : ''}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">每月扣减金额：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{priceFormatter(Detail.DecredPrice)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">开始日期：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.Expireb | filterDate}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">创建时间：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.CreateTime}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">创建人：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">{{Detail.CreateUser}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" style="text-align:right">
        <div class="grid-content bg-purple">状态：</div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple" style="word-break: break-all;">
          <span :class="Detail.Status | findKey(AuditStatus)">{{AuditStatus.Types[Detail.Status]}}</span>
          <span v-if="Detail.Status===AuditStatus.Reject||Detail.Status===AuditStatus.Abandon">{{Detail.CheckNote ? '(' + Detail.CheckNote +')' :''}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { JunkInnOrderBasicState } from '@/enums/marketing'
import { WagerType } from '@/enums/performance'
export default {
  data() {
    return {
      AuditStatus: JunkInnOrderBasicState,
      WagerType
    }
  },
  methods: {
    priceFormatter(value) {
      return '￥' + this.$root.toFloat(value)
    }
  },
  props: {'Detail': Object},
}
</script>
<style scoped lang="scss">
.detail .el-row {
  margin-bottom: 10px;
}
</style>
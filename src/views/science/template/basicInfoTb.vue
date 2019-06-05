<template>
  <div
    class="basic-info-tb"
    v-loading="loadingBasic"
  >
    <div class="top">
      基本信息
      <slot></slot>
    </div>
    <table>
      <tbody>
        <tr>
          <th
            rowspan="4"
            class="sp"
          >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Draft"
              src="@/assets/images/state_draft.png"
            >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Wait"
              src="@/assets/images/state_wait.png"
            >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Audit"
              src="@/assets/images/state_pass.png"
            >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Reject"
              src="@/assets/images/state_return.png"
            >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Abandon"
              src="@/assets/images/state_invalid.png"
            >
            <img
              v-if="basicInfo.State == EnumInfrastCourseState.Cancel"
              src="@/assets/images/state_cancel.png"
            >
            {{EnumInfrastCourseState.Types[basicInfo.State]}}
          </th>
          <th>标题</th>
          <td>{{basicInfo.CourseTitle}}</td>
          <th>创建</th>
          <td>{{basicInfo.CreateUser}} {{basicInfo.CreateTime | filterDateTime}}</td>
          <th>审核</th>
          <td>{{basicInfo.CheckUser}} {{basicInfo.CheckTime | filterDateTime}}</td>
        </tr>
        <tr>
          <th v-if="channelType == EnumInfrastCourseChannelType.System">所属系统</th>
          <th v-else>所属课程</th>
          <td v-if="basicInfo.LargeName">{{basicInfo.LargeName + (basicInfo.SmallName ? '>' + basicInfo.SmallName : '')}}</td>
          <td v-else></td>
          <th>套餐要求</th>
          <td>{{basicInfo.PackName}}</td>
          <th>是否考试</th>
          <td>{{EnumYNStatus.Types[basicInfo.IsPaper]}}</td>
        </tr>
        <tr v-if="basicInfo.IsPaper == EnumYNStatus.No">
          <th></th>
          <td></td>
          <th></th>
          <td></td>
          <th></th>
          <td></td>
        </tr>
        <tr v-if="basicInfo.IsPaper == EnumYNStatus.Yes">
          <th>考试单选题</th>
          <td>{{basicInfo.SingleQty}}题，每题{{basicInfo.SingleScore}}分</td>
          <th>考试多选题</th>
          <td>{{basicInfo.MultiQty}}题，每题{{basicInfo.MultiScore}}分</td>
          <th>考试限时</th>
          <td>{{basicInfo.ExamTime}}分钟</td>
        </tr>
        <tr v-if="basicInfo.IsPaper == EnumYNStatus.Yes">
          <th>总分</th>
          <td>{{basicInfo.TotalScore}}</td>
          <th>合格分数</th>
          <td>{{basicInfo.PassScore}}分</td>
          <th></th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { YNStatus } from '@/enums/common'
import { InfrastCourseState, InfrastCourseChannelType } from '@/enums/science'
export default {
  props: {
    channelType: {
      // 系统还是学院
      type: Number,
      default: InfrastCourseChannelType.System
    },
    basicInfo: {
      // 基本信息数据
      type: Object
    },
    loadingBasic: {
      // loading
      type: Boolean,
      default: false
    }
  },
  computed: {
    EnumYNStatus() {
      return YNStatus
    },
    EnumInfrastCourseState() {
      return InfrastCourseState
    },
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  }
}
</script>
<style lang="scss" scoped>
.basic-info-tb {
  .top {
    position: relative;
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    border: 1px solid $border-color;
    border-bottom: 0;
    background: $bg-color;
    button {
      position: absolute;
      top: 2px;
      right: 10px;
    }
  }
  table {
    border: 1px solid $border-color;
    tr {
      border-bottom: 1px solid $border-color;
      th {
        width: 120px;
        height: 33px;
        border-left: 1px solid $border-color;
        border-right: 1px solid $border-color;
        background: $bg-color;
        text-align: center;
        &.sp {
          width: 100px;
          background: $white;
          img {
            display: block;
            margin: 0 auto 10px;
          }
        }
      }
      td {
        line-height: 24px;
        min-width: 200px;
        padding: 4px 10px;
      }
    }
  }
}
</style>
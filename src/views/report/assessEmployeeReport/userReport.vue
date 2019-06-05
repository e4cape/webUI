<template>
  <div>
    <div class="report-t">
      <h2>员工犒赏统计报表</h2>
      <p v-if="form.createTime1">{{form.createTime1}} 至 {{form.createTime2}}</p>
    </div>
    <el-table :data="[summary]" :show-header="false">
      <el-table-column align="center">
        <template>
          姓名:
          <span class="text-warning fw-b">{{summary.TrueName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被评分总次数：
          <span class="text-warning fw-b">{{summary.StarAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被犒赏总次数：
          <span class="text-warning fw-b">{{summary.AssessAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被犒赏金额合计：
          <span class="text-danger fw-b">{{$root.toFloat(summary.AssessPrice)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10">
      <el-table-column label="时间" prop="CreateTime" width="100" show-overflow-tooltip>
        <template slot-scope="scoped">{{scoped.row.CreateTime | filterDate}}</template>
      </el-table-column>
      <el-table-column label="流水号" prop="TradeID" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="犒赏人帐号" prop="AccountID" min-width="160" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="被犒赏次数" prop="AssessAmt" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="评分" width="180px">
        <template slot-scope="scoped">
          <el-rate name="AssessStar" v-model="scoped.row.AssessStar" disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column label="犒赏金额" prop="AssessPrice" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.AssessPrice)}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    summary: {
      type: Object
    },
    form: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    characterType: [String, Number]

  }
}
</script>

<style scoped>
</style>
<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="financeDay" :class="{'active': $route.path.indexOf('financeDay') > -1}" @click="$router.push({path:'/information/financeReport/financeDay'})">
        收支日报
      </span>
      <span class="tab" name="financeWeek" :class="{'active': $route.path.indexOf('financeWeek') > -1}" @click="$router.push({path:'/information/financeReport/financeWeek'})">
        收支周报
      </span>
      <span class="tab" name="financeMonth" :class="{'active': $route.path.indexOf('financeMonth') > -1}" @click="$router.push({path:'/information/financeReport/financeMonth'})">
        收支月报
      </span>
      <span class="tab" name="financeQuarter" :class="{'active': $route.path.indexOf('financeQuarter') > -1}" @click="$router.push({path:'/information/financeReport/financeQuarter'})">
        收支季报
      </span>
      <span class="tab" name="financeYear" :class="{'active': $route.path.indexOf('financeYear') > -1}" @click="$router.push({path:'/information/financeReport/financeYear'})">
        收支年报
      </span>
    </div>
    <div class="panel">
      <router-view :ExportColumns="ExportColumns"></router-view>
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      ExportColumns: [
        {
          FieldEnName: 'DateTimeName',
          FieldCnName: '日期',
        },
        {
          FieldEnName: 'InnSaleGoldPrice',
          FieldCnName: '素金销售',
          Precision: 2
        },
        {
          FieldEnName: 'InnSaleUngoldPrice',
          FieldCnName: '非素销售',
          Precision: 2
        },
        {
          FieldEnName: 'InnRepairPrice',
          FieldCnName: '维修费',
          Precision: 2
        },
        {
          FieldEnName: 'InnOtherPrice',
          FieldCnName: '其他收入',
          Precision: 2
        },
        {
          FieldEnName: 'InnTotalPrice',
          FieldCnName: '收入小计',
          Precision: 2
        },
        {
          FieldEnName: 'OutPeriodPrice',
          FieldCnName: '期初支出',
          Precision: 2
        },
        {
          FieldEnName: 'OutJunkGoldPrice',
          FieldCnName: '素金成本',
          Precision: 2
        },
        {
          FieldEnName: 'OutJunkUngoldPrice',
          FieldCnName: '非素成本',
          Precision: 2
        },
        {
          FieldEnName: 'OutSalaryPrice',
          FieldCnName: '工资',
          Precision: 2
        },
        {
          FieldEnName: 'OutRentPrice',
          FieldCnName: '房租',
          Precision: 2
        },
        {
          FieldEnName: 'OutWaterPrice',
          FieldCnName: '水电',
          Precision: 2
        },
        {
          FieldEnName: 'OutJumbPrice',
          FieldCnName: '杂费',
          Precision: 2
        },
        {
          FieldEnName: 'OutOtherPrice',
          FieldCnName: '其他支出',
          Precision: 2
        },
        {
          FieldEnName: 'OutTotalPrice',
          FieldCnName: '支出小计',
          Precision: 2
        },
        {
          FieldEnName: 'ProfitPrice',
          FieldCnName: '纯利润',
          Precision: 2
        },
        {
          FieldEnName: 'RepayRate',
          FieldCnName: '投资回报率',
          Precision: 2
        },
      ]
    }
  },
  methods: {
  },
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
/deep/ .date-tips {
  margin-left: 10px;
  line-height: 28px;
  font-size: 12px;
  color: red;
}
/deep/ .report-tips {
  margin: 10px;
  line-height: 32px;
}
/deep/ .echarts {
  width: 100%;
}
.panel /deep/ .el-table {
  border-left-width: 0;
  &::after {
    width: 0;
  }
  thead tr:first-child,
  tbody tr:first-child {
    td:last-child,
    th:nth-last-child(-1) {
      border-right: none;
    }
  }
}
</style>

<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd" style="line-height: 40px;">
        <el-select v-model="year" :filterable="true" name="btnSelectYear">
          <el-option v-for="(item, index) in years" :key="index" :label="item" :value="item"></el-option>
        </el-select>
        <span class="year-price">
          年度期初支出资金(元)
          <b>：{{yearDetail.YearPrice | initPrice}}</b>
        </span>
        <el-button type="text" name="btnModifyFinance" @click="editDialogVisible=true">修改</el-button>
      </div>
      <div class="panel-bd">
        <el-row :gutter="20" class="p-10">
          <el-col :span="4">
            <el-radio-group name="btnSelectMonth" v-model="month" class="month-check">
              <el-radio-button v-for="(item, index) in 12" :key="index" :label="item">{{item}}月</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="20">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-table :data="outData">
                  <el-table-column prop="Name" label="支出项目" min-width="100"></el-table-column>
                  <el-table-column prop="Value" label="预算金额" min-width="100">
                    <template slot-scope="scope">
                      <el-input
                        name="PeriodPrice"
                        v-model="monthDetail[scope.row.Item]"
                        @keyup.native="monthDetail[scope.row.Item] = $root.toFixed(monthDetail[scope.row.Item], 2)"
                        v-if="scope.row.Item != 'PeriodPrice' && scope.row.Item != 'OutTotalPrice'"
                        :maxlength="10"
                      ></el-input>
                      <span v-else>{{monthDetail[scope.row.Item]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <el-table :data="inData">
                  <el-table-column prop="Name" label="收入项目" min-width="100"></el-table-column>
                  <el-table-column prop="Value" label="预算金额" min-width="100">
                    <template slot-scope="scope">
                      <el-input
                        name="InnTotalPrice"
                        v-model="monthDetail[scope.row.Item]"
                        @keyup.native="monthDetail[scope.row.Item] = $root.toFixed(monthDetail[scope.row.Item], 2)"
                        v-if="scope.row.Item != 'InnTotalPrice'"
                        :maxlength="10"
                      ></el-input>
                      <span v-else>{{monthDetail[scope.row.Item]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <div class="buttons">
              <el-button name="btnCancelEdit" type="primary" @click="save" :loading="$store.getters.is_loading">保存</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- End panel -->
    <!-- @module 修改期初支出资金 -->
    <el-dialog title="修改期初支出资金" :visible.sync="editDialogVisible">
      <el-form label-position="right" label-width="150px">
        <el-form-item :label="year + '年度期初支出资金：'">
          <el-input name="btnPayPrice" v-model="editPrice" @keyup.native="editPrice = $root.toFixed(editPrice, 2)" :maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <el-alert type="warning" :closable="false">年度期初支出资金是本年度经营开支的金额，平摊到每天，用于统计店铺的总支出，计算利润和投资回报率。例如开店的装修、设备购买等费用，不包括货品采购、工资、房租、水电等日常开支。</el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnEditPriceYear" type="primary" @click="editPriceYear" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancelEdit" @click="editDialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 修改期初支出资金 -->
  </div>
</template>

<script>
import {
  STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_REQ,
  STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_REQ,
  STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_UPDATE,
  STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_CREATE,
  STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_UPDATE
} from '@/apis/stocking.js'

export default {
  data() {
    return {
      years: [],
      year: new Date().getFullYear(),
      yearDetail: {},
      month: new Date().getMonth() + 1,
      monthDetail: {
        PeriodPrice: 0,
        SalaryPrice: 0,
        RentPrice: 0,
        WaterPrice: 0,
        JumbPrice: 0,
        OtherPrice: 0,
        OutTotalPrice: 0,
        InnTotalPrice: 0
      }, // 月度预算
      outData: [
        {
          Name: '期初支出(年份平摊为月份)',
          Item: 'PeriodPrice'
        },
        {
          Name: '工资',
          Item: 'SalaryPrice'
        },
        {
          Name: '房租',
          Item: 'RentPrice'
        },
        {
          Name: '水电',
          Item: 'WaterPrice'
        },
        {
          Name: '杂费',
          Item: 'JumbPrice'
        },
        {
          Name: '其他支出',
          Item: 'OtherPrice'
        },
        {
          Name: '小计',
          Item: 'OutTotalPrice'
        }
      ],
      inData: [
        {
          Name: '其他收入',
          Item: 'IotherPrice'
        },
        {
          Name: '小计',
          Item: 'InnTotalPrice'
        }
      ],
      editDialogVisible: false,
      editPrice: 0
    }
  },
  methods: {
    init() {
      this.getYearPrice()
    },
    getYearPrice() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_REQ({
        Year: this.year
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data && res.data.Data.YearlyId) {
            this.yearDetail = res.data.Data
            this.editPrice = this.$root.toFloat(this.yearDetail.YearPrice)
            this.getMonthDetail()
          } else {
            this.editPrice = 0
            this.createPriceYear()
          }
        }
      })
    },
    getMonthDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_REQ({
        Year: this.year,
        Month: this.month
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          let monthDetail = res.data.Data
          monthDetail.PeriodPrice = this.$root.toFloat(monthDetail.PeriodPrice)
          monthDetail.SalaryPrice = this.$root.toFloat(monthDetail.SalaryPrice)
          monthDetail.RentPrice = this.$root.toFloat(monthDetail.RentPrice)
          monthDetail.WaterPrice = this.$root.toFloat(monthDetail.WaterPrice)
          monthDetail.JumbPrice = this.$root.toFloat(monthDetail.JumbPrice)
          monthDetail.OtherPrice = this.$root.toFloat(monthDetail.OtherPrice)
          monthDetail.IotherPrice = this.$root.toFloat(monthDetail.IotherPrice)
          monthDetail.OutTotalPrice = this.$root.toFloat(monthDetail.OutTotalPrice)
          monthDetail.InnTotalPrice = this.$root.toFloat(monthDetail.InnTotalPrice)
          this.monthDetail = monthDetail
        }
      })
    },
    save() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_UPDATE({
        YearlyId: this.yearDetail.YearlyId,
        MonthlyId: this.monthDetail.MonthlyId,
        SalaryPrice: this.$root.toInt(this.monthDetail.SalaryPrice),
        RentPrice: this.$root.toInt(this.monthDetail.RentPrice),
        WaterPrice: this.$root.toInt(this.monthDetail.WaterPrice),
        JumbPrice: this.$root.toInt(this.monthDetail.JumbPrice),
        OtherPrice: this.$root.toInt(this.monthDetail.OtherPrice),
        IotherPrice: this.$root.toInt(this.monthDetail.IotherPrice)
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('修改成功')
          this.getMonthDetail()
        }
      })
    },
    createPriceYear() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_CREATE({
        Year: this.year,
        YearPrice: 0
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存成功')
          this.getYearPrice()
        }
      })
    },
    editPriceYear() {
      if (!this.editPrice || isNaN(this.editPrice)) {
        this.$message.warning('请输入正确的年度期初支出资金')
        return false
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_UPDATE({
        YearlyId: this.yearDetail.YearlyId,
        YearPrice: this.$root.toInt(this.editPrice)
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.yearDetail.YearPrice = this.$root.toInt(this.editPrice)
          this.getMonthDetail()
        }
      })
    }
  },
  beforeMount() {
    let nYear = new Date().getFullYear()
    for (let i = 2016; i <= nYear; i++) {
      this.years.push(i)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    year() {
      this.month = '1'
      this.init()
    },
    month() {
      this.getMonthDetail()
    }
  },
  components: {}
}
</script>
<style lang="scss">
.month-check {
  width: 100%;
  .el-radio-button {
    width: 100%;
    .el-radio-button__inner {
      width: 100%;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      border-radius: 0 !important;
      box-shadow: none;
    }
    &:last-child {
      .el-radio-button__inner {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.panel {
  .el-table {
    border: 1px solid #ebeef5;
    border-bottom: 0;
  }
}
.year-price {
  margin: 0 15px;
  font-size: 12px;
}
</style>

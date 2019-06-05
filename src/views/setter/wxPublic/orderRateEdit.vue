<template>
  <div class="content-view">
    <div class="p-20 input-w120 border-1px">
      <el-form :model="Attendance" ref="tableForm">
        <el-table :data="Attendance.tableData6" border :span-method="objectSpanMethod" style="width: 100%;">
          <el-table-column align="center" prop="id" label="设置序号" width="180"></el-table-column>
          <el-table-column align="center" prop="name" label="卡券类型"></el-table-column>
          <el-table-column align="center" prop="amount1" label="可购商品类别" :formatter="formatter"></el-table-column>
          <el-table-column align="center" prop="amount2" label="提点计算标准"></el-table-column>
          <el-table-column align="center" prop="remarks" width="251" label="备注"></el-table-column>
          <el-table-column align="center" prop="amount3" label="提点设置">
            <template slot-scope="scope">
              <el-form-item v-if="Attendance.tableData6[scope.$index].amount1 === 1" style="margin:0" :prop="'tableData6[' + scope.$index + '].amount3'">
                <el-input
                  :name="'amount3y' + scope.index"
                  :disabled="stationInput"
                  :ref="`${scope.column.property}-${scope.$index}`"
                  :class="{'input-border': isErr[scope.$index][scope.column.property]}"
                  @blur="resetValidate(scope, scope.$index, scope.row.amount3)"
                  v-model="scope.row.amount3"
                ></el-input>
                <span>元</span>
              </el-form-item>
              <el-form-item v-else style="margin:0" :prop="'tableData6[' + scope.$index + '].amount3'">
                <el-input
                  :name="'amount3p'"
                  :class="{'input-border': isErr[scope.$index][scope.column.property]}"
                  :disabled="stationInput"
                  @blur="resetValidate(scope, scope.$index, scope.row.amount3)"
                  v-model="scope.row.amount3"
                ></el-input>
                <span>%</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="amount4" label="单笔最高提点金额(元)">
            <template slot-scope="scope">
              <el-form-item style="margin:0" :prop="'tableData6[' + scope.$index + '].amount4'">
                <el-input
                  :name="'amount4y' + scope.index"
                  :class="{'input-border': isErr[scope.$index][scope.column.property]}"
                  :disabled="stationInput"
                  @blur="resetValidate(scope, scope.$index, scope.row.amount4)"
                  v-model="scope.row.amount4"
                ></el-input>
                <span>元</span>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-button name="edit" v-if="stationInput" @click="stationInput = false" class="m-t-20" type="primary">编辑</el-button>
        <el-button name="save" v-else @click="onSubmit()" class="m-t-20" type="primary">保存</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  MARKETING_API_SETTING_ORDER_RATE_GET, // 平台提点设置(前端对其提点进行*100操作) - 加载
  MARKETING_API_SETTING_ORDER_RATE_UPDATE //  平台提点设置 - 更新
} from '@/apis/marketing'
export default {
  data() {
    return {
      Attendance: {
        tableData6: [
          {
            id: '1',
            name: '现金支付',
            amount1: 1,
            amount2: '重量',
            remarks: '单位：元/克',
            amount3: '',
            amount4: ''
          },
          {
            id: '1',
            name: '现金支付',
            amount1: 2,
            amount2: '实付金额',
            remarks: '单位：%',
            amount3: '',
            amount4: ''
          },
          {
            id: '2',
            name: '置换购物金',
            amount1: 2,
            amount2: '差价金额',
            remarks:
              '1、素金类差价金额=新商品金额-旧商品金额(旧商品重量*今日金价+置换金金额);2、非素金类差价金额=新商品金额-旧商品金额(旧商品金额+置换金金额);',
            amount3: '',
            amount4: ''
          },
          {
            id: '3',
            name: '购物金支付',
            amount1: 1,
            amount2: '重量',
            remarks: '单位：元/克',
            amount3: '',
            amount4: ''
          },
          {
            id: '5',
            name: '购物金支付',
            amount1: 2,
            amount2: '差价金额',
            remarks: '差价金额=所购商品金额-购物金抵扣金额',
            amount3: '',
            amount4: ''
          },
          {
            id: '4',
            name: '抵用金支付',
            amount1: 2,
            amount2: '差价金额',
            remarks: '差价金额=所购商品金额-抵用金抵扣金额',
            amount3: '',
            amount4: ''
          },
          {
            id: '5',
            name: '旅游基金比例',
            amount1:
              '商户旅游基金，是指为鼓励商户员工在售出商品后积极推荐客户参与营销产品的相关活动而推出的激励政策，零成本会将客户参与营销活动获得收益的一定比例赠送给商户用于员工福利。',
            amount2: '4.1',
            remarks: '按平台所得提点的%',
            amount3: '',
            amount4: ''
          }
        ]
      },
      form: {
        CashPerg: '',
        CashPergMaxiPrice: '',
        CashRate: '',
        CashRateMaxiPrice: '',
        AgitateRate: '',
        AgitateRateMaxiPrice: '',
        GondPerg: '',
        GondPergMaxiPrice: '',
        GondRate: '',
        GondRateMaxiPrice: '',
        EquivRate: '',
        EquivRateMaxiPrice: '',
        TourRate: ''
      },
      value1: '',
      value2: '',
      amount1s: {
        '1': '素金',
        '2': '非素金'
      },
      stationInput: true,
      isErr: [
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        },
        {
          amount3: false,
          amount4: false
        }
      ],
      flag: true
    }
  },
  created() {
    MARKETING_API_SETTING_ORDER_RATE_GET().then(res => {
      this.Attendance.tableData6[0].amount3 = this.$root.toFloat(res.data.Data.CashPerg, 2)
      this.Attendance.tableData6[0].amount4 = this.$root.toFloat(res.data.Data.CashPergMaxiPrice)
      this.Attendance.tableData6[1].amount3 = this.$root.toFloat(res.data.Data.CashRate * 100, 1)
      this.Attendance.tableData6[1].amount4 = this.$root.toFloat(res.data.Data.CashRateMaxiPrice)

      this.Attendance.tableData6[2].amount3 = this.$root.toFloat(res.data.Data.AgitateRate * 100, 1)
      this.Attendance.tableData6[2].amount4 = this.$root.toFloat(res.data.Data.AgitateRateMaxiPrice)
      this.Attendance.tableData6[3].amount3 = this.$root.toFloat(res.data.Data.GondPerg)
      this.Attendance.tableData6[3].amount4 = this.$root.toFloat(res.data.Data.GondPergMaxiPrice)

      this.Attendance.tableData6[4].amount3 = this.$root.toFloat(res.data.Data.GondRate * 100, 1)
      this.Attendance.tableData6[4].amount4 = this.$root.toFloat(res.data.Data.GondRateMaxiPrice)

      this.Attendance.tableData6[5].amount3 = this.$root.toFloat(res.data.Data.EquivRate * 100, 1)
      this.Attendance.tableData6[5].amount4 = this.$root.toFloat(res.data.Data.EquivRateMaxiPrice)

      this.Attendance.tableData6[6].amount3 = this.$root.toFloat(res.data.Data.TourRate * 100, 1)
    })
  },
  methods: {
    objectSpanMethod(scope) {
      if (scope.columnIndex === 0 || scope.columnIndex === 1) {
        if (scope.rowIndex === 0 || scope.rowIndex === 3) {
          return [2, 1]
        } else if (scope.rowIndex === 1 || scope.rowIndex === 4) {
          return [0, 0]
        }
      }
      if (scope.rowIndex === 6) {
        if (scope.columnIndex === 2 || scope.columnIndex === 5) {
          return [1, 2]
        } else if (scope.columnIndex === 3 || scope.columnIndex === 6) {
          return [0, 0]
        }
      }
    },
    formatter(row, col) {
      if (row.amount1 === 1 || row.amount1 === 2) {
        return this.amount1s[row[col.property]]
      } else {
        return row.amount1
      }
    },
    resetValidate(item, row, value) {
      const reg1 = /^(?!(^0[0-9])$)[+]?(([1-9][\d]{0,8}\.{1}[\d]{1,2})|([1-9][0-9]{0,8}|0\.[0-9]{1,2})|0|0.0|0.00)$/g
      const reg2 = /^(?!(^0[0-9])$)[1-9][0-9]?(\.[0-9]{1})?$|^(100|100\.0{1}|0\.[0-9]{1}|0|0.0)$/g
      if (item.column.property === 'amount3') {
        if (item.$index !== 0 && item.$index !== 3) {

          if (!reg2.test(value)) {
            this.isErr[item.$index].amount3 = true
          } else {
            this.isErr[item.$index].amount3 = false
          }
        } else {
          if (!reg1.test(value)) {
            this.isErr[item.$index].amount3 = true
          } else {
            this.isErr[item.$index].amount3 = false
          }
        }
      } else {
        if (!reg1.test(value)) {
          this.isErr[item.$index].amount4 = true
        } else {
          this.isErr[item.$index].amount4 = false
        }
      }
      this.flag = true
      this.isErr.forEach(m => {
        if (m.amount3 || m.amount4) {
          this.flag = false
        }
      })
      // this.$refs[str]
    },
    onSubmit() {
      if (this.flag) {
        this.form.CashPerg = this.$root.toInt(this.Attendance.tableData6[0].amount3)
        this.form.CashPergMaxiPrice = this.$root.toInt(this.Attendance.tableData6[0].amount4)
        this.form.CashRate = this.$root.toInt(this.Attendance.tableData6[1].amount3) / 100
        this.form.CashRateMaxiPrice = this.$root.toInt(this.Attendance.tableData6[1].amount4)

        this.form.AgitateRate = this.$root.toInt(this.Attendance.tableData6[2].amount3) / 100
        this.form.AgitateRateMaxiPrice = this.$root.toInt(this.Attendance.tableData6[2].amount4)

        this.form.GondPerg = this.$root.toInt(this.Attendance.tableData6[3].amount3)
        this.form.GondPergMaxiPrice = this.$root.toInt(this.Attendance.tableData6[3].amount4)
        this.form.GondRate = this.$root.toInt(this.Attendance.tableData6[4].amount3) / 100
        this.form.GondRateMaxiPrice = this.$root.toInt(this.Attendance.tableData6[4].amount4)

        this.form.EquivRate = this.$root.toInt(this.Attendance.tableData6[5].amount3) / 100
        this.form.EquivRateMaxiPrice = this.$root.toInt(this.Attendance.tableData6[5].amount4)

        this.form.TourRate = this.$root.toInt(this.Attendance.tableData6[6].amount3) / 100
        MARKETING_API_SETTING_ORDER_RATE_UPDATE(this.form).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.stationInput = true
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '输入有误，请正确输入！'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.input-border .el-input__inner {
  border-color: red !important;
}
</style>
<style lang="scss" scoped>
.m-t-20 {
  display: block;
  margin: 20px auto 0;
  // margin: 20px auto 0;
  // margin-left: 200px;
}
.input-w120 .el-input {
  width: 120px;
}
</style>


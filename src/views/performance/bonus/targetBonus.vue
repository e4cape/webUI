<template>
  <div class="content-view p-20">
    <el-form :model="formInline" v-loading="loading" :disabled="isDisabled" ref="formInline" :show-message="false">
      <el-form-item label="目标与奖金" class="no-padding">
        <template>
          <el-table :data="formInline.Items" class="fix-error fix-item" tooltip-effect="dark" style="width:750px">
            <el-table-column label="员工姓名" width="150px">
              <template slot-scope="scope">
                <el-form-item>
                  <div class="nowrap" :title="scope.row.UserName">{{scope.row.UserName}}</div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="目标销售额(元)" width="200px">
              <template slot-scope="scope">
                <el-form-item :prop="'Items.'+scope.$index+'.TargetPrice'" :rules="{validator:selfValidateSale, trigger: 'blur'}">
                  <el-input name="TargetPrice" v-model="scope.row.TargetPrice"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="未完成处罚(元)" width="199px">
              <template slot-scope="scope">
                <el-form-item :prop="'Items.'+scope.$index+'.ForfeitPrice'" :rules="{validator:selfValidateSale, trigger: 'blur'}">
                  <el-input name="ForfeitPrice" v-model="scope.row.ForfeitPrice"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="完成奖励(元)">
              <template slot-scope="scope">
                <el-form-item :prop="'Items.'+scope.$index+'.RewardPrice'" :rules="{validator:selfValidateSale, trigger: 'blur'}">
                  <el-input name="RewardPrice" v-model="scope.row.RewardPrice"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item label="是否启用" prop="PatternType">
        <template>
          <el-radio-group name="radio" v-model="radio">
            <el-radio :label="EnableState.Enable">是</el-radio>
            <el-radio :label="EnableState.Disable">否</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button name="btnSave" type="primary" @click="saveSbumit('formInline')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { BonusType } from '@/enums/performance'
import { EnableState } from '@/enums/common'
import {
  KPIS_API_BONUS_BASIC_GET,
  KPIS_API_BONUS_BASIC_UPDATE
} from '@/apis/performance'
export default {
  data() {
    return {
      EnableState,
      BonusType,
      formInline: {
        BonusId: '',
        MinxPrice: '',
        LargarPrice: '',
        IsEnabled: '',
        Items: []
      },
      radio: '',
      loading: true,
      isDisabled: false
    }
  },
  mounted() {
    this.getTargetList()
  },
  methods: {
    getTargetList() {
      this.loading = true
      KPIS_API_BONUS_BASIC_GET({ BonusType: BonusType.Target }).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.formInline = res.data.Data
          this.radio = this.formInline.IsEnabled
          this.formInline.Items = res.data.Data.Items || []
          this.formInline.Items.forEach(item => {
            for (const key in item) {
              if (key.indexOf('Price') !== -1) {
                item[key] = this.$root.toFloat(item[key])
              }
            }
          })
        } else {
          this.isDisabled = true
        }
      })
    },
    saveSbumit(formName) {
      // 保存数据
      this.formInline.IsEnabled = this.radio
      this.$refs[formName].validate(valid => {
        if (valid) {
          var flag = this.formInline.Items.every(
            item =>
              (item.TargetPrice === '' &&
                item.RewardPrice === '' &&
                item.ForfeitPrice === '') ||
              (item.TargetPrice !== '' &&
                item.RewardPrice !== '' &&
                item.ForfeitPrice !== '')
          )
          if (!flag) {
            return
          }
          let itemArr = this.formInline.Items.map(v => Object.assign({}, v))
          itemArr.forEach(item => {
            for (const key in item) {
              if (key.indexOf('Price') !== -1) {
                item[key] = this.$root.toInt(item[key])
              }
            }
          })
          this.loading = true
          KPIS_API_BONUS_BASIC_UPDATE(Object.assign({},this.formInline,{Items:itemArr})).then(res => {
            this.loading = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.getTargetList()
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '单一行，若一项不为空，则其他两项必不为空！'
          })
        }
      })
    },
    selfValidateSale(rule, value, callback) {
      const data = this.formInline.Items[rule.field.split('.')[1]]
      if (
        data.ForfeitPrice !== '' ||
        data.RewardPrice !== '' ||
        data.TargetPrice !== ''
      ) {
        const reg = /^(?!(0[0-9])$)[+]?(([1-9][\d]{0,8}\.{1}[\d]{1,2})|([1-9][0-9]{0,8}|0\.[0-9]{1,2})|0)$/g
        const flag = reg.test(value)
        if (value === '') {
          callback(new Error('不能为空！'))
        } else if (!flag) {
          callback(new Error('请正确输入'))
        } else {
          callback()
        }
      }
      callback()
    }
  }
}
</script>
<style scoped>
.page {
  float: right;
  margin-top: 10px;
}
.el-table__row {
  text-align: center;
}
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.el-table .cell,
.el-table th div {
  overflow: visible;
}
.el-table td,
.el-table th {
  padding: 2px 0;
}
.el-table__row td {
  padding: 0 !important;
}
.el-form-item__error {
  position: static;
}
</style>

<style lang="scss">
.no-padding .el-table__row td,
.no-padding .el-table th {
  padding: 0;
}
.fix-item {
  .el-form-item--mini {
    margin: 5px 0;
  }
}
</style>

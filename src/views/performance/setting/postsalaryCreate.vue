<template>
  <div class="content">
    <div class="el-row">
      <el-col>
        <el-form :model="formInline" :rules="rules" ref="formInline" label-width="60px" class="demo-ruleForm">
          <el-form-item label="职位" prop="PositionId">
            <el-select name="PositionId" v-model="formInline.PositionId" placeholder="请选择">
              <el-option v-for="item in PositionOpt" :key="item.Id" :value="item.Id" :label="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位工资">
            <el-table :data="formInline.Items" header-align="center" align="center" class="fix-error" style="width:100%" tooltip-effect="dark">
              <!--  <el-table-column prop="column" type="selection">
              </el-table-column> -->
              <el-table-column label="职级" header-align="center" align="center" prop="LevelTitle">
              </el-table-column>
              <el-table-column label="基本工资" header-align="center" align="center" prop="BasicPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.BasicPrice'" :rules="{validator:validator}">
                    <el-input name="BasicPrice" v-model="scope.row.BasicPrice" @blur="ChangePrice(scope.$index,'BasicPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="职位津贴" header-align="center" align="center" prop="SubsPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.SubsPrice'" :rules="{validator:validator2}">
                    <el-input name="SubsPrice" v-model="scope.row.SubsPrice" @blur="ChangePrice(scope.$index,'SubsPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="出勤补贴" header-align="center" align="center" prop="AttendPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.AttendPrice'" :rules="{validator:validator2}">
                    <el-input name="AttendPrice" v-model="scope.row.AttendPrice" @blur="ChangePrice(scope.$index,'AttendPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="餐补(月)" header-align="center" align="center" prop="MealPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.MealPrice'" :rules="{validator:validator2}">
                    <el-input name="MealPrice" v-model="scope.row.MealPrice" @blur="ChangePrice(scope.$index,'MealPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="交通补贴" header-align="center" align="center" prop="TrafficPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.TrafficPrice'" :rules="{validator:validator2}">
                    <el-input name="TrafficPrice" v-model="scope.row.TrafficPrice" @blur="ChangePrice(scope.$index,'TrafficPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="住宿补贴" header-align="center" align="center" prop="HotelPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.HotelPrice'" :rules="{validator:validator2}">
                    <el-input name="HotelPrice" v-model="scope.row.HotelPrice" @blur="ChangePrice(scope.$index,'HotelPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="其它" header-align="center" align="center" prop="OtherPrice">
                <template slot-scope="scope">
                  <el-form-item :prop="'Items.'+scope.$index+'.OtherPrice'" :rules="{validator:validator2}">
                    <el-input name="OtherPrice" v-model="scope.row.OtherPrice" @blur="ChangePrice(scope.$index,'OtherPrice')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="合计" header-align="center" align="center" prop="PositionPrice">
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center">
                <template slot-scope="scope" v-if="scope.$index === len-1">
                  <img name="AddSalary" src="/static/images/icon-5.png" @click="AddSalary" alt="添加" style="vertical-align: middle;cursor:pointer" />
                  <img name="DelSalary" src="/static/images/icon-4.png" @click="DelSalary(scope.$index)" alt="删除" style="vertical-align: middle;cursor:pointer" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button name="btnSaveSubmit" type="primary" @click="submit(state.Wait)">保存并提交</el-button>
            <el-button name="btnSaveDraft" type="default" @click="submit(state.Draft)">保存草稿</el-button>
            <el-button name="btnCancel" type="info" plain @click="Cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </div>
</template>
<script>
// import { tirms } from '@/utilities/tool'
import {
  JunkInnOrderBasicState
} from '@/enums/marketing'
import {
  MERCHANT_API_DROPDOWN_POSITIONLIST,
} from '@/apis/merchant'
import {
  KPIS_API_SETTING_POSITION_SALARY_BASIC_CREATE
} from '@/apis/performance'
export default {
  data() {
    return {
      formInline: {
        PositionId: '',
        Position: '',
        Items: []
      },
      ClassList: [
        {
          LevelTitle: '',
          LevelIndex: '',
          BasicPrice: '',
          SubsPrice: '',
          AttendPrice: '',
          MealPrice: '',
          TrafficPrice: '',
          HotelPrice: '',
          AllworkPrice: '',
          OtherPrice: '',
          PositionPrice: ''
        }
      ],
      len: 1,
      PositionOpt: [],
      IsShowVaild: false,
      multipleSelection: {
      },
      state: JunkInnOrderBasicState,
      rules: {
        PositionId: [
          {
            required: true, message: '请选择职位', trigger: 'change' 
          }
        ]
      },
      reg: /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
    }
  },
  methods: {
    SelfValidateSale(rule, value, callback) {
      if (value === '') {
        callback(new Error('不能为空！'))
      }
    },
    validator(rule, value, callback) {
      const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const val = value.toString().trim()
      const flag = reg.test(val)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    validator2(rule, value, callback) {
      const reg = /^(?!(0[0-9]$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const val = value.toString().trim()
      const flag = reg.test(val)
      if (value === '' || value === '0') {
        callback()
      } else if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    ChangePrice(index, name) {

      let reg = /^((?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8})))?$/g
      if (name === 'BasicPrice') {
        reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      }
      this.formInline.Items[index].TotalSalary = 0
      var row = this.formInline.Items[index]

      const val = row[name].toString().trim()
      this.formInline.Items[index][name] = val
      if (!reg.test(val)) {
        this.$data.ClassList[index][name] = 'showVaild'
        return
      } else {
        this.ClassList[index][name] = ''
      }
      let price = 0
      for (let item in row) {
        if (row[item] !== undefined && row[item] !== '' && (item !== 'LevelTitle' && item !== 'LevelIndex' && item !== 'PositionPrice')) {
          if (!isNaN(parseFloat(row[item]))) {
            price += parseFloat(row[item]) * 100
          }
        }
      }
      this.formInline.Items[index].PositionPrice = (price / 100).toFixed(2)
    },
    AddSalary() {
      const index = (this.formInline.Items.length + 1)
      if (index > 5) {
        this.$message({
          message: '最多可以创建5级', type: 'warning' 
        })
        return
      }

      this.formInline.Items.push({
        LevelIndex: index,
        LevelTitle: (index + '级'),
        BasicPrice: '',
        SubsPrice: '',
        AttendPrice: '',
        MealPrice: '',
        TrafficPrice: '',
        HotelPrice: '',
        AllworkPrice: '',
        OtherPrice: '',
        PositionPrice: ''
      })

      this.$data.ClassList.push({
        LevelTitle: '',
        LevelIndex: '',
        BasicPrice: '',
        SubsPrice: '',
        AttendPrice: '',
        MealPrice: '',
        TrafficPrice: '',
        HotelPrice: '',
        AllworkPrice: '',
        OtherPrice: '',
        PositionPrice: ''
      })
    },
    DelSalary(index) {
      if (index === 0) {
        this.$message({
          message: '必须保留一行', type: 'warning' 
        })
        return false
      }
      this.formInline.Items.splice(index, 1)
      this.$data.ClassList.splice(index, 1)
    },
    Cancel() {
      this.$router.push('/performance/setting/postsalarylist')
    },
    submit(status) {
      // this.$data.IsShowVaild = true
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          let params = Object.assign({},this.formInline, {
            Status: status,
            Position: this.PositionOpt.find(m => m.Id === this.formInline.PositionId).Value 
          })
          let tmpItems = []
          for(let key in this.formInline.Items) {
            tmpItems[key] = Object.assign({},this.formInline.Items[key])
          }
          params.Items = tmpItems
          params.Items.forEach(row => {
            row.PositionId = this.formInline.PositionId
            for(let key in row){
              if(key.indexOf('Price') !== -1){
                row[key] = this.$root.toInt(row[key].toFixed(2)) || 0
              }
            }
          })
          KPIS_API_SETTING_POSITION_SALARY_BASIC_CREATE(params).then(data => {
            if (data.data.Code === 'CORRECT') {
              this.$router.push('/performance/setting/postsalarylist')
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.$message.warning(data.data.Message)
            }
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
  },
  beforeCreate () {
    MERCHANT_API_DROPDOWN_POSITIONLIST().then(res => {
      if (res.data.Code === 'CORRECT' && res.data.Data.Count > 0) {
        this.PositionOpt = res.data.Data.Rows
      }
    })
  },
  mounted() {
    this.formInline.Items = [
      {
        LevelTitle: '1级',
        LevelIndex: 1,
        BasicPrice: '',
        SubsPrice: '',
        AttendPrice: '',
        MealPrice: '',
        TrafficPrice: '',
        HotelPrice: '',
        AllworkPrice: '',
        OtherPrice: '',
        PositionPrice: 0
      }
    ]
  },
  watch: {
    'formInline.Items' () {
      this.len = this.formInline.Items.length
    }
  }
}

</script>
<style lang="scss" scoped>
.showVaild {
  //margin: 20px
  input {
    border: 1px #ff2200 solid!important;
  }
}

</style>
<style lang="scss">
.fix-error {
  .el-form-item__error {
    position: inherit!important;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}

</style>

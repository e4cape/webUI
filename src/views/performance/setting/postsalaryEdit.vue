<template>
  <div class="content">
    <div class="el-row">
      <el-col>
        <el-form :model="formInline" :rules="rules" ref="formInline" label-width="60px" class="demo-ruleForm">
          <el-form-item label="职位" prop="PositionId">
             <el-input name="Position" v-model="formInline.Position" disabled style="width:240px"></el-input>
          </el-form-item>
          <el-form-item label="职位工资">
            <el-table :data="formInline.Items" header-align="center" align="center" class="fix-error" style="width:100%" tooltip-effect="dark">
              <!--  <el-table-column prop="column" type="selection">
              </el-table-column> -->
              <el-table-column label="职级" header-align="center" align="center" prop="LevelTitle" width="70px">
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
                <template slot-scope="scope">
                  {{'￥' + scope.row.PositionPrice}}
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" width="70px">
                <template slot-scope="scope" v-if="scope.$index === len-1">
                  <img src="/static/images/icon-5.png" name="AddSalary" @click="AddSalary" alt="添加" style="vertical-align: middle;cursor:pointer" />
                  <img src="/static/images/icon-4.png" name="DelSalary" @click="DelSalary(scope.$index)" alt="删除" style="vertical-align: middle;cursor:pointer" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button name="btnSaveSubmit" type="primary" @click="SaveSubmit('formInline',3)">保存并提交</el-button>
            <el-button name="btnSaveDraft" type="default" @click="SaveDraft('formInline',1)">保存草稿</el-button>
            <el-button name="btnCancel" type="info" plain @click="Cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </div>
</template>
<script>
import {
  JunkInnOrderBasicState 
} from '@/enums/marketing'
import { MERCHANT_API_DROPDOWN_POSITIONLIST } from '@/apis/merchant'
import {
  KPIS_API_SETTING_POSITION_SALARY_BASIC_GET,
  KPIS_API_SETTING_POSITION_SALARY_ITEM_GETS,
  KPIS_API_SETTING_POSITION_SALARY_BASIC_UPDATE
} from '@/apis/performance'
export default {
  data() {
    return {
      formInline: {
        PositionId: '',
        Position: '',
        Items: [],
        DeleteItems: []
      },
      auditStatus: JunkInnOrderBasicState,
      len: 1,
      defaultItem: [],
      ClassList: [],
      PositionOpt: [
        {
          Value: 1, Name: '店长' 
        }
      ],
      multipleSelection: {
      },
      rules: {
      },
      Status: false,
      loading:true
    }
  },
  mounted() {
    this.GetPostSalaryInfo()
    this.getPosition()
  },
  methods: {
    ChangePrice(index, name) {
      const PositionPrice = this.formInline.Items[index].PositionPrice
      let reg
      if (name === 'BasicPrice') {
        reg = /^(?!(0[0-9]))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([0-9][0-9]{0,8}))$/g
      } else {
        reg = /^((?!(0[0-9]))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([0-9][0-9]{0,8})))?$/g
      }
      var row = this.formInline.Items[index]
      const val = row[name].toString().trim()
      this.formInline.Items[index][name] = parseFloat(val.toFixed(2))
      if (!reg.test(row[name])) {
        this.ClassList[index][name] = 'showVaild'
      } else {
        this.ClassList[index][name] = ''
      }
      let price = 0
      for (let item in row) {
        if (row[item] !== '' && item.indexOf('Price') != -1 && item != 'PositionPrice') {
          if (!isNaN(parseFloat(row[item]))) {
            price += parseFloat(row[item]) * 100
          }
        }
      }
      this.formInline.Items[index].PositionPrice = (price / 100).toFixed(2)
      if (PositionPrice !== price && this.formInline.Items[index].ItemId !== undefined) {
        this.formInline.Items[index].isUpdate = true
      }
    },
    CalculationTotal(row) {
      let count = 0
      for (var item in row) {
        if (row[item] !== undefined && row[item] !== '' && (item !== 'PositionLevel' && item !== 'PositionLevelName' && item !== 'TotalSalary' && item !== 'PositionId' && item !== 'Status' && item !== 'Id' && item !== 'Version')) {
          count += parseFloat(row[item])
        }
      }
      return count + ''
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
      const reg = /^(?!(0[0-9]$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8})|0|0\.0|0\.00)$/g
      const val = value.toString().trim()
      const flag = reg.test(val)
      if (value == '' || value == '0') {
        callback()
      } else if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
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
        OtherPrice: '',
        PositionPrice: '',
        isCreate: true
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
        OtherPrice: '',
        PositionPrice: ''
      })
      this.len = this.formInline.Items.length
    },
    DelSalary(index) {
      let i = 0
      let msg = '必须保留一行'
      if (this.Status == this.auditStatus.Audit) {
        i = this.DefaultLen - 1
        msg = '审核通过的职级不可以删除！'
      }

      if (index === i) {
        this.$message({
          message: msg, type: 'warning' 
        })
        return false
      }
      const toDefaultIndex = this.defaultItem.findIndex(m => m.LevelIndex === this.formInline.Items[index].LevelIndex)
      if(toDefaultIndex !== -1){
        this.formInline.DeleteItems.push(this.defaultItem[toDefaultIndex])
      }
      this.formInline.Items.splice(index, 1)
      this.$data.ClassList.splice(index, 1)
      this.len = this.formInline.Items.length
    },
    async GetPostSalaryInfo() {
      this.loading = true
      const params = { PositionSalaryId: this.$route.params.id }
      const resAll = await Promise.all([KPIS_API_SETTING_POSITION_SALARY_BASIC_GET(params),KPIS_API_SETTING_POSITION_SALARY_ITEM_GETS(params)])
      this.loading = false    
      if(resAll[0].data.Code === 'CORRECT'){
        const detail = resAll[0].data.Data
        if (detail) {
          this.Status = detail.Status
          this.$data.formInline = detail
        }else{
          this.$message.error('获取职位工资详情失败！')
          this.$router.back()
        }
      }
      if(resAll[1].data.Code === 'CORRECT'){
        this.DefaultLen = resAll[1].data.Data.Count
        for (let i = 0; i < this.DefaultLen; i++) {
          this.ClassList[i] = {
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
        }
        this.formInline.DeleteItems = []
        let tmpArr = resAll[1].data.Data.Rows
        tmpArr.forEach(item => {
          for(let key in item){
            if(key.indexOf('Price') !== -1){
              item[key] = this.$root.toFloat(item[key])
            }
          }
        })
        this.defaultItem = [...tmpArr]
        this.formInline.Items = [...tmpArr]
      }
    },
    SaveSubmit(formName) {
      this.Submit(this.auditStatus.Wait, formName)
    },
    SaveDraft(formName) {
      this.Submit(this.auditStatus.Draft, formName)
    },
    SaveAudit(formName) {
      this.Submit(this.auditStatus.Audit, formName)
    },
    Cancel() {
      this.$router.go(-1)
    },
    Submit(status, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            PositionSalaryId: parseInt(this.$route.params.id),
            Status: status,
            UpdateItems: [],
            CreateItems: [],
            DeleteItems: [],
          }
          this.formInline.Items.forEach(row => {
            let currentRow = Object.assign({},row)
            for(let key in currentRow){
              if(key.indexOf('Price') !== -1){
                currentRow[key] = this.$root.toInt(currentRow[key])
              }
            }
            if (row.isUpdate === true) {
              params.UpdateItems.push(currentRow)
            }
            if (row.isCreate === true) {
              params.CreateItems.push(currentRow)
            }
          })
          if (this.formInline.DeleteItems.length > 0) {
            this.formInline.DeleteItems.forEach(item => {
              if(item.ItemId){
                params.DeleteItems.push(item.ItemId)
              }
            })
          }
          KPIS_API_SETTING_POSITION_SALARY_BASIC_UPDATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$router.push('/performance/setting/postsalarylist')
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.$message.warning(res.data.Message)
            }
          })
        }
      })
    },
    getPosition() {
      MERCHANT_API_DROPDOWN_POSITIONLIST().then(res => {
        if (res.data.Code === 'CORRECT' && res.data.Data.Count > 0) {
          this.positionOpt = res.data.Data.Rows
        }
      })
    }
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
  input {
    border: 1px #ff2200 solid!important;
  }
}
.cell .el-form-item--mini.el-form-item{
  margin-bottom: 12px;
  margin-top:12px;
}
</style>

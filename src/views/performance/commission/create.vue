<template>
  <div class="noPadding">
    <a href="javascript:;"  @click="aboutDetail" class="toRight">职位提点测算表</a>
    <el-form :model="ChildForm" class="fix-w" v-loading="loading" ref="ChildForm" label-width="70px">
      <el-form-item v-if="positionName != 'guide'" label="提成方式" prop="PatternType">
        <el-radio-group name="PatternType" v-model="ChildForm.PatternType">
          <el-radio v-for="item in RatioPatternType.TypeArray" :key="item.KeyId" :label="item.KeyId">{{item.Value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="ChildForm.PatternType == patternAvg" label="提成倍率" prop="Rate" :rules="{validator:rateValidate}" class="person-rate">
        <el-input name="Rate" v-model="ChildForm.Rate" style="width:200px" @keyup.native="ChildForm.Rate=$root.toFixed(ChildForm.Rate, 2)"><template slot="append">倍</template></el-input>
      </el-form-item>
      <el-form-item class="extract-rate" v-if="ChildForm.PatternType == patternCat || positionName == 'guide'" label="提成比率">
        <div class="table" :data="ChildForm.MaterialList">
          <ul>
            <li>
              <el-row style="background:#f5f5f5; font-size: 14px">
                <el-col align="center" :span="4">商品分类</el-col>
                <el-col align="center" :span="6">销售金额(包含上限值)</el-col>
                <el-col align="center" :span="5">提成比率(%)</el-col>
                <el-col align="center" :span="5">操作</el-col>
                <el-col align="center" :span="4"><a href="javascript:;" name="btnShowAll" class="changeS" @click="showAll">{{show?'收起全部':'展开全部'}}</a></el-col>
              </el-row>
            </li>
          </ul>
          <ul v-for="(item, row) in ChildForm.MaterialList" :data="ChildForm.MaterialList" :key="row" style="font-size: 12px">
            <li>
              <el-row v-if="item.data.length <= 0">
                <el-col align="center" :span="4">{{item.label}}</el-col>
                <el-col align="center" :span="11" style="color: #ddd">暂无数据</el-col>
                <el-col align="center" :span="5">
                  <a href="javascript:;" name="btnAdd" class="icon-btn" @click="addDomain(row)"><img src="/static/images/icon-5.png" alt="增加"></a>
                  <a href="javascript:;" class="icon-btn"></a>
                </el-col>
                <el-col align="center" :span="4">
                </el-col>
              </el-row>
              <el-row v-else-if="item.data.length > 0 && !item.isClose" v-for="(list, index) in item.data" style="margin-top: 3px" :key="index">
                <el-col align="center" :span="4">
                  <div class="typeName">
                    <span v-if="index <= 0">{{item.label}}</span>
                  </div>
                </el-col>
                <el-col align="center" :span="6">
                  <el-form-item :prop="'MaterialList.'+row+'.data.' + index + '.Price'" :key="list.key" :rules="[{validator:selfValidateSale}]">
                    满&nbsp;&nbsp;&nbsp;&nbsp;<el-input name="Price" @focus="resteS" v-model="list.Price" style="width: 120px; text-align: center" type="text"></el-input>
                    <!--<span v-if="item.label === 1">&nbsp;&nbsp;/克</span>-->
                  </el-form-item>
                </el-col>
                <el-col align="center" :span="5">
                  <el-form-item :prop="'MaterialList.'+row+'.data.' + index + '.Rate'" :key="list.key" :rules="[{validator:selfValidateRage}]">
                    <el-input name="Rate" @focus="resteS" v-model="list.Rate" style="width: 120px; text-align: center" type="text"></el-input>
                  </el-form-item>
                </el-col>
                <el-col align="center" :span="5">
                  <!--<a href="javascript:;" class="icon-btn"><img v-show="index === item.data.length-1 && item.data.length < 9" @click="addDomain(row)" src="/static/images/icon-5.png" alt="增加"></a>-->
                  <a href="javascript:;" class="icon-btn"><img name="btnAddDomain" v-show="index === item.data.length-1" @click="addDomain(row)" src="/static/images/icon-5.png" alt="增加"></a>
                  <a href="javascript:;" name="btnRemove" class="icon-btn" @click="removeDomain(row, list)"><img src="/static/images/icon-4.png" alt="删除"></a>
                </el-col>
                <el-col align="center" :span="4">
                  <div v-if="index < 1 && item.data.length>1" class="stateOC">
                    <span name="isClose" class="wrap-icon" @click="changeState(item, row)">{{item.isClose?'展开':'收起'}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row v-else style="margin-top: 3px">
                <el-col align="center" :span="4">
                  <div class="typeName">
                    <span>{{item.label}}</span>
                  </div>
                </el-col>
                <el-col align="center" :span="6">
                  <el-form-item :prop="'MaterialList.'+row+'.data.' + 0 + '.Price'" :key="item.data[0].key" :rules="[{validator:selfValidateSale}]">
                    满&nbsp;&nbsp;&nbsp;&nbsp;<el-input name="Price" @focus="resteS" v-model="item.data[0].Price" style="width: 120px; text-align: center" type="text"></el-input>
                    <!--<span v-if="item.label === 1">&nbsp;&nbsp;/克</span>-->
                  </el-form-item>
                </el-col>
                <el-col align="center" :span="5">
                  <el-form-item :prop="'MaterialList.'+row+'.data.' + 0 + '.Rate'" :key="item.data[0].key" :rules="[{validator:selfValidateRage}]">
                    <el-input name="Rate" @focus="resteS" v-model="item.data[0].Rate" style="width: 120px; text-align: center" type="text"></el-input>
                  </el-form-item>
                </el-col>
                <el-col align="center" :span="5">
                  <!--<a href="javascript:;" class="icon-btn"><img v-show="0 === item.data.length-1 && item.data.length < 9" @click="addDomain(row)" src="/static/images/icon-5.png" alt="增加"></a>-->
                  <a href="javascript:;" class="icon-btn"><img name="btnAddDomain" v-show="0 === item.data.length-1" @click="addDomain(row)" src="/static/images/icon-5.png" alt="增加"></a>
                  <a href="javascript:;" name="btnRemove" class="icon-btn" @click="removeDomain(row, item.data[0])"><img src="/static/images/icon-4.png" alt="删除"></a>
                </el-col>
                <el-col align="center" :span="4">
                  <div v-if="0 < 1 && item.data.length>1" class="stateOC">
                    <span name="isClose" class="wrap-icon" @click="changeState(item, row)">{{item.isClose?'展开':'收起'}}</span>
                  </div>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button name="btnSave" type="primary" @click="onSaveSubmit('ChildForm')" :loading="saveLoad">保存并提交</el-button>
        <!--<el-button type="primary" v-show="saveLoad" :loading="saveLoad">保存并提交</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { SettingEnumeratorEnumeratorType } from '@/enums/stocking'
import { YNStatus,EnableState,ItemState} from '@/enums/common'
import {
  RatioPatternType,
} from '@/enums/performance'
import { MERCHANT_API_DROPDOWN_POSITIONLIST } from '@/apis/merchant'
import {
  KPIS_API_RATIO_BASIC_GET,
  KPIS_API_RATIO_ITEM_GETS,
  KPIS_API_RATIO_BASIC_UPDATE
} from '@/apis/performance'
import { STOCKING_API_SETTING_ENUMERATOR_GETS } from '@/apis/stocking'
export default {
  data() {
    return {
      materialTypeList: [],
      RatioPatternType,
      ChildForm: {
        PositionId: '',
        PatternType: '',
        Rate: '',
        RatioId: '',
        MaterialList: []
      },
      PositionList: [],
      DefaulResult: {
        DeleteItems: [],
        CreateItems: [],
        UpdateItems: [],
        PatternType: '',
        Rate: '',
        RatioId: ''
      },
      patternCat: '',
      patternAvg: '',
      isShow: false,
      show: false,
      saveLoad: false,
      loading: true,
      oldRate: 0,
      currentPositionId: '',
      showAllflag: false
    }
  },
  props: {'positionName': String},
  mounted() {
    this.loadAllEnums()
  },
  methods: {
    loadAllEnums() {
      this.loading = true
      STOCKING_API_SETTING_ENUMERATOR_GETS({
        EnumeratorType: SettingEnumeratorEnumeratorType.MaterialType,
        EnumeratorKey: 0,
        EnumeratorVal: '', 
        IsDefault: 0,
        IsEnable: 0,
        IsAppend: 0,
        SortId: 0, 
        OrderBy: 0, 
        IsAsced: YNStatus.Yes,
        PageIndex: 1,
        PageSize: 9999
      }).then(res =>{
        if(res.data.Code === 'CORRECT'){
          this.materialTypeList = res.data.Data.Rows.filter(v => v.IsEnable === EnableState.Enable)
        }
      }).then(() => {
        MERCHANT_API_DROPDOWN_POSITIONLIST().then(res => {
          this.loading = false
          if(res.data.Code === 'CORRECT'){
            this.PositionList = res.data.Data.Rows
            if( res.data.Data.Count < 1){
              this.$message.error('空职位')
              this.$router.go(-1)
              return
            }
            let currentItem = {}
            switch (this.positionName) {
              case 'shopowner':
                currentItem = this.PositionList.find(m => m.Value === '店长')
                break
              case 'steering':
                currentItem = this.PositionList.find(m => m.Value === '督导')
                break
              case 'cashier':
                currentItem = this.PositionList.find(m => m.Value === '收银员')
                break
              case 'guide':
                currentItem = this.PositionList.find(m => m.Value === '导购')
                break
              case 'manager':
                currentItem = this.PositionList.find(m => m.Value === '经理')
                break
              default:
                currentItem = {}
            }
            if(!currentItem || !currentItem.Id){
              this.loading = false
              this.$message.error('无该职位')
              return
            }
            this.currentPositionId = currentItem.Id
            this.getList(currentItem.Id)
          }
        })
        this.patternCat = JSON.stringify(this.RatioPatternType.Category)
        this.patternAvg = JSON.stringify(this.RatioPatternType.Avg)
        this.materialTypeList.forEach(item => {
          this.ChildForm.MaterialList.push({
            label: item.EnumeratorVal,
            value: item.EnumeratorKey,
            data: []
          })
        })
      })
    },
    async getList(PositionId) {
      this.loading = true
      const res1 = await KPIS_API_RATIO_BASIC_GET({
        PositionId,
        CharacterId: this.$store.getters.user_session.CharacterId
      })
      if (res1.data.Code === 'CORRECT') {
        this.ChildForm.PatternType = JSON.stringify(this.ChildForm.PatternType)
        this.oldRate = this.$root.toFloat(res1.data.Data.Rate)
        this.ChildForm.Rate = this.$root.toFloat(res1.data.Data.Rate)
        this.ChildForm.RatioId = res1.data.Data.RatioId
        this.ChildForm.PatternType = JSON.stringify(res1.data.Data.PatternType)
        for (let i = 0; i < this.ChildForm.MaterialList.length; i++) {
          this.$set(this.ChildForm.MaterialList[i], 'isClose', true)
        }
        this.show = false
      }
      const res2 = await KPIS_API_RATIO_ITEM_GETS({
        RatioId: this.ChildForm.RatioId,
        Status: ItemState.Valid
      })
      if(res2.data.Code === 'CORRECT'){
        for (let i = 0; i < res2.data.Data.Rows.length; i++) {
          const item = res2.data.Data.Rows[i]
          let item2 = this.ChildForm.MaterialList.find(m => m.value == item.MaterialType) ? this.ChildForm.MaterialList.find(m => m.value == item.MaterialType).data : []
          item2.push({
            Price: this.$root.toFloat(item.Price),
            Rate: this.$root.toFixed(item.Rate/100,1),
            ItemId: item.ItemId
          })
        }
      }
      this.loading = false
    },
    getNewData(){
      this.ChildForm.MaterialList = []
      this.loadAllEnums()
    },
    aboutDetail() {
      this.$router.push('/performance/commission/about/' + this.positionName)
    },
    onSaveSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.assemblyData(formName)
        } else {
          return false
        }
      })
    },
    assemblyData(ChildForm) { // 保存状态
      this.saveLoad = true
      this.DefaulResult.PatternType = parseInt(this.ChildForm.PatternType)
      this.DefaulResult.CreateItems = []
      this.DefaulResult.UpdateItems = []
      this.DefaulResult.Rate = this.$root.toInt(this.ChildForm.Rate)
      this.DefaulResult.RatioId = this.ChildForm.RatioId
      if (this.DefaulResult.PatternType == this.RatioPatternType.Avg) {
        KPIS_API_RATIO_BASIC_UPDATE(Object.assign({
          CharacterId: this.$store.getters.user_session.CharacterId
        },this.DefaulResult)).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('设置成功!')
            this.saveLoad = false
          }
        })
      } else {
        this.ChildForm.MaterialList.forEach(($row) => {
          if ($row.data.length > 0) {
            $row.data.forEach(m => {
              if (m.ItemId == undefined) {
                this.DefaulResult.CreateItems.push({
                  Price: this.$root.toInt(m.Price),
                  Rate: m.Rate * 100,
                  MaterialType: $row.value
                })
              } else {
                this.DefaulResult.UpdateItems.push({
                  Price: this.$root.toInt(m.Price),
                  Rate: m.Rate * 100,
                  MaterialType: $row.value,
                  ItemId: m.ItemId
                })
              }
            })
          }
        })
        if (this.DefaulResult.CreateItems.length === 0 && this.DefaulResult.DeleteItems.length === 0 && this.DefaulResult.UpdateItems.length === 0 && this.DefaulResult.PatternType === '3') {
          this.$message.warning('请最少设置一样材质!')
          this.saveLoad = false
          return
        }
        this.$refs[ChildForm].validate((valid) => {
          if (valid) {
            let params = Object.assign({CharacterId: this.$store.getters.user_session.CharacterId},this.DefaulResult)
            params.Rate = this.$root.toInt(this.oldRate)
            for(const key in params){
              if(key === 'CreateItems' || key === 'UpdateItems'){
                params[key].forEach(item =>{
                  item.ItemId = item.ItemId + ''
                })
              }
            }
            KPIS_API_RATIO_BASIC_UPDATE(params).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('设置成功!')
                this.saveLoad = false
                this.getNewData()
              }
            })
          }
        })
      }
    },
    removeDomain(i, item) { // 删除行
      this.DefaulResult.DeleteItems.push(item.ItemId)
      var index = this.ChildForm.MaterialList[i].data.indexOf(item)
      if (index !== -1) {
        this.ChildForm.MaterialList[i].data.splice(index, 1)
      }
      if (this.ChildForm.MaterialList[i].data.length < 2) {
        this.$delete(this.ChildForm.MaterialList[i], 'isClose')
      }
    },
    resteS() {
      this.$refs['ChildForm'].clearValidate()
    },
    addDomain(index) {
      this.ChildForm.MaterialList[index]['data'].push({
        Price: '',
        Rate: ''
      })
      if (this.ChildForm.MaterialList[index].data.length > 1) {
        this.$set(this.ChildForm.MaterialList[index], 'isClose', false)
      }
    },
    showAll() {
      if(this.showAllflag){
        this.$message.warning('您的操作太快了，请稍后再试！')
        return
      }
      this.showAllflag = true
      this.show = !this.show
      for (let i = 0; i < this.ChildForm.MaterialList.length; i++) {
        if (this.ChildForm.MaterialList[i].data.length > 1) {
          this.ChildForm.MaterialList[i].isClose = !this.show
        }
      }
      setTimeout(() => {
        this.showAllflag = false
      }, 1000)
    },
    changeState(item, i) {
      this.ChildForm.MaterialList[i].isClose = !this.ChildForm.MaterialList[i].isClose
      let count1 = 0,
        count2 = 0,
        count3 = 0
      for (let i = 0; i < this.ChildForm.MaterialList.length; i++) {
        if (this.ChildForm.MaterialList[i].data.length > 1) {
          count1 = count1 + 1
        }
        if (this.ChildForm.MaterialList[i].isClose === true) {
          count2 = count2 + 2
        }
        if (this.ChildForm.MaterialList[i].isClose === false) {
          count3 = count3 + 2
        }
      }
      if (count1 === count2 && count3 === 0) {
        this.show = true
      } else if (count1 === count3 && count2 === 0) {
        this.show = false
      }
    },
    rateValidate(rule, value, callback) {
      if (this.ChildForm.PatternType == this.patternAvg) {
        const reg = /^(?!(0[0-9])$)[1-9][0-9]?(\.[0-9]{1,2})?$|^(100|100\.0{1,2}|0\.[0-9]{1,2}|0)$/g
        const flag = reg.test(value)
        if (value === '') {
          callback(new Error('不能为空'))
        } else if (!flag) {
          callback('请正确输入！')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    selfValidateSale(rule, value, callback) { // 自定义阶梯验证
      const reg = /^(?!(^0[0-9])$)[+]?(([1-9][\d]{0,8}\.{1}[\d]{1,2})|([1-9][0-9]{0,8}|0\.[0-9]{1,2}))$/g
      const len = this.ChildForm.MaterialList[rule.field.split('.')[1]][rule.field.split('.')[2]].length
      const data = this.ChildForm.MaterialList[rule.field.split('.')[1]][rule.field.split('.')[2]]
      const i = parseInt(rule.field.split('.')[3])
      const _name = rule.field.split('.')[4]
      const flag = rule.field.split('.')[3] - 1 > -1 && Number(value) > Number(data[i - 1][_name])
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!reg.test(value)) {
        callback(new Error('请正确输入！'))
      } else {
        if (len > 1) {
          if (flag) {
            if (data[i + 1] && Number(value) >= Number(data[i + 1][_name])) {
              callback(new Error('输入的金额必须小于下一个金额！'))
            } else {
              callback()
            }
          } else if (rule.field.split('.')[3] - 1 <= -1 && Number(value) < Number(data[i + 1][_name])) {
            callback()
          } else if (rule.field.split('.')[3] - 1 <= -1) {
            callback(new Error('输入的金额必须小于下一个金额！'))
          } else {
            callback(new Error('输入的金额必须大于上一个金额！'))
          }
        } else {
          callback()
        }
      }
    },
    selfValidateRage(rule, value, callback) { // 自定义阶梯验证
      const reg = new RegExp(/^(?!(0(\.0{1})?$)|100(\.[1-9])$)([1-9]\d?|\d|100)(\.\d{1})?$/, 'g')
      const flag = !reg.test(value)
      const len = this.ChildForm.MaterialList[rule.field.split('.')[1]][rule.field.split('.')[2]].length
      const data = this.ChildForm.MaterialList[rule.field.split('.')[1]][rule.field.split('.')[2]]
      const i = parseInt(rule.field.split('.')[3])
      const _name = rule.field.split('.')[4]
      const flags = rule.field.split('.')[3] - 1 > -1 && Number(value) > Number(data[i - 1][_name])
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (flag) {
        callback(new Error('请正确输入！'))
      } else {
        if (len > 1) {
          if (flags) {
            if (data[i + 1] && Number(value) >= Number(data[i + 1][_name])) {
              callback(new Error('输入的提成比率必须小于下一个提成比率！'))
            } else {
              callback()
            }
          } else if (rule.field.split('.')[3] - 1 <= -1 && Number(value) < Number(data[i + 1][_name])) {
            callback()
          } else if (rule.field.split('.')[3] - 1 <= -1) {
            callback(new Error('输入的提成比率必须小于下一个提成比率！'))
          } else {
            callback(new Error('输入的提成比率必须大于上一个提成比率！'))
          }
        } else {
          callback()
        }
      }
    }
  }
}

</script>
<style lang="scss">
.toRight {
  //position: absolute;
 // z-index: 99;
  //top: 20px;
  //right: 18px;
  color: #006db8;
  display: block;
  font-size: 14px;
  text-align: right;
  margin-bottom: 10px;
}

.noPadding .el-table th {
  padding: 0;
}

.noPadding .el-table__row td {
  padding: 0px;
}

.noPadding .el-table__row td:first-child .cell {
  padding: 0px;
}

.noPadding .el-table__expand-icon {
  width: 48px;
  height: 39px;
}

.noPadding .is-error .el-input {
  margin-bottom: 12px;
}

.noPadding .extract-rate .is-error .el-form-item__error {
  position: absolute;
  top: 29px !important;
  left: 0px !important;
  z-index: 999;
  width: 100%;
  text-align: center;
}

.noPadding {
  .person-rate {
    margin-bottom: 14px !important;
    .el-input {
      margin-bottom: 0;
    }
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form {
    >.el-form-item {
      margin-bottom: 10px;
    }
  }
}

.border-1 {
  border: 1px solid #dddddd;
  border-bottom: none;
  border-collapse: collapse;
}

/* .noPadding .el-form-item__error{
    display: none !important;
  } */

</style>
<style lang="scss" scoped>
/*.el-form-item{margin-bottom: 22px;}*/
th {
  text-align: center;
}

.changeS {
  color: #999999;
}

.table {
  width: 100%;
  margin: 0 auto;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  color: #555555;
}

.typeName {
  width: 100px;
  height: 30px;
}

/*.inputS{
    border: 1px solid #ddd;
    height: 28px;
    border-radius: 5px;
  }*/
.table>ul {
  border-bottom: 1px solid #ddd;
  line-height: 32px;
  min-width: 1142px
}

.close {
  height: 40px;
  overflow: hidden;
}

.stateOC {
  width: 100%;
  height: 100%;
}

.icon-btn {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;

  img {
    /*padding-top: 8px;*/
    margin-bottom: 5px
  }
}

.wrap-icon {
  cursor: pointer;
}
</style>

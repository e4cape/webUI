<template>
  <div class="content-view">
    <el-alert
      class="m-b-10"
      description="若员工有代缴社保、代缴公积金、代缴所得税、其它扣款、其它奖励等项，请手动输入。"
      title="温馨提示"
      type="error"
      :closable="false">
    </el-alert>
    <el-form :model="tableData" ref="tableForm">
      <el-table :data="tableData.Items" style="width: 100%" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="UserName" label="姓名">
          <template slot-scope="scope">
            <div class="name" :title="scope.row.UserName">{{scope.row.UserName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="DepartmentId" label="部门" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Position" label="职位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LevelTitle" label="职级"></el-table-column>
        <el-table-column prop="PositionPrice" label="职位工资" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnPositionPrice" type="text" @click="getPriceData('positionDlg', scope.row)">{{'￥'+ scope.row.PositionPrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="RatioPrice" label="提成工资" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnRatioPrice" type="text" @click="getPriceData('RatioDlg', scope.row)">{{'￥'+ scope.row.RatioPrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="BonusPrice" label="奖金工资" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnBonusPrice" type="text" @click="getPriceData('BitemListDlg', scope.row)">{{'￥'+ scope.row.BonusPrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="AttendancePrice" label="考勤工资" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnAttendancePrice" type="text" @click="getPriceData('AitemDlg', scope.row)">{{'￥'+ scope.row.AttendancePrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="WagerPrice" label="对赌扣款与奖励" width="150px" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnWagerPrice" type="text" @click="getPriceData('WagerDlg', scope.row)">{{'￥'+ scope.row.WagerPrice}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="WaitPrice" label="应发工资" width="100px" show-overflow-tooltip>
          <template slot="header">
            <span class="m-r-5">应发工资</span>
            <el-tooltip effect="light" content="应发工资=提成工资+奖金工资+考勤工资+对赌扣款与奖励" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{'￥'+ scope.row.RealPrice}}
          </template>
        </el-table-column>
        <el-table-column label="代缴社保">
          <template slot-scope="scope">
            <el-form-item style="margin: 0;" :prop="'Items['+scope.$index+'].SocialPrice'" :rules="[{validator: validateMoney, trigger: 'blur'}]">
              <el-input name="SocialPrice" v-model="scope.row.SocialPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="代缴公积金">
          <template slot-scope="scope">
            <el-form-item style="margin: 0;" :prop="'Items['+scope.$index+'].FundPrice'" :rules="[{validator: validateMoney, trigger: 'blur'}]">
              <el-input name="FundPrice" v-model="scope.row.FundPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="代缴个人所得税" width="120px">
          <template slot-scope="scope">
            <el-form-item style="margin: 0;" :prop="'Items['+scope.$index+'].TaxPrice'" :rules="[{validator: validateMoney, trigger: 'blur'}]">
              <el-input name="TaxPrice" v-model="scope.row.TaxPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="其他扣款">
          <template slot-scope="scope">
            <el-form-item style="margin: 0;" :prop="'Items['+scope.$index+'].DebitPrice'" :rules="[{validator: validateMoney, trigger: 'blur'}]">
              <el-input name="DebitPrice" v-model="scope.row.DebitPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="其他奖励">
          <template slot-scope="scope">
            <el-form-item style="margin: 0;" :prop="'Items['+scope.$index+'].RewardPrice'" :rules="[{validator: validateMoney, trigger: 'blur'}]">
              <el-input name="RewardPrice" v-model="scope.row.RewardPrice"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="RealPrice" label="实发工资" show-overflow-tooltip>
          <template slot="header">
            <span class="m-r-5">实发工资</span>
            <el-tooltip effect="light" content="实发工资=应发工资-代扣代缴" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            {{'￥'+ scope.row.RealPrice}}
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="m-y-20">
        <el-button name="btnSubmit" type="primary" @click="submit('tableForm', 3)">保存并提交</el-button>
        <el-button name="btnSave" type="info" @click="submit('tableForm', 1)">保存草稿</el-button>
        <el-button name="btnCancel" type="default" @click="$router.push('/performance/employee/salarylist')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="职位工资" :visible.sync="positionVisible" width="1120px">
      <el-table :data="[priceDetailData]" style="width: 100%" border>
        <el-table-column prop="BasicPrice" label="基本工资" :formatter="formatter"></el-table-column>
        <el-table-column prop="SubsPrice" label="职位津贴" :formatter="formatter"></el-table-column>
        <el-table-column prop="AttendPrice" label="出勤补贴" :formatter="formatter"></el-table-column>
        <el-table-column prop="MealPrice" label="餐补（月）" :formatter="formatter"></el-table-column>
        <el-table-column prop="TrafficPrice" label="交通补贴" :formatter="formatter"></el-table-column>
        <el-table-column prop="HotelPrice" label="住宿补贴" :formatter="formatter"></el-table-column>
        <el-table-column prop="OtherPrice" label="其他" :formatter="formatter"></el-table-column>
        <el-table-column prop="PositionPrice" label="合计" :formatter="formatter"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="提成工资" :visible.sync="ratioVisible">
      <div class="type" v-if="priceDetailData.PatternType === PatternTypes.Category">
        <div class="header-content" v-if="priceDetailData.LargeType === LargeTypes.Other">提成类型：{{PatternTypes.Types[priceDetailData.PatternType]}}</div>
        <div class="header-content">总销售额(元)：{{$root.toFloat(priceDetailData.CashPrice)}}</div>
        <div class="header-content">提成金额(元)：{{$root.toFloat(priceDetailData.RatioPrice)}}</div>
        <el-table :data="priceDetailData.Items" style="width: 100%" border>
          <el-table-column prop="MaterialType" label="品类" :formatter="formatter"></el-table-column>
          <el-table-column prop="CashPrice" label="销售总额" :formatter="formatter"></el-table-column>
          <el-table-column prop="Rate" label="提成比率（%）">
            <template slot-scope="scope">
              {{$root.toFixed(scope.row.Rate/100,1)}}
            </template>
          </el-table-column>
          <el-table-column prop="RatioPrice" label="提成金额(元)" :formatter="formatter"></el-table-column>
        </el-table>
      </div>
      <div class="type" v-if="priceDetailData.PatternType === PatternTypes.Avg">
        <div class="header-content">提成类型：{{PatternTypes.Types[priceDetailData.PatternType]}}</div>
        <div class="header-content">导购平均提成(元)：{{$root.toFloat(priceDetailData.AvgPrice)}}</div>
        <div class="header-content">提成倍率：{{$root.toFixed(priceDetailData.Rate/100,1)}}</div>
        <div class="header-content">提成金额(元)：{{$root.toFloat(priceDetailData.RatioPrice)}}</div>
      </div>
    </el-dialog>
    <el-dialog title="奖金工资" :visible.sync="bitemListVisible">
      <el-table v-if="targetBouns.length !== 0" :data="targetBouns">
        <el-table-column prop="BonusType" label="奖金项">
          <template slot-scope="scoped">{{BonusType.Types[scoped.row.BonusType]}}</template>
        </el-table-column>
        <el-table-column prop="TargetPrice" label="目标销售额(元)" :formatter="formatter"></el-table-column>
        <el-table-column prop="TgrealPrice" label="实际销售额" :formatter="formatter"></el-table-column>
        <el-table-column prop="ForfeitPrice" label="处罚" :formatter="formatter"></el-table-column>
        <el-table-column prop="RewardPrice" label="奖励" :formatter="formatter"></el-table-column>
      </el-table>
      <br>
      <el-table v-if="largeBouns.length !== 0" :data="largeBouns">
        <el-table-column prop="BonusType" label="奖金项">
          <template slot-scope="scoped">{{BonusType.Types[scoped.row.BonusType]}}</template>
        </el-table-column>
        <el-table-column prop="MinxPrice" label="单一商品金额超过" :formatter="formatter"></el-table-column>
        <el-table-column prop="LargarPrice" label="奖励金额" :formatter="formatter"></el-table-column>
      </el-table>
      <div v-if="!targetBouns.length && !largeBouns.length">无奖金工资</div>
    </el-dialog>
    <el-dialog title="考勤工资" :visible.sync="aitemVisible" width="500px">
      <div style="margin-bottom:5px">应出勤天数：{{priceDetailData.WorkDays || '-'}}天</div>
      <div style="margin-bottom:10px">出勤工资：{{$root.toFloat(priceDetailData.WorkPrice)}}元（计算公式：（职位工资÷考勤天数）* 应出勤天数）</div>
      <table>
        <tr>
          <td>考勤项</td>
          <td>异常数</td>
          <td>扣/加金额</td>
        </tr>
        <tr>
          <td>缺卡</td>
          <td>{{priceDetailData.OffpunchCount || 0}}次</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.OffpunchPrice)}}</td>
        </tr>
        <tr>
          <td>迟到</td>
          <td>{{priceDetailData.LateCount || 0}}次</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.LatePrice)}}</td>
        </tr>
        <tr>
          <td>早退</td>
          <td>{{priceDetailData.LeaveCount || 0}}次</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.LeavePrice)}}</td>
        </tr>
        <tr>
          <td>旷工</td>
          <td>{{priceDetailData.AbsenceDays || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.AbsencePrice)}}</td>
        </tr>
        <tr>
          <td>事假</td>
          <td>{{priceDetailData.AffairDays || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.AffairPrice)}}</td>
        </tr>
        <tr>
          <td>病假</td>
          <td>{{priceDetailData.SickDays || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.SickPrice)}}</td>
        </tr>
        <tr>
          <td>出差</td>
          <td>{{priceDetailData.TravelCount || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.TravelPrice)}}</td>
        </tr>
        <tr>
          <td>普通加班</td>
          <td>{{priceDetailData.OrdinaryDays || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.OrdinaryPrice)}}</td>
        </tr>
        <tr>
          <td>节日加班</td>
          <td>{{priceDetailData.HolidayDays || 0}}天</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.HolidayPrice)}}</td>
        </tr>
      </table>
    </el-dialog>
    <el-dialog title="对赌扣款与奖励" :visible.sync="wagerVisible" width="500px">
      <table>
        <tr>
          <td>项目</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>对赌扣款</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.DecredPrice)}}</td>
        </tr>
        <tr>
          <td>对赌奖励{{$root.toFloat(priceDetailData.RewardPrice) > 0 ? '（包含本金）' : ''}}</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.RewardPrice)}}</td>
        </tr>
      </table>
    </el-dialog>
    <el-dialog title="代扣代缴" :visible.sync="sitemVisible" width="30%">
      <table>
        <tr>
          <td>项目</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>代缴社保</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.SocialPrice)}}</td>
        </tr>
        <tr>
          <td>代缴公积金</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.FundPrice)}}</td>
        </tr>
        <tr>
          <td>代缴个人所得税</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.TaxPrice)}}</td>
        </tr>
        <tr>
          <td>其他扣款</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.DebitPrice)}}</td>
        </tr>
        <tr>
          <td>其他奖励</td>
          <td>{{'￥' +$root.toFloat(priceDetailData.RewardPrice)}}</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import {
  JunkInnOrderBasicState, MaterialType,   
} from '@/enums/marketing'
import {
  RatioPatternType, BonusType,RatioLargeType
} from '@/enums/performance'
import {
  KPIS_API_SETTLE_SALARY_BASIC_GET,
  KPIS_API_SETTLE_SALARY_ITEM_GETS,
  KPIS_API_SETTLE_POSITION_SALARY_REQ,
  KPIS_API_SETTLE_RATIO_BASIC_REQ,
  KPIS_API_SETTLE_BONUS_ITEM_GETS,
  KPIS_API_SETTLE_ATTENDANCE_ITEM_GET,
  KPIS_API_SETTLE_WAGER_BASIC_REQ ,
  KPIS_API_SETTLE_SALARY_BASIC_UPDATE,
  KPIS_API_SETTLE_SALARY_ITEM_GET
} from '@/apis/performance'
import {
  MERCHANT_API_DROPDOWN_DEPARTLIST 
} from '@/apis/merchant'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      auditStatus: JunkInnOrderBasicState,
      allDepts: [],
      tableData: {
        SettleDate: '',
        SettleId: '',
      },
      priceDetailData: {
      },
      LargeTypes: RatioLargeType,
      PatternTypes: RatioPatternType,
      BonusType: BonusType,
      targetBouns: [],
      largeBouns: [],
      positionVisible: false,
      ratioVisible: false,
      bitemListVisible: false,
      aitemVisible: false,
      wagerVisible: false,
      sitemVisible: false,
    }
  },
  methods: {
    salaryDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_DROPDOWN_DEPARTLIST({State: 0}).then((resp) => {
        if(resp.data.Code === 'CORRECT'){
          this.allDepts = resp.data.Data.Rows
          KPIS_API_SETTLE_SALARY_BASIC_GET({
            SettleId: this.$route.params.id
          }).then(res => {
            this.$store.commit('SET_TB_LOADING', false)
            if(res.data.Code === 'CORRECT'){
              if (res.data.Data.Status === this.auditStatus.Audit || res.data.Data.Status === this.auditStatus.Abandon) {
                this.$router.go(-1)
              } else{
                this.tableData.SettleDate = res.data.Data.SettleDate ? dayjs(new Date(res.data.Data.SettleDate)).format('YYYY-MM-DD') : ''
                this.tableData.SettleId = res.data.Data.SettleId
              }
            }
          })
          KPIS_API_SETTLE_SALARY_ITEM_GETS({
            SettleId: this.$route.params.id 
          }).then(res => {
            if(res.data.Code === 'CORRECT'){
              let tmpArr = res.data.Data
              tmpArr.forEach(item => {
                for(let key in item){
                  if(key.indexOf('Price') !== -1){
                    item[key] = this.$root.toFloat(item[key])
                  }
                }
              })
              this.$set(this.tableData,'Items',tmpArr)
            }
          })
        }
      })
    },
    getPriceData(name, data) {
      let priceData
      switch (name) {
        case 'positionDlg':
          this.positionVisible = true
          priceData = KPIS_API_SETTLE_POSITION_SALARY_REQ({
            EventDate: this.tableData.SettleDate,
            PositionId: data.PositionId,
            LevelIndex: data.LevelIndex,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'RatioDlg':
          this.ratioVisible = true
          priceData = KPIS_API_SETTLE_RATIO_BASIC_REQ({
            EventDate: this.tableData.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'BitemListDlg':
          this.bitemListVisible = true
          priceData = KPIS_API_SETTLE_BONUS_ITEM_GETS({
            EventDate: this.tableData.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'AitemDlg':
          this.aitemVisible = true
          priceData = KPIS_API_SETTLE_ATTENDANCE_ITEM_GET({
            SettleDate: this.tableData.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'WagerDlg':
          this.wagerVisible = true
          priceData = KPIS_API_SETTLE_WAGER_BASIC_REQ({
            EventDate: this.tableData.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'SitemDlg':
          this.sitemVisible = true
          priceData = KPIS_API_SETTLE_SALARY_ITEM_GET({
            ItemId: data.ItemId,
          })
          break
        default:
      }
      priceData.then(res => {
        if (res.data.Code === 'CORRECT') {
          this.priceDetailData = res.data.Data || {
          }
          if (this.priceDetailData.length && this.priceDetailData.length > 0) {
            this.getBitemList()
          }
        }
      })
    },
    submit(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableData.Items.length !== 0) {
            var items = this.tableData.Items.map(item => {
              let obj = {
              }
              for (var key in item) {
                if (key === 'ItemId'){ 
                  obj[key] = item[key]
                }else if(key === 'SocialPrice' || key === 'FundPrice' || key === 'TaxPrice' || key === 'DebitPrice' || key === 'RewardPrice') {
                  obj[key] = this.$root.toInt(item[key])
                }
              }
              return obj
            })
            KPIS_API_SETTLE_SALARY_BASIC_UPDATE({
              SettleId: this.tableData.SettleId,
              Status: status,
              Items: items
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$router.go(-1)
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '工资列表不能为空！'
            })
          }
        } else {
          return false
        }
      })
    },
    validateMoney(rule, value, callback) {
      const reg = new RegExp(/^([1-9]\d*|[0]{1,1}|([1-9]\d*|[0]{1})[.]{1}[0-9]{1,2})$/)
      if (value === '') {
        callback()
      } else if (!reg.test(value)) {
        callback(new Error())
      } else {
        callback()
      }
    },
    formatter(row, column, value) {
      switch (column.property) {
        case 'DepartmentId':
          return this.allDepts.find(v => v.Id === value) ? this.allDepts.find(v => v.Id === value).Value : ''
        case 'MaterialType':
          return MaterialType.Types[value]
        default:
          return '￥' + this.$root.toFloat(value)
      }
    },
    getBitemList() {
      this.targetBouns = []
      this.largeBouns = []
      this.priceDetailData.forEach(item => {
        if (item.BonusType === BonusType.Target) {
          this.targetBouns.push(item)
        }
        if (item.BonusType === BonusType.Largar) {
          this.largeBouns.push(item)
        }
      })
    },
  },
  mounted() {
    this.salaryDetail()
  }
}

</script>
<style lang="scss" scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.bg-purple-dark {
    background: #99a9bf;
  }
  table {
    width: 100%;
    border: 1px solid #e6ebf5;
    border-collapse: collapse;
    tr {
      td {
        height: 49px;
        text-align: center;
        border: 1px solid #e6ebf5
        
      }
      &:first-of-type {
        td {
          color: #878d99;
          background-color: #fafafa;
        }
      }
    }
  }

</style>

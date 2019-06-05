<template>
  <div class="content-view p-20">
    <h2 class="title-header">员工工资详情</h2>
    <el-row class="m-y-10" style="line-height: 30px">
      <el-col :span="6">创建日期：{{detailMain.CreateTime}}</el-col>
      <el-col :span="6">创建人：{{detailMain.CreateUser}}</el-col>
      <el-col :span="6" class="status-box">
        <span>状态：</span>
        <span :class="detailMain.Status | findKey(auditStatus)">{{auditStatus.Types[detailMain.Status]}}</span>
        <template v-if="detailMain.Status===auditStatus.Reject || detailMain.Status === auditStatus.Abandon">（{{detailMain.CheckNote}}）</template>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <el-button name="btnExportExl" type="primary" @click="exportExl">导出报表</el-button>
      </el-col>
    </el-row>
    <el-table :data="detailList" v-loading="loading" style="width: 100%">
      <el-table-column prop="UserName" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="DepartmentId" label="部门" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Position" label="职位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LevelTitle" label="职级" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PositionPrice" label="职位工资" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnPositionPrice" type="text" @click="getPriceData('positionDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.PositionPrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="RatioPrice" label="提成工资" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnRatioPrice" type="text" @click="getPriceData('RatioDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.RatioPrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="BonusPrice" label="奖金工资" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnBonusPrice" type="text" @click="getPriceData('BitemListDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.BonusPrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="AttendancePrice" label="考勤工资" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnAttendancePrice" type="text" @click="getPriceData('AitemDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.AttendancePrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="WagerPrice" label="对赌扣款与奖励" width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnWagerPrice" type="text" @click="getPriceData('WagerDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.WagerPrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="WaitPrice" label="应发工资" :formatter="formatter" width="100px" show-overflow-tooltip>
        <template slot="header">
          <span class="m-r-5">应发工资</span>
          <el-tooltip effect="light" content="应发工资=提成工资+奖金工资+考勤工资+对赌扣款与奖励" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="WithholdPrice" label="代扣代缴" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button name="btnWithholdPrice" type="text" @click="getPriceData('SitemDlg', scope.row)">{{'￥' + $root.toFloat(scope.row.WithholdPrice)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="RealPrice" label="实发工资" :formatter="formatter" show-overflow-tooltip>
        <template slot="header">
          <span class="m-r-5">实发工资</span>
          <el-tooltip effect="light" content="实发工资=应发工资-代扣代缴" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="职位工资" :visible.sync="positionVisible" width="950px">
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
          <el-table-column prop="Rate" label="提成比率（%）" :formatter="formatter">
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
    </el-dialog>
    <el-dialog title="考勤工资" :visible.sync="aitemVisible" width="650px">
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
          <td>{{'￥' + $root.toFloat(priceDetailData.OffpunchPrice)}}</td>
        </tr>
        <tr>
          <td>迟到</td>
          <td>{{priceDetailData.LateCount || 0}}次</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.LatePrice)}}</td>
        </tr>
        <tr>
          <td>早退</td>
          <td>{{priceDetailData.LeaveCount || 0}}次</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.LeavePrice)}}</td>
        </tr>
        <tr>
          <td>旷工</td>
          <td>{{priceDetailData.AbsenceDays || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.AbsencePrice)}}</td>
        </tr>
        <tr>
          <td>事假</td>
          <td>{{priceDetailData.AffairDays || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.AffairPrice)}}</td>
        </tr>
        <tr>
          <td>病假</td>
          <td>{{priceDetailData.SickDays || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.SickPrice)}}</td>
        </tr>
        <tr>
          <td>出差</td>
          <td>{{priceDetailData.TravelCount || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.TravelPrice)}}</td>
        </tr>
        <tr>
          <td>普通加班</td>
          <td>{{priceDetailData.OrdinaryDays || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.OrdinaryPrice)}}</td>
        </tr>
        <tr>
          <td>节日加班</td>
          <td>{{priceDetailData.HolidayDays || 0}}天</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.HolidayPrice)}}</td>
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
          <td>{{'￥' + $root.toFloat(priceDetailData.DecredPrice)}}</td>
        </tr>
        <tr>
          <td>对赌奖励{{$root.toFloat(priceDetailData.RewardPrice) > 0 ? '（包含本金）' : ''}}</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.RewardPrice)}}</td>
        </tr>
      </table>
    </el-dialog>
    <el-dialog title="代扣代缴" :visible.sync="sitemVisible" width="500px">
      <table>
        <tr>
          <td>项目</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>代缴社保</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.SocialPrice)}}</td>
        </tr>
        <tr>
          <td>代缴公积金</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.FundPrice)}}</td>
        </tr>
        <tr>
          <td>代缴个人所得税</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.TaxPrice)}}</td>
        </tr>
        <tr>
          <td>其他扣款</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.DebitPrice)}}</td>
        </tr>
        <tr>
          <td>其他奖励</td>
          <td>{{'￥' + $root.toFloat(priceDetailData.RewardPrice)}}</td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import {
  JunkInnOrderBasicState, MaterialType 
} from '@/enums/marketing'
import {
  RatioPatternType, BonusType, RatioLargeType 
} from '@/enums/performance'
import dayjs from 'dayjs'
import {
  KPIS_API_SETTLE_POSITION_SALARY_REQ,
  KPIS_API_SETTLE_RATIO_BASIC_REQ,
  KPIS_API_SETTLE_BONUS_ITEM_GETS,
  KPIS_API_SETTLE_ATTENDANCE_ITEM_GET,
  KPIS_API_SETTLE_WAGER_BASIC_REQ,
  KPIS_API_SETTLE_SALARY_ITEM_GET,
  KPIS_API_SETTLE_SALARY_ITEM_SALARYDETAILEXPORT,
  KPIS_API_SETTLE_SALARY_ITEM_GETS,
  KPIS_API_SETTLE_SALARY_BASIC_GET,
} from '@/apis/performance'
import {
  MERCHANT_API_DROPDOWN_DEPARTLIST 
} from '@/apis/merchant'
export default {
  data() {
    return {
      allDepts: [],
      detailMain: {
      },
      detailList:[
      ],
      iShow: false,
      auditStatus: JunkInnOrderBasicState,
      priceDetailData: {
      },
      loading: false,
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
      ExportColumns: [
        {
          FieldEnName: 'UserName',
          FieldCnName: '姓名',
        },
        {
          FieldEnName: 'Department',
          FieldCnName: '部门',
        },
        {
          FieldEnName: 'Position',
          FieldCnName: '职位',
        },
        {
          FieldEnName: 'LevelTitle',
          FieldCnName: '职级',
        },
        {
          FieldEnName: 'PositionPrice',
          FieldCnName: '职位工资',
          Precision: 2
        },
        {
          FieldEnName: 'RatioPrice',
          FieldCnName: '提成工资',
          Precision: 2
        },
        {
          FieldEnName: 'BonusPrice',
          FieldCnName: '奖金工资',
          Precision: 2
        },
        {
          FieldEnName: 'AttendancePrice',
          FieldCnName: '考勤工资',
          Precision: 2
        },
        {
          FieldEnName: 'WagerPrice',
          FieldCnName: '对赌扣款与奖励',
          Precision: 2
        },
        {
          FieldEnName: 'WaitPrice',
          FieldCnName: '应发工资',
          Precision: 2
        },
        {
          FieldEnName: 'WithholdPrice',
          FieldCnName: '代扣代缴',
          Precision: 2
        },
        {
          FieldEnName: 'RealPrice',
          FieldCnName: '实发工资',
          Precision: 2
        },
      ]
    }
  },
  methods: {
    getPriceData(name, data) {
      let priceData
      switch (name) {
        case 'positionDlg':
          this.positionVisible = true
          priceData = KPIS_API_SETTLE_POSITION_SALARY_REQ({
            EventDate: this.detailMain.SettleDate,
            PositionId: data.PositionId,
            LevelIndex: data.LevelIndex,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'RatioDlg':
          this.ratioVisible = true
          priceData = KPIS_API_SETTLE_RATIO_BASIC_REQ({
            EventDate: this.detailMain.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'BitemListDlg':
          this.bitemListVisible = true
          priceData = KPIS_API_SETTLE_BONUS_ITEM_GETS({
            EventDate: this.detailMain.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'AitemDlg':
          this.aitemVisible = true
          priceData = KPIS_API_SETTLE_ATTENDANCE_ITEM_GET({
            SettleDate: this.detailMain.SettleDate,
            UserId: data.UserId,
            CharacterId: this.$store.getters.user_session.CharacterId
          })
          break
        case 'WagerDlg':
          this.wagerVisible = true
          priceData = KPIS_API_SETTLE_WAGER_BASIC_REQ({
            EventDate: this.detailMain.SettleDate,
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
          this.priceDetailData = res.data.Data || {}
          if (this.priceDetailData.length && this.priceDetailData.length > 0) {
            this.getBitemList()
          }
        }
      })
    },
    exportExl() {
      KPIS_API_SETTLE_SALARY_ITEM_SALARYDETAILEXPORT({
        SettleId: parseInt(this.$route.params.id),
        ExportColumns:this.ExportColumns
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data.FilePath)
        } else {
          this.$message({
            type: 'info',
            message: res.data.Message
          })
        }
      })
    },
    // 工资列表
    async getDetail() {
      this.loading = true      
      const resAll = await Promise.all([
        MERCHANT_API_DROPDOWN_DEPARTLIST({State: 0}),
        KPIS_API_SETTLE_SALARY_ITEM_GETS({
          SettleId: this.$route.params.id
        }),KPIS_API_SETTLE_SALARY_BASIC_GET({
          SettleId: this.$route.params.id
        })
      ])
      this.loading = false
      if (resAll[0].data.Code === 'CORRECT') {
        this.allDepts = resAll[0].data.Data.Rows
      }
      if (resAll[1].data.Code === 'CORRECT') {
        this.detailList = resAll[1].data.Data
      }
      if (resAll[2].data.Code === 'CORRECT') {
        this.detailMain = resAll[2].data.Data
        this.detailMain.SettleDate = dayjs(new Date(this.detailMain.SettleDate)).format('YYYY-MM-DD')
        this.detailMain.CreateTime = dayjs(new Date(this.detailMain.CreateTime)).format('YYYY-MM-DD')
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
    this.getDetail()
  }
}

</script>
<style lang="scss" scoped>
.title-header {
  font-size: 18px;
  text-align: center;
}
.status-box {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
}
.sub-title {
  font-size: 16px;
}

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

<template>
  <div class="customer-portrait-analysis">
    <chart-hd>
      <div class="fl bold">年龄分析</div>
      <div class="fl item">
        <el-select name="memberType1" v-model="memberType1" @change="memberTypeChange($event,1)" placeholder="所有客户">
          <el-option label="所有客户" value></el-option>
          <el-option v-for="item in EnumCharacterType" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character1" @onCharacterChange="onCharacterChange('age')"></character>
      </div>
      <div name="ReportFigureAge" class="fr range-set" @click="rangeSet(SettingTagTypes.ReportFigureAge)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
    </chart-hd>
    <chart-bd :tableData="TDageAnalysis" :tableColumn="TCageAnalysis" :loadingChartBd="loadingAge"/>
    <chart-hd>
      <div class="fl bold">性别分析</div>
      <div class="fl item">
        <el-select name="memberType2" v-model="memberType2" @change="memberTypeChange($event,2)" placeholder="所有客户">
          <el-option label="所有客户" value></el-option>
          <el-option v-for="item in EnumCharacterType" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character2" @onCharacterChange="onCharacterChange('sex')"></character>
      </div>
    </chart-hd>
    <chart-bd :tableData="TDsexAnalysis" :tableColumn="TCsexAnalysis" :loadingChartBd="loadingSex"/>
    <chart-hd>
      <div class="fl bold">婚姻状态分析</div>
      <div class="fl item">
        <el-select name="memberType2" v-model="memberType5" @change="memberTypeChange($event,5)" placeholder="所有客户">
          <el-option label="所有客户" value></el-option>
          <el-option v-for="item in EnumCharacterType" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character7" @onCharacterChange="onCharacterChange('marriage')"></character>
      </div>
    </chart-hd>
    <chart-bd :tableData="TDmarriageAnalysis" :tableColumn="TCmarriageAnalysis" :loadingChartBd="loadingMarriage"/>
    <chart-hd>
      <div class="fl bold">地域分析</div>
      <div class="fl item">
        <el-select name="memberType3" v-model="memberType3" @change="memberTypeChange($event,3)" placeholder="所有客户">
          <el-option label="所有客户" value></el-option>
          <el-option v-for="item in EnumCharacterType" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character3" @onCharacterChange="onCharacterChange('area')"></character>
      </div>
    </chart-hd>
    <chart-bd :tableData="TDareaAnalysis" :tableColumn="TCareaAnalysis" :loadingChartBd="loadingArea"/>
    <chart-hd>
      <div class="fl bold">综合评分</div>
      <div class="fl item">
        <el-select name="memberType4" v-model="memberType4" @change="memberTypeChange($event,4)" placeholder="所有客户">
          <el-option label="所有客户" value></el-option>
          <el-option v-for="item in EnumCharacterType" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character4" @onCharacterChange="onCharacterChange('score')"></character>
      </div>
      <div name="ReportFigureScore" class="fr range-set" @click="rangeSet(SettingTagTypes.ReportFigureScore)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
    </chart-hd>
    <chart-bd :tableData="TDoverallScore" :tableColumn="TCoverallScore" :loadingChartBd="loadingScore"/>
    <chart-hd>
      <div class="fl bold">消费力分析</div>
      <div class="fl item">
        <el-select name="expendDateType" v-model="expendDateType" @change="expendDatePriceTypeChange" placeholder="请选择">
          <el-option v-for="item in EnumStatisticsExpendDateTypes" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <el-select name="expendPriceType" v-model="expendPriceType" @change="expendDatePriceTypeChange" placeholder="请选择">
          <el-option v-for="item in EnumStatisticsExpendPriceTypes" :key="item.key" :label="'按' + item.title" :value="item.key"></el-option>
        </el-select>
      </div>
      <div class="fl item">
        <character ref="character5" @onCharacterChange="onCharacterChange('power')"></character>
      </div>
      <div name="ReportFigureExpend" class="fr range-set" @click="rangeSet(SettingTagTypes.ReportFigureExpend)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
    </chart-hd>
    <chart-bd :tableData="TDspendingPowerAnalysis" :tableColumn="TCspendingPowerAnalysis" :loadingChartBd="loadingPower"/>
    <chart-hd>
      <div class="fl bold">客户标签分布</div>
      <div class="fl item">
        <character ref="character6" @onCharacterChange="onCharacterChange('tag')"></character>
      </div>
    </chart-hd>
    <chart-bd :tableData="TDcustomerTagDistribution" :tableColumn="TCcustomerTagDistribution" :chartPieIf="false" :loadingChartBd="loadingTag">
      <ve-wordcloud :data="wordcloudData"></ve-wordcloud>
    </chart-bd>
    <settingTagModal v-if="visibleSettingTagModal" :visibleSettingTagModal="visibleSettingTagModal" @listenVisibleSettingTagModal="settingTagModalClose" :tagType="tagType"/>
  </div>
</template>
<script>
import character from './templateCharacter'
import chartHd from './templateChartHd'
import chartBd from './templateChartBd'
import settingTagModal from '@/components/scrm/settingTagModal'
import VeWordcloud from 'v-charts/lib/wordcloud.common'
import {
  MEMBERSHIP_API_REPORT_GETMEMBERAGECHART,
  MEMBERSHIP_API_REPORT_GETMEMBERSEXYCHART,
  MEMBERSHIP_API_REPORT_GETMEMBERCITYCHART,
  MEMBERSHIP_API_REPORT_GETMEMBERSCORECHART,
  MEMBERSHIP_API_REPORT_GETMEMBEREXPENDCHART,
  MEMBERSHIP_API_REPORT_GETMEMBERTAGCHART,
  MEMBERSHIP_API_REPORT_GETMARRIAGECHART
} from '@/apis/membership'
import {
  MemberTypeGroup,
  StatisticsExpendDateTypes,
  StatisticsExpendPriceTypes,
  SettingTagTypes
} from '@/enums/membership'
export default {
  data() {
    return {
      memberType1: '', // 年龄-客户值
      memberType2: '', // 性别-客户值
      memberType3: '', // 地域-客户值
      memberType4: '', // 评分-客户值
      memberType5: '', // 婚姻-客户值
      expendDateType: StatisticsExpendDateTypes.Total, // 消费力分析-年份类型
      expendPriceType: StatisticsExpendPriceTypes.OrderPrice, // 消费力分析-付款类型
      TDageAnalysis: [], // 年龄分析数据
      TDsexAnalysis: [], // 性别分析数据
      TDmarriageAnalysis: [], // 婚姻分析数据
      TDareaAnalysis: [], // 地域分析数据
      TDoverallScore: [], // 综合评分数据
      TDspendingPowerAnalysis: [], // 消费力分析数据
      TDcustomerTagDistribution: [], // 客户标签分布数据
      visibleSettingTagModal: false, // 范围设置显隐
      tagType: null, // 标签类型
      // 词云
      wordcloudData: {
        columns: ['word', 'count'],
        rows: []
      },
      // loading相关
      loadingAge: false,
      loadingSex: false,
      loadingArea: false,
      loadingScore: false,
      loadingPower: false,
      loadingTag: false,
      loadingMarriage: false,
      // 年龄分析表格
      TCageAnalysis: [
        {
          label: '年龄',
          type: 'label'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 性别分析表格
      TCsexAnalysis: [
        {
          label: '性别',
          type: 'labelString'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 婚姻状态分析表格
      TCmarriageAnalysis: [
        {
          label: '状态',
          type: 'labelString'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        },
      ],
      // 地域分析表格
      TCareaAnalysis: [
        {
          label: '地域',
          type: 'label'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 综合评分表格
      TCoverallScore: [
        {
          label: '综合评分',
          type: 'label'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 消费力分析表格
      TCspendingPowerAnalysis: [
        {
          label: '消费金额',
          type: 'label'
        },
        {
          label: '人数',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 客户标签分布表格
      TCcustomerTagDistribution: [
        {
          label: '标签',
          type: 'label'
        },
        {
          label: '人数',
          type: 'counts'
        }
      ]
    }
  },
  computed: {
    EnumCharacterType() {
      return MemberTypeGroup.Types
    },
    EnumStatisticsExpendDateTypes() {
      return StatisticsExpendDateTypes.Types
    },
    EnumStatisticsExpendPriceTypes() {
      return StatisticsExpendPriceTypes.Types
    },
    SettingTagTypes() {
      return SettingTagTypes
    }
  },
  mounted() {
    this.getMemberAgeChart()
    this.getMemberSexyChart()
    this.getMemberCityChart()
    this.getMemberScoreChart()
    this.getMemberExpendChart()
    this.getMemberTagChart()
    this.getClinetMarriageChart()
  },
  methods: {
    // 获取characterId
    getcharacterId(n) {
      console.log(n)
      return this.$refs['character' + n].characterIdArr[
        this.$refs['character' + n].characterIdArr.length - 1
      ]
    },
    // 客户类型选择
    memberTypeChange(v, p) {
      this['memberType' + p] = v
      this.onCharacterChange(p)
    },
    // 年份类型,付款类型选择
    expendDatePriceTypeChange(v) {
      this.expendDateType = v
      this.getMemberExpendChart()
    },
    // 公司选择
    onCharacterChange(p) {
      switch (p) {
        case 'age':
        case 1:
          this.getMemberAgeChart()
          break
        case 'sex':
        case 2:
          this.getMemberSexyChart()
          break
        case 'area':
        case 3:
          this.getMemberCityChart()
          break
        case 'score':
        case 4:
          this.getMemberScoreChart()
          break
        case 'marriage':
        case 5:
          this.getClinetMarriageChart()
          break
        case 'power':
          this.getMemberExpendChart()
          break
        case 'tag':
          this.getMemberTagChart()
          break
        default:
          return
      }
    },
    // 会员年龄统计
    getMemberAgeChart() {
      this.loadingAge = true
      const param = {
        memberType: this.memberType1,
        characterId: this.getcharacterId(1)
      }
      MEMBERSHIP_API_REPORT_GETMEMBERAGECHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDageAnalysis = res.data.Data
        }
        this.loadingAge = false
      })
    },
    // 客户婚姻状态分析
    getClinetMarriageChart() {
      this.loadingMarriage = true
      const param = {
        memberType: this.memberType5,
        characterId: this.getcharacterId(7)
      }
      MEMBERSHIP_API_REPORT_GETMARRIAGECHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
          this.TDmarriageAnalysis = res.data.Data
        }
        this.loadingMarriage = false
      })
    },
    // 客户性别统计
    getMemberSexyChart() {
      this.loadingSex = true
      const param = {
        memberType: this.memberType2,
        characterId: this.getcharacterId(2)
      }
      MEMBERSHIP_API_REPORT_GETMEMBERSEXYCHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDsexAnalysis = res.data.Data
        }
        this.loadingSex = false
      })
    },

    // 客户地区(城市)统计
    getMemberCityChart() {
      this.loadingArea = true
      const param = {
        memberType: this.memberType3,
        characterId: this.getcharacterId(3)
      }
      MEMBERSHIP_API_REPORT_GETMEMBERCITYCHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDareaAnalysis = res.data.Data
        }
        this.loadingArea = false
      })
    },
    // 客户综合评分统计
    getMemberScoreChart() {
      this.loadingScore = true
      const param = {
        memberType: this.memberType4,
        characterId: this.getcharacterId(4)
      }
      MEMBERSHIP_API_REPORT_GETMEMBERSCORECHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDoverallScore = res.data.Data
        }
        this.loadingScore = false
      })
    },
    // 客户消费力统计
    getMemberExpendChart() {
      this.loadingPower = true
      const param = {
        characterId: this.getcharacterId(5),
        expendDateType: this.expendDateType,
        expendPriceType: this.expendPriceType
      }
      MEMBERSHIP_API_REPORT_GETMEMBEREXPENDCHART(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDspendingPowerAnalysis = res.data.Data
        }
        this.loadingPower = false
      })
    },
    // 客户标签统计
    getMemberTagChart() {
      this.loadingTag = true
      MEMBERSHIP_API_REPORT_GETMEMBERTAGCHART(this.getcharacterId(6)).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.TDcustomerTagDistribution = res.data.Data
            const tableDataArr = Array.from(res.data.Data)
            let seriesDataArr = []
            for (let i = 0; i < tableDataArr.length; i += 1) {
              seriesDataArr.push({
                word: tableDataArr[i].label,
                count: tableDataArr[i].counts
              })
            }
            this.wordcloudData.rows = seriesDataArr
          }
          this.loadingTag = false
        }
      )
    },
    // 范围设置
    // -打开
    rangeSet(settingTagType) {
      this.visibleSettingTagModal = true
      this.tagType = settingTagType
    },
    // -关闭
    settingTagModalClose() {
      this.visibleSettingTagModal = false
      switch (this.tagType) {
        case SettingTagTypes.ReportFigureAge:
          this.getMemberAgeChart()
          break
        case SettingTagTypes.ReportFigureScore:
          this.getMemberScoreChart()
          break
        case SettingTagTypes.ReportFigureExpend:
          this.getMemberExpendChart()
          break
        default:
          return
      }
    }
  },
  components: {
    character,
    chartHd,
    chartBd,
    settingTagModal,
    VeWordcloud
  }
}
</script>
<style lang="scss" scoped>
#theWordCloud {
  width: 400px;
  height: 300px;
  margin: 0 auto;
}
</style>
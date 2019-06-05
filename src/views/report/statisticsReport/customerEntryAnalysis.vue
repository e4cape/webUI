<template>
  <div class="customer-entry-analysis">
    <div class="summary clearfix">
      <div class="hd">
        <chart-hd>
          <div class="fl bold">进店时间</div>
          <div class="fl item daterange">
            <el-date-picker
              type="daterange"
              @change="onMarketingChange"
              name="chartTime"
              v-model="chartTime"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :clearable="false"
            ></el-date-picker>
          </div>
          <div class="fl item">
            <character ref="character" @onCharacterChange="onCharacterChange"></character>
          </div>
          <div class="fl item">
            <el-select
              v-if="StoreCharacterType == EnumCharacterType.Company && StorewechatSettingType == EnumCompanyBasicWechatSettingType.Company"
              name="characterIdSp"
              v-model="characterIdSp"
              placeholder="所有门店"
              @change="onCharacterChange"
            >
              <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :label="item.Value" :value="parseInt(item.CharacterId)"></el-option>
            </el-select>
          </div>
        </chart-hd>
      </div>
      <div class="bd clearfix" v-loading="loadingTop">
        <ul class="fl">
          <li v-for="(item,index) in cardDatas" :key="index">
            <card :name="item.name" :num="item.num"></card>
          </li>
        </ul>
        <div class="fl sp">
          <p>{{transactionRatioText}}</p>成交比例
        </div>
      </div>
    </div>
    <chart-hd>
      <div class="fl bold">
        达成交易时间分析
        <span>（首次进店与达成交易相差的时间）</span>
      </div>
      <div name="ReportExpendTimeSpan" class="fr range-set" @click="rangeSet(SettingTagTypes.ReportExpendTimeSpan)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
    </chart-hd>
    <chart-bd :tableData="TDtimeStatistics" :tableColumn="TCtimeStatistics" :loadingChartBd="loadingTime"/>
    <chart-hd>
      <div class="fl bold">
        达成交易金额差值分析
        <span>（与预算相差的金额）</span>
      </div>
      <div name="ReportExpendPriceSpan" class="fr range-set" @click="rangeSet(SettingTagTypes.ReportExpendPriceSpan)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
    </chart-hd>
    <chart-bd :tableData="TDpriceStatistics" :tableColumn="TCpriceStatistics" :loadingChartBd="loadingPrice"/>
    <chart-hd>
      <div class="bold">
        达成交易货品类型变化
        <span>（与意向商品对比）</span>
      </div>
    </chart-hd>
    <chart-bd :tableData="TDgoodsCategoryStatistics" :tableColumn="TCgoodsCategoryStatistics" :loadingChartBd="loadingGoodsCategory"/>
    <settingTagModal v-if="visibleSettingTagModal" :visibleSettingTagModal="visibleSettingTagModal" @listenVisibleSettingTagModal="settingTagModalClose" :tagType="tagType"/>
  </div>
</template>
<script>
import character from './templateCharacter'
import card from './templateCard'
import chartHd from './templateChartHd'
import chartBd from './templateChartBd'
import settingTagModal from '@/components/scrm/settingTagModal'
import {
  MEMBERSHIP_API_REPORTENTERLOG_GETENTERLOGSTATISTICS,
  MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDTIMESTATISTICS,
  MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDPRICESTATISTICS,
  MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDGOODSCATEGORYSTATISTICS
} from '@/apis/membership'
import {
  SettingTagTypes,
  CompanyBasicWechatSettingType
} from '@/enums/membership'
import { CharacterType } from '@/enums/common.js'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      characterIdSp: '',
      loadingTop: false,
      chartTime: [
        dayjs()
          .subtract(7, 'day')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ],
      pickerOptions: {
        disabledDate: time => {
          return (
            time < dayjs().subtract(100, 'days') ||
            time > dayjs().add(0, 'days')
          )
        }
      },
      transactionRatioText: '', // 成交比例
      // 进店统计数据
      cardDatas: [
        {
          name: '进店人数',
          num: ''
        },
        {
          name: '进店次数',
          num: ''
        },
        {
          name: '平均进店人次',
          num: ''
        },
        {
          name: '平均成本预算',
          num: ''
        },
        {
          name: '意向商品平均金额',
          num: ''
        },
        {
          name: '达成交易人数',
          num: ''
        },
        {
          name: '达成交易平均时间(天)',
          num: ''
        },
        {
          name: '达成交易最快时间(天)',
          num: ''
        },
        {
          name: '达成交易最慢时间(天)',
          num: ''
        },
        {
          name: '达成交易平均金额',
          num: ''
        }
      ],
      TDtimeStatistics: [], // 达成交易时间分析数据
      TDpriceStatistics: [], // 达成交易金额差值分析数据
      TDgoodsCategoryStatistics: [], // 达成交易货品类型变化数据
      visibleSettingTagModal: false, // 范围设置显隐
      tagType: null, // 标签类型
      // loading相关
      loadingTime: false,
      loadingPrice: false,
      loadingGoodsCategory: false,
      TCtimeStatistics: [
        {
          label: '达成交易时间',
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
      TCpriceStatistics: [
        {
          label: '差值金额',
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
      TCgoodsCategoryStatistics: [
        {
          label: '实际交易商品',
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
      ]
    }
  },
  computed: {
    characterId() {
      if (
        this.$store.getters.user_session.CharacterType ==
        CharacterType.Company &&
        this.$store.getters.wechatSettingType ==
        CompanyBasicWechatSettingType.Company
      ) {
        return this.characterIdSp
      } else if (
        this.$store.getters.user_session.CharacterType == CharacterType.Group
      ) {
        return this.$refs.character.characterIdArr[
          this.$refs.character.characterIdArr.length - 1
        ]
      } else {
        return ''
      }
    },
    EnumCharacterType() {
      return CharacterType
    },
    EnumCompanyBasicWechatSettingType() {
      return CompanyBasicWechatSettingType
    },
    StoreCharacterType() {
      return this.$store.getters.user_session.CharacterType
    },
    StorewechatSettingType() {
      return this.$store.getters.wechatSettingType
    },
    SettingTagTypes() {
      return SettingTagTypes
    }
  },
  created() {
    if (
      this.$store.getters.user_session.CharacterType == CharacterType.Company &&
      this.$store.getters.wechatSettingType ==
      CompanyBasicWechatSettingType.Company
    ) {
      this.$store.dispatch('GET_STORES_DROPLIST')
    }
  },
  mounted() {
    this.onCharacterChange()
  },
  methods: {
    // 进店时间选择
    onMarketingChange() {
      this.onCharacterChange()
    },
    // 公司选择,整个渲染
    onCharacterChange() {
      this.getEnterLogStatistics()
      this.getExpendTimeStatistics()
      this.getExpendPriceStatistics()
      this.getExpendGoodsCategoryStatistics()
    },
    // 进店统计
    getEnterLogStatistics() {
      this.loadingTop = true
      const param = {
        characterId: this.characterId,
        dateStart: this.chartTime[0],
        dateEnd: this.chartTime[1]
      }
      MEMBERSHIP_API_REPORTENTERLOG_GETENTERLOGSTATISTICS(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          const dataArr = res.data.Data
          this.transactionRatioText = dataArr.transactionRatioText
          const numArr = [
            dataArr.memberCount, // 进店人数
            dataArr.enterCount, // 进店次数
            dataArr.averageEnterCount, // 平均进店人次
            dataArr.averageBudgetPrice, // 平均成本预算
            dataArr.averageGoodsPrice, // 意向商品平均金额
            dataArr.expendMemberCount, // 达成交易人数
            dataArr.avgDays, // 达成交易平均时间
            dataArr.minDays, // 达成交易最快时间
            dataArr.maxDays, // 达成交易最慢时间
            dataArr.avgPrice // 达成交易平均金额
          ]
          for (let i = 0; i < numArr.length; i += 1) {
            this.cardDatas[i].num = numArr[i]
          }
        }
        this.loadingTop = false
      })
    },
    // 达成交易时间分析
    getExpendTimeStatistics() {
      this.loadingTime = true
      const param = {
        characterId: this.characterId,
        dateStart: this.chartTime[0],
        dateEnd: this.chartTime[1]
      }
      MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDTIMESTATISTICS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDtimeStatistics = res.data.Data
        }
        this.loadingTime = false
      })
    },
    // 达成交易金额差值分析
    getExpendPriceStatistics() {
      this.loadingPrice = true
      const param = {
        characterId: this.characterId,
        dateStart: this.chartTime[0],
        dateEnd: this.chartTime[1]
      }
      MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDPRICESTATISTICS(param).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.TDpriceStatistics = res.data.Data
          }
          this.loadingPrice = false
        }
      )
    },
    // 达成交易货品类型变化
    getExpendGoodsCategoryStatistics() {
      this.loadingGoodsCategory = true
      const param = {
        characterId: this.characterId,
        dateStart: this.chartTime[0],
        dateEnd: this.chartTime[1]
      }
      MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDGOODSCATEGORYSTATISTICS(
        param
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDgoodsCategoryStatistics = res.data.Data
        }
        this.loadingGoodsCategory = false
      })
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
        case SettingTagTypes.ReportExpendTimeSpan:
          this.getExpendTimeStatistics()
          break
        case SettingTagTypes.ReportExpendPriceSpan:
          this.getExpendPriceStatistics()
          break
        default:
          return
      }
    }
  },
  components: {
    character,
    card,
    chartHd,
    chartBd,
    settingTagModal
  }
}
</script>
<style lang="scss" scoped>
.summary {
  padding: 5px 5px 5px;
  margin-bottom: 10px;
  background: $bg-color;
  .hd {
    padding: 0 5px;
  }
  .bd {
    ul {
      width: calc(100% - 280px);
      padding: 0 5px;
      li {
        float: left;
        width: 20%;
        padding: 0 5px;
        margin-top: 5px;
        .card {
          background: $white;
        }
      }
    }
    .fl {
      &.sp {
        width: 280px;
        height: 210px;
        margin-top: 5px;
        background: $light-blue;
        text-align: center;
        color: $white;
        font-size: $base-font;
        p {
          height: 48px;
          margin: 65px 0 16px;
          font-size: 48px;
        }
      }
    }
  }
}
</style>

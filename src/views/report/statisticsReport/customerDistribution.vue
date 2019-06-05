<template>
  <div class="customer-distribution">
    <chart-hd>
      <div class="fl bold">
        粉丝来源分布
      </div>
      <div class="fl item">
        <character
          ref="character1"
          @onCharacterChange="onCharacterChange('fans')"
        ></character>
      </div>
    </chart-hd>
    <chart-bd
      :tableData="TDfansSource"
      :tableColumn="TCfansSource"
      :loadingChartBd="loadingFans"
      chartTotalName="粉丝总数"
    />
    <chart-hd>
      <div class="fl bold">
        客户身份分布
      </div>
      <div class="fl item">
        <character
          ref="character2"
          @onCharacterChange="onCharacterChange('identity')"
        ></character>
      </div>
    </chart-hd>
    <chart-bd
      :tableData="TDcustomerIdentity"
      :tableColumn="TCcustomerIdentity"
      :loadingChartBd="loadingIdentity"
    />
    <template v-if="StoreCharacterType != EnumCharacterType.Group">
      <chart-hd>
        <div class="fl bold">
          会员等级分布
        </div>
        <div class="fl item">
          <character
            ref="character3"
            @onCharacterChange="onCharacterChange('level')"
          ></character>
        </div>
      </chart-hd>
      <chart-bd
        :tableData="TDmemberLevel"
        :tableColumn="TCmemberLevel"
        :loadingChartBd="loadingLevel"
      />
      <chart-hd>
        <div class="fl bold">
          客户分组分布
        </div>
        <div class="fl item">
          <character
            ref="character4"
            @onCharacterChange="onCharacterChange('group')"
          ></character>
        </div>
      </chart-hd>
      <chart-bd
        :tableData="TDcustomerGroup"
        :tableColumn="TCcustomerGroup"
        :loadingChartBd="loadingGroup"
      />
    </template>
  </div>
</template>
<script>
import character from './templateCharacter'
import chartHd from './templateChartHd'
import chartBd from './templateChartBd'
import {
  MEMBERSHIP_API_REPORT_GETMEMBERSUBSCRFROMCHART,
  MEMBERSHIP_API_REPORT_GETMEMBERTYPECHART,
  MEMBERSHIP_API_REPORT_GETMEMBERLEVELCHART,
  MEMBERSHIP_API_REPORT_GETMEMBERGROUPCHART
} from '@/apis/membership'
import { CharacterType } from '@/enums/common.js'
export default {
  data() {
    return {
      TDfansSource: [], // 粉丝来源分布数据
      TDcustomerIdentity: [], // 客户身份分布数据
      TDmemberLevel: [], // 会员等级分布数据
      TDcustomerGroup: [], // 客户分组分布数据
      // loading相关
      loadingFans: false,
      loadingIdentity: false,
      loadingLevel: false,
      loadingGroup: false,
      // 粉丝来源分布表格
      TCfansSource: [
        {
          label: '来源',
          type: 'labelString'
        },
        {
          label: '数量',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 客户身份分布表格
      TCcustomerIdentity: [
        {
          label: '身份',
          type: 'labelString'
        },
        {
          label: '数量',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 会员等级分布表格
      TCmemberLevel: [
        {
          label: '等级',
          type: 'label'
        },
        {
          label: '数量',
          type: 'counts'
        },
        {
          label: '占比',
          type: 'proportion'
        }
      ],
      // 客户分组分布表格
      TCcustomerGroup: [
        {
          label: '分组',
          type: 'label'
        },
        {
          label: '数量',
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
    EnumCharacterType() {
      return CharacterType
    },
    StoreCharacterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  mounted() {
    this.getMemberSubscrFromChart()
    this.getMemberTypeChart()
    this.getMemberLevelChart()
    this.getMemberGroupChart()
  },
  methods: {
    // 获取characterId
    getcharacterId(n) {
      return this.$refs['character' + n].characterIdArr[
        this.$refs['character' + n].characterIdArr.length - 1
      ]
    },
    // 公司选择
    onCharacterChange(p) {
      switch (p) {
        case 'fans':
          this.getMemberSubscrFromChart()
          break
        case 'identity':
          this.getMemberTypeChart()
          break
        case 'level':
          this.getMemberLevelChart()
          break
        case 'group':
          this.getMemberGroupChart()
          break
        default:
          return
      }
    },
    // 会员来源分布统计
    getMemberSubscrFromChart() {
      this.loadingFans = true
      MEMBERSHIP_API_REPORT_GETMEMBERSUBSCRFROMCHART(
        this.getcharacterId(1)
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TDfansSource = res.data.Data
        }
        this.loadingFans = false
      })
    },
    // 会员类型分布统计
    getMemberTypeChart() {
      this.loadingIdentity = true
      MEMBERSHIP_API_REPORT_GETMEMBERTYPECHART(this.getcharacterId(2)).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.TDcustomerIdentity = res.data.Data
          }
          this.loadingIdentity = false
        }
      )
    },
    // 会员等级统计
    getMemberLevelChart() {
      this.loadingLevel = true
      MEMBERSHIP_API_REPORT_GETMEMBERLEVELCHART(this.getcharacterId(3)).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.TDmemberLevel = res.data.Data
          }
          this.loadingLevel = false
        }
      )
    },
    // 会员分组统计
    getMemberGroupChart() {
      this.loadingGroup = true
      MEMBERSHIP_API_REPORT_GETMEMBERGROUPCHART(this.getcharacterId(4)).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.TDcustomerGroup = res.data.Data
          }
          this.loadingGroup = false
        }
      )
    }
  },
  components: {
    character,
    chartHd,
    chartBd
  }
}
</script>
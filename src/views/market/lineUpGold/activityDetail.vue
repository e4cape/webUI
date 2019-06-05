<template>
  <div v-loading="detailLoading">
    <table v-if="characterType === CharacterType.Lingcb" class="table m-b-10">
      <tr>
        <td>
          <div>公司编码</div>
        </td>
        <td>
          <div class="overflow-ellipsis">{{detail.CompanyCode}}</div>
        </td>
        <td>
          <div>公司名称</div>
        </td>
        <td>
          <div class="overflow-ellipsis">{{detail.CompanyName}}</div>
        </td>
        <td>
          <div>门店编码</div>
        </td>
        <td>
          <div class="overflow-ellipsis">{{detail.StoreCode}}</div>
        </td>
        <td>
          <div>门店名称</div>
        </td>
        <td>
          <div class="overflow-ellipsis">{{detail.StoreName}}</div>
        </td>
      </tr>
    </table>
    <table class="table">
      <tr>
        <td>
          <div>活动ID</div>
        </td>
        <td>{{detail.QueueId}}</td>
        <td>
          <div>创建时间</div>
        </td>
        <td>{{formatDate(detail.CreateTime, 'YYYY-MM-DD HH:mm:ss')}}</td>
        <td>
          <div>创建人</div>
        </td>
        <td>{{detail.CreateUser}}</td>
      </tr>
      <tr>
        <td>状态</td>
        <td colspan="5">
          <div class="state">{{QueueReceiveGoldStatus.Types[detail.CheckStatus] + (detail.CheckStatus === QueueReceiveGoldStatus.Abandon ? `（${detail.CheckNote}）` : '')}}</div>
        </td>
      </tr>
    </table>
    <table class="table m-t-10">
      <tr>
        <td>活动时间</td>
        <td>{{formatDate(detail.ActivityStart, 'YYYY-MM-DD') + " ~ " + formatDate(detail.ActivityStop, 'YYYY-MM-DD')}}</td>
      </tr>
      <tr>
        <td>参与条件</td>
        <td>
          <p>消费指定材质商品可参与：</p>
          <p class="p-l-10">{{detail.MaterialTypes && detail.MaterialTypes.split(',').map(value => materialType.Types[value]).join('，')}}</p>
          <p>消费金额限制：</p>
          <p
            class="p-l-10"
          >{{detail.LimitType === QueueCashType.NotFullPrice ? QueueCashType.Types[detail.LimitType] : '消费' + QueueActivityType.Types[detail.CashType] + '满' + $root.toFloat(detail.CashPrice) + '元可参与'}}</p>
        </td>
      </tr>
      <tr>
        <td>领取黄金成色</td>
        <td>{{goldType.Types[detail.CategoryType]}}</td>
      </tr>
      <tr>
        <td>活动黄金总数</td>
        <td>{{detail.QryGram ? $root.toFloat(detail.QryGram,3) + '克' : '不限'}}</td>
      </tr>
      <tr>
        <td>活动金池设置</td>
        <td>提取参与活动销售单每单 {{QueueActivityType.Types[detail.ActivityType1] + $root.toFloat(detail.Scale1,1,100)}}% 投入金池，每单提取上限 {{$root.toFloat(detail.LimitGram,3)}} 克</td>
      </tr>
      <tr>
        <td>顾客领取设置</td>
        <td>按顾客参与活动销售单 {{QueueActivityType.Types[detail.ActivityType2] + $root.toFloat(detail.Scale2,1,100)}}% 计算</td>
      </tr>
      <tr>
        <td>领取折算金价</td>
        <td>{{$root.toFloat(detail.GoldPrice)}} 元/g</td>
      </tr>
      <tr>
        <td>单人领取上限</td>
        <td>{{$root.toFloat(detail.ReceiveLimit,3)}} 克/人/单</td>
      </tr>
      <tr>
        <td>领取规则</td>
        <td>按顾客购买时间排队领取，先消费先领取，活动结束或终止则排队结束,未领完的排队者作废</td>
      </tr>
      <tr>
        <td>发放规则</td>
        <td>金池黄金数等于待领取顾客应领黄金数时自动发放</td>
      </tr>
      <tr>
        <td>使用有效期</td>
        <td>{{detail.Validity ? detail.Validity + '天' : '不限'}}</td>
      </tr>
      <tr>
        <td>使用设置</td>
        <td>
          <div>
            <p>{{detail.MaterialTypes1 && detail.MaterialTypes1.split(',').map(value => materialType.Types[value]).join('，')}}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td>使用折算金价</td>
        <td>{{QueueGoldType.Types[detail.GoldType]}}</td>
      </tr>
      <tr v-if="storeItem.length > 0">
        <td>参与门店</td>
        <td>
          <div>
            <el-table :data="storeItem">
              <el-table-column prop="StoreName" label="门店名称"></el-table-column>
              <el-table-column prop="StoreAdd" label="地址"></el-table-column>
            </el-table>
          </div>
        </td>
      </tr>
      <tr>
        <td>活动说明</td>
        <td class="wrap">
          <div class="break-word" v-html="detail.Note"></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET
} from '@/apis/marketing'
import dayjs from 'dayjs'
import {
  QueueCashType,
  QueueActivityType,
  QueueGoldType,
  QueueReceiveGoldStatus
} from '@/enums/marketing'
import {
  CharacterType,
  YNStatus,
} from '@/enums/common'
export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      QueueCashType,
      QueueGoldType,
      QueueActivityType,
      QueueReceiveGoldStatus,
      detailLoading: false,
      detail: {
      },
      storeItem: []
    }
  },
  computed: {
    materialType() {
      return this.$store.getters.materialType
    },
    goldType() {
      return this.$store.getters.goldType
    },
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return parseInt(this.$store.getters.wechatSettingType)
    }
  },
  created() {
    this.getEnums()
    this.getData()
  },
  methods: {
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    getData() {
      this.detailLoading = true
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET({
        QueueId: this.$route.params.id
      })
        .then(res => {
          this.detailLoading = false
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data.Basic
            this.storeItem = res.data.Data.StoreItem || []
          }
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    formatDate(val, format) {
      if (val) {
        return val.substr(0, 4) === '2100'
          ? '不限结束日期'
          : dayjs(new Date(val)).format(format)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.break-word{
  word-wrap: break-word;
  word-break: normal; 
}
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  td {
    padding: 8px 0;
    color: #333;
    border: 1px solid #e5e5e5;
    white-space: nowrap;
    &.wrap{
      white-space: pre-wrap
    }
    p {
      line-height: 1.5;
    }
    &:nth-of-type(odd) {
      width: 120px;
      text-align: center;
    }
    &:nth-of-type(even) {
      padding-left: 10px;
      padding-right: 10px;
    }
    .overflow-ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

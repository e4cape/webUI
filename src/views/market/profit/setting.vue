<template>
  <div class="content" v-loading="$store.getters.tb_loading">
    <p class="title">参与营销产品，收益赠送设置</p>
    <div class="p-y-10">
      <el-radio-group name="btnProfitType" v-model="profitType" :disabled="characterType==CharacterType.Store&&wechatSettingType == CompanyBasicMountType.Company">
        <el-radio v-for="item in profitTypeOpt.TypeArray" :key="item.KeyId" :label="parseInt(item.KeyId)">{{item.Value}}</el-radio>
      </el-radio-group>
    </div>
    <div class="p-y-10" v-if="characterType==CharacterType.Company||wechatSettingType == CompanyBasicMountType.Store">
      <el-button name="btnUpdateProfitType" type="primary" @click="updateProfitType" v-loading="$store.getters.is_loading">确定</el-button>
    </div>
  </div>
</template>

<script>
import { RetailOrderSellSettleProfitType } from '@/enums/order'
import { CharacterType } from '@/enums/common'
import { CompanyBasicMountType } from '@/enums/merchant'
import {
  MARKETING_API_STORE_SETTING_PROFIT_GET,
  MARKETING_API_STORE_SETTING_PROFIT_UPDATE
} from '@/apis/marketing'
export default {
  data() {
    return {
      CharacterType,
      CompanyBasicMountType,
      profitTypeOpt: RetailOrderSellSettleProfitType,
      profitType: ''
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  created() {
    this.getCurProfitType()
  },
  methods: {
    getCurProfitType() {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_STORE_SETTING_PROFIT_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.profitType = res.data.Data ? res.data.Data.ProfitType : ''
        }
      })
    },
    updateProfitType() {
      this.$store.commit('SET_BTN_LOADING', true)
      MARKETING_API_STORE_SETTING_PROFIT_UPDATE({
        CharacterId: this.$store.getters.user_session.CharacterId,
        ProfitType: this.profitType
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.content {
  padding-left: 10px;
}
.title {
  padding: 0;
  margin: 0;
  height: 34px;
  color: #777;
  line-height: 34px;
  font-size: 12px;
}
</style>
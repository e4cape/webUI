<template>
  <div class="return-setter">
    <span>退款方式：</span><span v-if="editFlg">{{returnType == refundTypes.Auto ? '自动退款': '手动退款'}}</span>
    <span v-else>
      <el-radio-group name="returnType" v-model="returnType">
        <el-radio :label="parseInt(refundTypes.Auto)">自动退款</el-radio>
        <el-radio :label="parseInt(refundTypes.Manual)">手动退款</el-radio>
      </el-radio-group>
    </span>
    <template v-if="!($store.getters.user_session.CharacterType == characterType.Store && $store.getters.wechatSettingType == companyBasicWechatSettingType.Company)">
      <el-button name="btnEdit" style="margin-left: 20px;" v-if="editFlg" type="primary" @click="editFlg=false">修改</el-button>
      <el-button name="btnSave" style="margin-left: 20px;" v-else :loading="$store.getters.is_loading" type="primary" @click="saveReturnSetter">保存</el-button>
    </template>
  </div>
</template>

<script>
import {
  RefundType, CompanyBasicWechatSettingType
} from '@/enums/spread'
import { CharacterType } from '@/enums/common.js'
import {
  SPREAD_API_SPR_SETTINGDETAIL, SPREAD_API_SPR_SETTINGUPDATE
} from '@/apis/spread'
export default {
  data () {
    return {
      characterType: CharacterType,
      companyBasicWechatSettingType: CompanyBasicWechatSettingType,
      refundTypes: RefundType,
      editFlg: true,
      returnType: ''
    }
  },
  methods: {
    getSettingDetail () {
      SPREAD_API_SPR_SETTINGDETAIL().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnType = res.data.Data.RefundType
        }
      })
    },
    saveReturnSetter () {
      this.$store.commit('SET_FULL_LOADING', true)
      SPREAD_API_SPR_SETTINGUPDATE(this.returnType).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.getSettingDetail()
          this.editFlg = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted () {
    this.getSettingDetail()
  }
}
</script>
<style lang="scss">
.return-setter {
  padding: 20px; 
  text-align: left;
}
</style>

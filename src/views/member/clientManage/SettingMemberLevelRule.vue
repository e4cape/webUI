<template>
  <div class="content">
    <el-alert
      title="注：填0表示不自动升级"
      type="warning"
    ></el-alert>
    <el-form
      :label-position="'right'"
      label-width="85px"
      ref="form"
      :model="form"
      show-message
    >
      <el-form-item
        label="升级方式："
        class="is-required"
        style="margin-bottom: 0;"
      >
        <el-radio-group
          name="radioGroupMemberUpgradeType"
          v-model="form.memberUpgradeType"
        >
          <el-radio
            :disabled="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType && $store.getters.user_session.CharacterType != characterType.Company"
            v-for="(item,index) in memberUpgradeTypes.Types"
            :key="index"
            :label="parseInt(item.key)"
          >{{item.title}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-table
      size="mini"
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="settingOptionId"
        label="会员等级"
        width="160"
        show-overflow-tooltip
        fixed="left"
      >
        <template slot-scope="scope">
          {{scope.row.index}}级
        </template>
      </el-table-column>
      <el-table-column
        prop="settingOptionName"
        label="等级名称"
        min-width="280"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            name="inputSettingOptionName"
            :disabled="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType && $store.getters.user_session.CharacterType != characterType.Company"
            v-model="scope.row.settingOptionName"
            maxlength="10"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        key="expend"
        v-if="form.memberUpgradeType == memberUpgradeTypes.ExpendTotal"
        prop="expendThreshold"
        label="累积消费金额自动升级"
        min-width="280"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            name="inputExpendThreshold"
            :disabled="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType && $store.getters.user_session.CharacterType != characterType.Company"
            v-model="scope.row.expendThreshold"
            @keyup.native="scope.row.expendThreshold = $root.toFixed(scope.row.expendThreshold, 0)"
            maxlength="8"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        key="score"
        v-if="form.memberUpgradeType == memberUpgradeTypes.ScoreTotal"
        prop="scoreThreshold"
        label="累积积分值自动升级"
        min-width="280"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-input
            name="inputScoreThreshold"
            :disabled="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType && $store.getters.user_session.CharacterType != characterType.Company"
            v-model="scope.row.scoreThreshold"
            @keyup.native="scope.row.scoreThreshold = $root.toFixed(scope.row.scoreThreshold, 0)"
            maxlength="8"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="updateLevel mb-10" v-if="form.memberUpgradeType != memberUpgradeTypes.Manual">
      <div class="title mb-20">更新现有会员的等级：</div>
      <el-radio-group v-model="levelVal">
        <div class="mb-10" v-for="(item,index) in memberUpdateLevelTypes.Types" :key="index">
          <el-radio :label="item.key" :disabled="companyBasicWechatSettingType.Company == $store.getters.wechatSettingType && $store.getters.user_session.CharacterType != characterType.Company">{{item.title}}
            <span v-if="item.key == memberUpdateLevelTypes.NotUpdate">（现有会员保持原等级）</span>
            <span v-else-if="item.key == memberUpdateLevelTypes.Downgrade">（会员达不到新规则要求，自动降级）</span>
            <span v-else-if="item.key == memberUpdateLevelTypes.NotDowngrade">（会员达不到新规则要求，保持原等级）</span>
          </el-radio>
        </div>
      </el-radio-group>
    </div>
    <!-- End 数据表格 -->
    <el-row
      class="buttons"
      v-if="companyBasicWechatSettingType.Store == $store.getters.wechatSettingType || $store.getters.user_session.CharacterType == characterType.Company"
    >
      <el-col
        :span="12"
        class="tl"
      >
        <el-button
          name="btnSaveData"
          type="primary"
          @click="saveData"
          :loading="$store.getters.is_loading"
        >保存</el-button>
      </el-col>
    </el-row>
    <!-- <el-dialog
      title="批量更新等级"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="des mb">
        <i class="icons el-icon-info"></i>
        <span class="legend">
          <div>您已经修改了会员等级规则，</div>
          <div>可以批量更新现有会员的等级！</div>
        </span>
      </div>
       
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  MemberUpgradeTypes,
  CompanyBasicWechatSettingType,
  MemberUpdateLevelTypes
} from '@/enums/membership'
import { CharacterType } from '@/enums/common'
import {
  MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_GETSETTINGS,
  MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_SAVESETTINGS
} from '@/apis/membership'
export default {
  data() {
    return {
      characterType: CharacterType,
      memberUpgradeTypes: MemberUpgradeTypes,
      companyBasicWechatSettingType: CompanyBasicWechatSettingType,
      memberUpdateLevelTypes: MemberUpdateLevelTypes,
      form: {
        memberUpgradeType: ''
      },
      data: [],
      levelVal: MemberUpdateLevelTypes.Types[0].key,
      dialogVisible: true
    }
  },
  methods: {
    saveData() {
      var bool = false
      this.data.forEach(res => {
        if (res.scoreThreshold === '' || res.expendThreshold === '') {
          bool = true
        }
      })
      if (bool) {
        this.$message.error('数值输入有误!')
        return false
      }
      this.$store.commit('SET_BTN_LOADING', true)
      MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_SAVESETTINGS({
        memberUpgradeType: this.form.memberUpgradeType,
        settingItems: this.data,
        updateType: this.levelVal
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存成功')
          this.getData()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_GETSETTINGS().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form.memberUpgradeType = res.data.Data.memberUpgradeType
          this.levelVal = res.data.Data.updateType ? res.data.Data.updateType.toString() : MemberUpdateLevelTypes.Types[0].key
          this.data = res.data.Data.settingItems
          this.data.map((item, index) => {
            item.index = index + 1
            return item
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted() {
    this.getData()
    console.log(this.$store.getters.wechatSettingType)
  }
}
</script>
<style lang="scss" scoped>
.updateLevel {
  border-bottom: 1px solid #e5e5e5;
  padding: 20px;
  .title {
    font-size: 14px;
  }
  span {
    color: #bbb;
  }
}
.mt-10 {
  margin-top: 10px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-20 {
  margin-bottom: 20px;
}
</style>


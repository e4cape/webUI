<template>
  <el-dialog title="升级" :visible.sync="upgradeModal" width="55%" @close="closeUpgradeModal" class="upgradeDialog">
    <div class="des">
      <div>升级后，线下会员的资料将合并到微信会员中，积分累加到微信会员中。</div>
      <div>升级后无法撤回！请核对线下会员与微信会员的资料，确认无误再升级！</div>
    </div>
    <p class="title">线下会员：</p>
    <user-Info :scope="currUserInfo" :isLink="false"></user-Info>
    <p class="title">微信会员：</p>
    <el-radio-group name="radioUserInfo" v-model="radioUserInfo" size="mini">
      <el-radio v-for="item in upgradeInfo" :key="item.memberId" border :label="item.memberId">
        <user-Info :scope="item" class="userInfo" :isLink="false"></user-Info>
      </el-radio>
    </el-radio-group>
    <span slot="footer">
      <el-button name="btnConfirmUpgrade" size="small" @click="confirmUpgrade" type="primary">确定升级</el-button>
      <el-button name="btnCloseUpgradeModal" size="small" @click="closeUpgradeModal">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import userInfo from '@/components/scrm/userInfo.vue'
import {
  MEMBERSHIP_API_MEMBERUPGRADE_UPGRADE,
  MEMBERSHIP_API_MEMBERUPGRADE_GETUPGRADEMEMBERS
} from '@/apis/membership.js'
export default {
  components: {
    userInfo
  },
  props: {
    visible: {
      type: Boolean
    },
    currUserInfo: {
      type: Object
    }
  },
  data() {
    return {
      upgradeModal: this.visible,
      upgradeInfo: [],
      radioUserInfo: ''
    }
  },
  methods: {
    confirmUpgrade() {
      if (this.radioUserInfo == '') {
        this.$message({
          showClose: true,
          message: '请选择要合并的微信会员',
          type: 'error'
        })
        return
      }
      const para = {
        memberId: this.currUserInfo.memberId,
        toMemberId: this.radioUserInfo
      }
      MEMBERSHIP_API_MEMBERUPGRADE_UPGRADE(para).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            showClose: true,
            message: '合并成功',
            type: 'success'
          })
          this.$emit('upgradeClick', false)
        }
      })
    },
    // 升级的会员信息
    getUpradeInfo() {
      MEMBERSHIP_API_MEMBERUPGRADE_GETUPGRADEMEMBERS({
        memberId: this.currUserInfo.memberId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.upgradeInfo = res.data.Data
        }
      })
    },

    // 关闭弹窗
    closeUpgradeModal() {
      this.radioUserInfo = ''
      this.$emit('closeClick', false)
    }
  },
  watch: {
    visible(val) {
      this.upgradeModal = val
      if (val) {
        this.getUpradeInfo()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.upgradeDialog {
  /deep/ .el-radio--mini.is-bordered {
    height: 73px;
    width: 620px;
  }
  /deep/ .el-radio__input {
    float: left;
    margin-top: 23px;
  }
  .el-radio + .el-radio {
    margin-left: 0;
  }
  .userInfo {
    display: inline-block;
    width: 580px;
  }
}
.des {
  margin-bottom: 30px;
  div {
    margin-bottom: 10px;
  }
}
.title {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>


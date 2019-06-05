<template>
  <div class="userInfo">
    <a v-if="scope.imageUrl && isLink">
      <img
        name="userInfoClick"
        :src="scope.imageUrl.indexOf('http') > -1 ? scope.imageUrl : $root.settings.DOMAIN_IMAGE + scope.imageUrl"
        alt="客户头像"
        class="avatar"
        @click="userInfoClick(scope.upgradeMemberId || scope.memberId, scope.upgradeStatus)"
      >
    </a>
    <span v-if="scope.imageUrl && !isLink">
      <img :src="scope.imageUrl.indexOf('http') > -1 ? scope.imageUrl : $root.settings.DOMAIN_IMAGE + scope.imageUrl" alt="客户头像" class="avatar">
    </span>
    <div class="con">
      <div class="con-t">
        <el-button
          name="btnUserInfoClick"
          class="el-button el-button--text"
          @click="userInfoClick(scope.upgradeMemberId || scope.memberId, scope.upgradeStatus && scope.upgradeStatus == 2 && scope.upgradeStatus)"
          v-if="isLink"
        >
          <span v-if="scope.aliasName">{{ scope.aliasName }}</span>
          <span v-if="scope.trueName">({{ scope.trueName }})</span>
        </el-button>
        <span v-else>
          <span v-if="scope.aliasName">{{ scope.aliasName }}</span>
          <span v-if="scope.trueName">({{ scope.trueName }})</span>
        </span>
        <span v-if="scope.sexyType == 1">
          <i class="icon-man"></i>
        </span>
        <span v-if="scope.sexyType == 3">
          <i class="icon-momen"></i>
        </span>
        <span class="cot-tag" v-if="scope.memberTypeText && scope.memberTypeText != ''">{{ scope.memberTypeText }}</span>
        <span class="cot-tag" v-if="scope.level">{{ scope.level }}</span>
        <span class="cot-tag" v-if="scope.group">{{ scope.group }}</span>
        <span class="cot-tag" v-if="scope.score">{{ scope.score }}</span>
      </div>
      <div class="second">
        <span class="vipCard" v-if="scope.vipCardNo">
          <i class="icon-card"></i>
          {{ scope.vipCardNo }}
        </span>
        <span class="mobile" v-if="scope.mobile">
          <i class="icon-tel"></i>
          {{ scope.mobile }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scope: {
      type: Object
    },
    isLink: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // users: this.scope
    }
  },
  methods: {
    userInfoClick(id, upgradeStatus) {
      console.log()
      if (upgradeStatus) {
        this.$router.push({
          path: '/member/clientManage/viewcustomer',
          query: {
            memberId: id, upgradeStatus
          }
        })
      } else {
        this.$router.push({
          path: '/member/clientManage/viewcustomer',
          query: {
            memberId: id
          }
        })
      }
    }
  },
  watch: {
    // scope(val, oldVal) {
    //   console.log()
    //   this.users = val
    //   if(val.imageUrl.indexOf('http') == -1) {
    //     console.log('没有')
    //   }else {
    //     console.log('有')
    //   }
    // },
  }
}
</script>
<style scoped lang="scss">
.userInfo {
  overflow: hidden;
  padding: 4px 0;
  position: relative;
  min-height: 55px;
  padding-left: 50px;
  .el-button--text {
    background: transparent;
    padding: 0;
    border: none;
  }
}
.avatar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 50px;
  height: 50px;
}
.con {
  float: left;
  margin-left: 10px;
  line-height: 23px;
  margin-top: 1px;
  .cot-tag {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    background-color: rgb(235, 176, 35);
    color: #fff;
    padding: 0 7px;
  }
  .con-t {
    overflow: hidden;
    span {
      // float: left;
      margin-right: 3px;
    }
  }
  .second {
    overflow: hidden;
    .mobile,
    .vipCard {
      float: left;
    }
    .mobile {
      margin-left: 4px;
    }
  }
}
.icon-momen {
  color: #ff6fce;
  font-size: 13px;
  margin-top: 3px;
  margin-right: 4px;
}
.icon-man {
  color: #61a9da;
  font-size: 13px;
  margin-top: 3px;
  margin-right: 4px;
}
.icon-tel,
.icon-card {
  float: left;
  color: #61a9da;
  font-size: 16px;
  margin-top: 3px;
  margin-right: 4px;
}
.icon-tel {
  font-size: 12px;
  margin-top: 5px;
}
</style>

<template>
  <div class="full-wrapper">
    <div class="nofound-box">
      <img src="../assets/images/noauthorized.png">
      <router-link :to="$store.getters.user_session.CharacterType == characterType.Lingcb ? '/home/platform' : $store.getters.user_session.CharacterType == characterType.Group ? '/home/group' : $store.getters.user_session.CharacterType == characterType.Company ? '/home/company' : $store.getters.user_session.CharacterType == characterType.Supplier ? '/home/supplier' : $store.getters.user_session.CharacterType == characterType.Provider ? '/home/provider' : '/home'" class="btn-link el-button--text btn-error" style="margin-top: 10px;"><span>返回首页</span></router-link>
    </div>
  </div>
</template>

<script>
import { CharacterType } from '@/enums/common'
export default {
  data() {
    return {
      characterType: CharacterType
    }
  }
}
</script>

<style lang="scss" scoped>
.full-wrapper {
  width: 100%;
  height: 700px;
  .nofound-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    img {
      display: block;
    }
    .btn-error {
      display: inline-block;
      margin: 0 20px;
      width: 100px;
      height: 34px;
      font-size: 14px;
      color: #399fe5;
      line-height: 32px;
      text-align: center;
      border: solid 1px #e5e5e5;
      cursor: pointer;
      i {
        margin-right: 7px;
        vertical-align: middle;
        font-size: 16px;
      }
      span {
        vertical-align: middle;
      }
      &:hover {
        border-color: #399fe5;
      }
    }
  }
}
</style>

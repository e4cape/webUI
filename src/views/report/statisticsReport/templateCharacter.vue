<template>
  <el-cascader
    class="cascader-sp"
    v-if="StoreCharacterType == EnumCharacterType.Group"
    name="characterIdArr"
    v-model="characterIdArr"
    @change="onCharacterChange"
    :options="$store.getters.company_and_stores"
    :props="{value: 'CharacterId', label:'Name', children:'Stores'}"
    placeholder="所有公司"
    change-on-select
  />
</template>
<script>
import { CharacterType } from '@/enums/common.js'
export default {
  data() {
    return {
      characterIdArr: ['']
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
  methods: {
    onCharacterChange(v) {
      this.characterIdArr = v[0] == 0 ? [''] : v
      this.$emit('onCharacterChange')
    }
  },
  created() {
    if (this.StoreCharacterType == this.EnumCharacterType.Group) {
      this.$store.dispatch('GET_COMPANYS_DROPLIST')
    }
  }
}
</script>
<style lang="scss" scoped>
.cascader-sp {
  &.el-cascader--mini {
    line-height: 24px;
  }
  /deep/ .el-input--mini {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
    .el-input__icon {
      line-height: 24px;
    }
  }
}
</style>

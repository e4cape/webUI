<template>
  <el-row>
    <el-row class="m-y-5">
      <el-radio-group class="rg" v-model="scoreRadio">
        <el-radio :label="1">
          采购价 ×
          <el-input v-if="scoreRadio != 1" class="number" :disabled="scoreRadio != 1" maxlength="4" placeholder="倍率"></el-input>
          <el-input v-else class="number" v-model="wholesaleRate" :disabled="scoreRadio != 1" placeholder="倍率" maxlength="4"></el-input>
        </el-radio>
        <el-radio :label="2">
          零售价 ×
          <el-input v-if="scoreRadio != 2" class="number" :disabled="scoreRadio != 2" placeholder="倍率" maxlength="4"></el-input>
          <el-input v-else class="number" v-model="retailRate" :disabled="scoreRadio != 2" maxlength="4" placeholder="倍率"></el-input>
        </el-radio>
      </el-radio-group>
      <span class="red proxy-error" v-if="(scoreRadio == 1 && !wholesaleRate) || (scoreRadio == 2 && !retailRate)">请填写倍率</span>
    </el-row>
  </el-row>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      scoreRadio: 2,
      wholesaleRate: null,
      retailRate: 1
    }
  },
  watch: {
    data: {
      immediate: true,
      // 使用 scoreType  1 积分, 2 礼金 3 全选
      handler(newVal) {
        if (!newVal) {
          return
        }
        const {
          retailEnable,
          wholesaleEnable
        } = newVal

        if (wholesaleEnable) {
          this.scoreRadio = 1
        }

        if (retailEnable) {
          this.scoreRadio = 2
        }
        const self = this
        Object.keys(newVal).forEach(k => {
          self[k] = newVal[k]
        })
      }
    }
  },
  updated() {
    let data = {
      ...this.$data
    }
    const {
      scoreRadio, wholesaleRate, retailRate
    } = data
    if (!wholesaleRate.trim() || !retailRate.trim()) {
      this.$message.error('倍率不能为空')
    }
    if (scoreRadio == 1) {
      data.wholesaleEnable = 1
      data.retailEnable = 0
    } else if (scoreRadio == 2) {
      data.retailEnable = 1
      data.wholesaleEnable = 0
    }
    this.$emit('change', data)
  }
}
</script>

<style lang="scss" scoped>
.number {
  width: 50px;
  /deep/ .el-input__inner {
    padding: 0 8px;
  }
}
.rg {
  margin: 0 20px;
}
</style>
